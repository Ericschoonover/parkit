import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        listing: { select: { ownerId: true } },
        renter: { select: { id: true } },
      },
    });

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const isOwner = booking.listing.ownerId === session.user.id;
    const isRenter = booking.renterId === session.user.id;

    if (!isOwner && !isRenter) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { beforePhotos, afterPhotos, action } = body;

    // Handle cancellation
    if (action === "cancel") {
      if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
        return Response.json({ error: "Booking cannot be cancelled in its current state" }, { status: 400 });
      }

      const now = new Date();
      const startTime = new Date(booking.startTime);
      const hoursUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      let refundPercent = 0;
      if (isOwner) {
        // Host cancels: full refund always
        refundPercent = 100;
      } else if (hoursUntilStart >= 24) {
        // Guest cancels 24+ hours before: full refund
        refundPercent = 100;
      } else if (hoursUntilStart > 0) {
        // Guest cancels <24 hours before: partial refund (50%)
        refundPercent = 50;
      }
      // No-show (hoursUntilStart <= 0): 0% refund

      // Process Stripe refund for parking payment
      if (booking.paymentIntentId && refundPercent > 0) {
        try {
          const refundAmount = Math.round((booking.totalAmount - booking.damageDeposit) * refundPercent / 100 * 100);
          await stripe.refunds.create({
            payment_intent: booking.paymentIntentId,
            amount: refundAmount,
          });
        } catch (stripeError) {
          console.error("Stripe parking refund failed:", stripeError);
        }
      }

      // Refund the deposit if it's still held
      if (booking.depositPaymentIntentId && booking.depositStatus === "HELD") {
        try {
          await stripe.refunds.create({
            payment_intent: booking.depositPaymentIntentId,
          });
        } catch (stripeError) {
          console.error("Stripe deposit refund failed:", stripeError);
        }
      }

      const updated = await db.booking.update({
        where: { id },
        data: {
          status: "CANCELLED",
          depositStatus: booking.depositStatus === "HELD" ? "REFUNDED" : booking.depositStatus,
        },
      });

      return Response.json({
        booking: updated,
        cancellation: {
          refundPercent,
          depositRefunded: booking.depositStatus === "HELD",
          cancelledBy: isOwner ? "HOST" : "GUEST",
          reason: isOwner
            ? "Host cancellation — full refund including deposit"
            : hoursUntilStart >= 24
            ? "Guest cancellation — full refund including deposit"
            : hoursUntilStart > 0
            ? "Late cancellation — 50% parking refund + full deposit refund"
            : "No-show — no parking refund, deposit refunded",
        },
      });
    }

    // Handle deposit claim (host reports damage)
    if (action === "claim-deposit") {
      if (!isOwner) {
        return Response.json({ error: "Only the host can claim the deposit" }, { status: 403 });
      }
      if (booking.depositStatus !== "HELD") {
        return Response.json({ error: "Deposit is not available to claim" }, { status: 400 });
      }

      // Transfer deposit from platform to host's connected account
      const listing = await db.listing.findUnique({
        where: { id: booking.listingId },
        select: { ownerId: true },
      });
      const host = await db.user.findUnique({
        where: { id: listing!.ownerId },
        select: { stripeAccountId: true },
      });

      if (!host?.stripeAccountId) {
        return Response.json({ error: "Host has no Stripe account" }, { status: 400 });
      }

      try {
        const depositCents = Math.round(booking.damageDeposit * 100);
        await stripe.transfers.create({
          amount: depositCents,
          currency: "usd",
          destination: host.stripeAccountId,
          metadata: {
            bookingId: booking.id,
            type: "deposit_claim",
          },
        });
      } catch (stripeError) {
        console.error("Stripe deposit transfer failed:", stripeError);
        return Response.json({ error: "Failed to transfer deposit" }, { status: 500 });
      }

      const updated = await db.booking.update({
        where: { id },
        data: { depositStatus: "CLAIMED" },
      });

      return Response.json({
        booking: updated,
        message: `Deposit of $${booking.damageDeposit.toFixed(2)} transferred to your account`,
      });
    }

    // Handle deposit release (host releases deposit to guest, no damage)
    if (action === "release-deposit") {
      if (!isOwner) {
        return Response.json({ error: "Only the host can release the deposit" }, { status: 403 });
      }
      if (booking.depositStatus !== "HELD") {
        return Response.json({ error: "Deposit is not available to release" }, { status: 400 });
      }

      if (!booking.depositPaymentIntentId) {
        return Response.json({ error: "No deposit payment found" }, { status: 400 });
      }

      try {
        await stripe.refunds.create({
          payment_intent: booking.depositPaymentIntentId,
        });
      } catch (stripeError) {
        console.error("Stripe deposit release failed:", stripeError);
        return Response.json({ error: "Failed to release deposit" }, { status: 500 });
      }

      const updated = await db.booking.update({
        where: { id },
        data: { depositStatus: "RELEASED" },
      });

      return Response.json({
        booking: updated,
        message: `Deposit of $${booking.damageDeposit.toFixed(2)} refunded to guest`,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (beforePhotos !== undefined) {
      if (!isRenter) {
        return Response.json({ error: "Only the renter can upload before photos" }, { status: 403 });
      }
      updateData.beforePhotos = JSON.stringify(beforePhotos);
    }

    if (afterPhotos !== undefined) {
      const existingAfter = JSON.parse(booking.afterPhotos) as string[];
      const newAfter = [...existingAfter, ...afterPhotos];
      updateData.afterPhotos = JSON.stringify(newAfter);
    }

    const updated = await db.booking.update({
      where: { id },
      data: updateData,
    });

    return Response.json({ booking: updated });
  } catch (error) {
    console.error("Update booking error:", error);
    return Response.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
