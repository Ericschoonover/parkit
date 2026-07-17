import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const covered = searchParams.get("covered");
  const lit = searchParams.get("lit");
  const evCharging = searchParams.get("evCharging");
  const accessible = searchParams.get("accessible");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { active: true };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { address: { contains: query, mode: "insensitive" } },
      { city: { contains: query, mode: "insensitive" } },
    ];
  }

  if (minPrice || maxPrice) {
    where.pricePerHour = {};
    if (minPrice) where.pricePerHour.gte = parseFloat(minPrice);
    if (maxPrice) where.pricePerHour.lte = parseFloat(maxPrice);
  }

  if (covered === "true") where.covered = true;
  if (lit === "true") where.lit = true;
  if (evCharging === "true") where.evCharging = true;
  if (accessible === "true") where.accessible = true;

  try {
    const listings = await db.listing.findMany({
      where,
      include: {
        owner: {
          select: { name: true, image: true },
        },
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Get average ratings for each listing
    const listingsWithRatings = await Promise.all(
      listings.map(async (listing) => {
        const reviews = await db.review.findMany({
          where: { booking: { listingId: listing.id } },
          select: { rating: true },
        });
        return {
          ...listing,
          reviews,
        };
      })
    );

    return Response.json({ listings: listingsWithRatings });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      address,
      city,
      state,
      zipCode,
      pricePerHour,
      capacity,
      covered,
      lit,
      evCharging,
      accessible,
      photos,
      lat,
      lng,
    } = body;

    if (!title || !description || !address || !city || !state || !zipCode || !pricePerHour) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const listing = await db.listing.create({
      data: {
        ownerId: session.user.id,
        title,
        description,
        address,
        city,
        state,
        zipCode,
        lat: lat || 0,
        lng: lng || 0,
        pricePerHour: parseFloat(pricePerHour),
        capacity: capacity || 1,
        covered: covered || false,
        lit: lit || false,
        evCharging: evCharging || false,
        accessible: accessible || false,
        photos: JSON.stringify(photos || []),
      },
    });

    return Response.json({ listing }, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error);
    return Response.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
