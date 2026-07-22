import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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
    const body = await request.json();
    const { action, reason } = body;

    if (action === "flag") {
      if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
        return Response.json({ error: "A reason is required to flag a review" }, { status: 400 });
      }

      const review = await db.review.findUnique({
        where: { id },
        include: {
          booking: {
            include: {
              listing: { select: { ownerId: true } },
              renter: { select: { id: true } },
            },
          },
        },
      });

      if (!review) {
        return Response.json({ error: "Review not found" }, { status: 404 });
      }

      // Only the review subject (person being reviewed) or their booking counterpart can flag
      const isSubject = review.subjectId === session.user.id;
      const isAuthor = review.authorId === session.user.id;
      const isBookingParticipant =
        review.booking.listing.ownerId === session.user.id ||
        review.booking.renterId === session.user.id;

      if (!isSubject && !isAuthor && !isBookingParticipant) {
        return Response.json({ error: "Unauthorized" }, { status: 403 });
      }

      if (review.flagged) {
        return Response.json({ error: "Review is already flagged" }, { status: 400 });
      }

      const updated = await db.review.update({
        where: { id },
        data: {
          flagged: true,
          flagReason: reason.trim(),
        },
      });

      return Response.json({
        review: updated,
        message: "Review flagged for moderation. ParkIt will review and take appropriate action.",
      });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Review moderation error:", error);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
