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

      // Process Stripe refund if payment was made
      if (booking.paymentIntentId && refundPercent > 0) {
        try {
          const refundAmount = Math.round((booking.totalAmount * refundPercent) / 100 * 100);
          await stripe.refunds.create({
            payment_intent: booking.paymentIntentId,
            amount: refundAmount,
          });
        } catch (stripeError) {
          console.error("Stripe refund failed:", stripeError);
          // Continue with cancellation even if refund fails — manual intervention needed
        }
      }

      const updated = await db.booking.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      return Response.json({
        booking: updated,
        cancellation: {
          refundPercent,
          cancelledBy: isOwner ? "HOST" : "GUEST",
          reason: isOwner
            ? "Host cancellation — full refund"
            : hoursUntilStart >= 24
            ? "Guest cancellation — full refund"
            : hoursUntilStart > 0
            ? "Late cancellation — 50% refund"
            : "No-show — no refund",
        },
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
