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
    const { bookingId, rating, comment } = body;

    if (!bookingId || !rating) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return Response.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Fetch booking with listing owner info
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: { select: { ownerId: true } },
        renter: { select: { id: true } },
      },
    });

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "COMPLETED") {
      return Response.json({ error: "Can only review completed bookings" }, { status: 400 });
    }

    const isOwner = booking.listing.ownerId === session.user.id;
    const isRenter = booking.renterId === session.user.id;

    if (!isOwner && !isRenter) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Determine who is being reviewed
    // Renter reviews the host (listing owner), host reviews the renter
    const subjectId = isRenter ? booking.listing.ownerId : booking.renterId;

    // Check for existing review from this author on this booking
    const existing = await db.review.findFirst({
      where: {
        bookingId,
        authorId: session.user.id,
      },
    });

    if (existing) {
      return Response.json({ error: "You have already reviewed this booking" }, { status: 400 });
    }

    const review = await db.review.create({
      data: {
        bookingId,
        authorId: session.user.id,
        subjectId,
        rating: parseInt(rating),
        comment: comment || null,
      },
    });

    return Response.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Review error:", error);
    return Response.json({ error: "Failed to create review" }, { status: 500 });
  }
}
