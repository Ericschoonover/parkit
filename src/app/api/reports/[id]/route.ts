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
    const report = await db.report.findUnique({
      where: { id },
      include: {
        listing: { select: { ownerId: true, title: true } },
      },
    });

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.listing.ownerId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["REVIEWED", "DISMISSED"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await db.report.update({
      where: { id },
      data: { status },
    });

    return Response.json({ report: updated });
  } catch (error) {
    console.error("Update report error:", error);
    return Response.json({ error: "Failed to update report" }, { status: 500 });
  }
}
