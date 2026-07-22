import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return Response.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          include: {
            owner: {
              select: { stripeAccountId: true, stripeOnboarded: true },
            },
          },
        },
      },
    });

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.renterId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (booking.paymentIntentId) {
      return Response.json({ error: "Booking already paid" }, { status: 400 });
    }

    const host = booking.listing.owner;

    if (!host.stripeAccountId || !host.stripeOnboarded) {
      return Response.json({ error: "Host has not connected payments yet" }, { status: 400 });
    }

    // Two PaymentIntents: parking (to host) + deposit (stays on platform)
    const parkingCents = Math.round((booking.totalAmount - booking.damageDeposit) * 100);
    const feeCents = Math.round(booking.platformFee * 100);
    const depositCents = Math.round(booking.damageDeposit * 100);

    const parkingIntent = await stripe.paymentIntents.create({
      amount: parkingCents,
      currency: "usd",
      application_fee_amount: feeCents,
      transfer_data: {
        destination: host.stripeAccountId,
      },
      metadata: {
        bookingId: booking.id,
        listingId: booking.listingId,
        renterId: session.user.id,
        type: "parking",
      },
    });

    const depositIntent = await stripe.paymentIntents.create({
      amount: depositCents,
      currency: "usd",
      metadata: {
        bookingId: booking.id,
        listingId: booking.listingId,
        renterId: session.user.id,
        type: "deposit",
      },
    });

    // Save both paymentIntentIds
    await db.booking.update({
      where: { id: bookingId },
      data: {
        paymentIntentId: parkingIntent.id,
        depositPaymentIntentId: depositIntent.id,
      },
    });

    return Response.json({
      clientSecret: parkingIntent.client_secret,
      depositClientSecret: depositIntent.client_secret,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
