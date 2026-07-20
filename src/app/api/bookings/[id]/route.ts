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
    const { beforePhotos, afterPhotos } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (beforePhotos !== undefined) {
      // Only renter can upload before photos
      if (!isRenter) {
        return Response.json({ error: "Only the renter can upload before photos" }, { status: 403 });
      }
      updateData.beforePhotos = JSON.stringify(beforePhotos);
    }

    if (afterPhotos !== undefined) {
      // Both can upload after photos
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
    console.error("Update booking photos error:", error);
    return Response.json({ error: "Failed to update photos" }, { status: 500 });
  }
}
