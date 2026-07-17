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
    const { listingId, bookingId, rating, comment } = body;

    if (!listingId || !rating) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return Response.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Get listing to find owner
    const listing = await db.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    const review = await db.review.create({
      data: {
        bookingId: bookingId || `manual-${Date.now()}`,
        authorId: session.user.id,
        subjectId: listing.ownerId,
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
