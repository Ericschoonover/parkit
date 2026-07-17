import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const query = searchParams.get("q");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    eventDate: { gte: new Date() },
  };

  if (type && type !== "all") {
    where.eventType = type;
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { venue: { contains: query, mode: "insensitive" } },
      { city: { contains: query, mode: "insensitive" } },
    ];
  }

  try {
    const events = await db.event.findMany({
      where,
      orderBy: { eventDate: "asc" },
      take: 50,
    });

    return Response.json({ events });
  } catch (error) {
    console.error("Events fetch error:", error);
    return Response.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
