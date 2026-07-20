import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const bookings = await db.booking.findMany({
      where: {
        listingId: id,
        status: { in: ["PENDING", "CONFIRMED"] },
        endTime: { gte: new Date() },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
      },
      orderBy: { startTime: "asc" },
    });

    return Response.json({ bookings });
  } catch (error) {
    console.error("Fetch listing bookings error:", error);
    return Response.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
