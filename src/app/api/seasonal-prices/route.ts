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
    const { listingId, name, startDate, endDate, pricePerHour, dayOfWeek } = body;

    if (!listingId || !name || !startDate || !endDate || pricePerHour == null) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify ownership
    const listing = await db.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }
    if (listing.ownerId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return Response.json({ error: "End date must be after start date" }, { status: 400 });
    }

    // Check for overlapping seasonal prices on the same listing
    const existing = await db.seasonalPrice.findFirst({
      where: {
        listingId,
        startDate: { lte: end },
        endDate: { gte: start },
      },
    });

    if (existing) {
      return Response.json({
        error: `Overlaps with existing price rule "${existing.name}"`,
      }, { status: 409 });
    }

    const seasonalPrice = await db.seasonalPrice.create({
      data: {
        listingId,
        name,
        startDate: start,
        endDate: end,
        pricePerHour: parseFloat(String(pricePerHour)),
        dayOfWeek: dayOfWeek || null,
      },
    });

    return Response.json({ seasonalPrice }, { status: 201 });
  } catch (error) {
    console.error("Create seasonal price error:", error);
    return Response.json({ error: "Failed to create seasonal price" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");

  if (!listingId) {
    return Response.json({ error: "Missing listingId" }, { status: 400 });
  }

  try {
    const listing = await db.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }
    if (listing.ownerId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const prices = await db.seasonalPrice.findMany({
      where: { listingId },
      orderBy: { startDate: "asc" },
    });

    return Response.json({ seasonalPrices: prices });
  } catch (error) {
    console.error("Fetch seasonal prices error:", error);
    return Response.json({ error: "Failed to fetch seasonal prices" }, { status: 500 });
  }
}
