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

    // Create a PaymentIntent with application fee
    const totalAmountCents = Math.round(booking.totalAmount * 100);
    const platformFeeCents = Math.round(booking.platformFee * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountCents,
      currency: "usd",
      application_fee_amount: platformFeeCents,
      transfer_data: {
        destination: host.stripeAccountId,
      },
      metadata: {
        bookingId: booking.id,
        listingId: booking.listingId,
        renterId: session.user.id,
      },
    });

    // Save the paymentIntentId to the booking
    await db.booking.update({
      where: { id: bookingId },
      data: { paymentIntentId: paymentIntent.id },
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
