import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  try {
    const events = await db.event.findMany({
      orderBy: { eventDate: "asc" },
      take: 100,
    });

    let filtered = events;

    if (type && type !== "all") {
      filtered = filtered.filter((e) => e.eventType === type);
    }

    return Response.json({ events: filtered });
  } catch (error) {
    console.error("Events fetch error:", error);
    return Response.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
