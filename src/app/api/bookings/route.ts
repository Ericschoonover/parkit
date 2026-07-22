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
    const { listingId, startTime, endTime, eventId } = body;

    if (!listingId || !startTime || !endTime) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get listing with owner's Stripe info
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      include: {
        owner: {
          select: { stripeAccountId: true, stripeOnboarded: true },
        },
      },
    });

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check host has Stripe connected
    if (!listing.owner.stripeAccountId || !listing.owner.stripeOnboarded) {
      return Response.json({ error: "This host has not set up payments yet" }, { status: 400 });
    }

    // Check for conflicting bookings
    const existingBooking = await db.booking.findFirst({
      where: {
        listingId,
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [
          {
            startTime: { lte: new Date(endTime) },
            endTime: { gte: new Date(startTime) },
          },
        ],
      },
    });

    if (existingBooking) {
      return Response.json({ error: "Time slot is not available" }, { status: 409 });
    }

    // Calculate pricing
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const parkingCost = Number(listing.pricePerHour) * hours;
    const platformFee = Math.round(parkingCost * 0.15 * 100) / 100;
    const ownerPayout = parkingCost - platformFee;
    const damageDeposit = Number(listing.damageDeposit) || 50;
    const totalAmount = parkingCost + platformFee + damageDeposit;

    // Create booking as PENDING
    const booking = await db.booking.create({
      data: {
        listingId,
        renterId: session.user.id,
        eventId: eventId || null,
        startTime: start,
        endTime: end,
        totalAmount,
        platformFee,
        ownerPayout,
        damageDeposit,
        status: "PENDING",
      },
    });

    // Create two PaymentIntents:
    // 1) Parking — transferred to host via Connect
    // 2) Deposit — stays on platform (refundable/transferable later)
    const parkingCents = Math.round(parkingCost * 100);
    const feeCents = Math.round(platformFee * 100);
    const depositCents = Math.round(damageDeposit * 100);

    const parkingIntent = await stripe.paymentIntents.create({
      amount: parkingCents,
      currency: "usd",
      application_fee_amount: feeCents,
      transfer_data: {
        destination: listing.owner.stripeAccountId,
      },
      metadata: {
        bookingId: booking.id,
        listingId: listing.id,
        renterId: session.user.id,
        type: "parking",
      },
    });

    const depositIntent = await stripe.paymentIntents.create({
      amount: depositCents,
      currency: "usd",
      metadata: {
        bookingId: booking.id,
        listingId: listing.id,
        renterId: session.user.id,
        type: "deposit",
      },
    });

    // Save both paymentIntentIds
    await db.booking.update({
      where: { id: booking.id },
      data: {
        paymentIntentId: parkingIntent.id,
        depositPaymentIntentId: depositIntent.id,
      },
    });

    return Response.json({
      booking,
      clientSecret: parkingIntent.client_secret,
      depositClientSecret: depositIntent.client_secret,
    }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return Response.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await db.booking.findMany({
      where: {
        OR: [
          { renterId: session.user.id },
          { listing: { ownerId: session.user.id } },
        ],
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            photos: true,
          },
        },
        event: {
          select: {
            name: true,
            venue: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
    });

    return Response.json({ bookings });
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return Response.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
