import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const price = await db.seasonalPrice.findUnique({
      where: { id },
      include: { listing: { select: { ownerId: true } } },
    });

    if (!price) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    if (price.listing.ownerId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.seasonalPrice.delete({ where: { id } });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete seasonal price error:", error);
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}
