import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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

    // Get listing
    const listing = await db.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
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
    const totalAmount = Number(listing.pricePerHour) * hours;
    const platformFee = Math.round(totalAmount * 0.15 * 100) / 100;
    const ownerPayout = totalAmount - platformFee;

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
        status: "CONFIRMED",
      },
    });

    return Response.json({ booking }, { status: 201 });
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
