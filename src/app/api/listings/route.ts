import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function geocodeAddress(address: string, city: string, state: string, zipCode: string): Promise<{ lat: number; lng: number } | null> {
  const query = encodeURIComponent(`${address}, ${city}, ${state} ${zipCode}`);
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
      headers: { "User-Agent": "ParkIt/1.0" },
    });
    const data = await res.json();
    if (data && data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // Geocoding failed — return null
  }
  return null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const covered = searchParams.get("covered");
  const lit = searchParams.get("lit");
  const evCharging = searchParams.get("evCharging");
  const accessible = searchParams.get("accessible");
  const parkingType = searchParams.get("type");
  const gated = searchParams.get("gated");
  const city = searchParams.get("city");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { active: true };

  if (parkingType && parkingType !== "all") {
    where.parkingType = parkingType;
  }

  if (minPrice || maxPrice) {
    if (parkingType === "boat" || parkingType === "rv") {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerDay.lte = parseFloat(maxPrice);
    } else if (parkingType === "long_term") {
      where.pricePerMonth = {};
      if (minPrice) where.pricePerMonth.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerMonth.lte = parseFloat(maxPrice);
    } else {
      where.pricePerHour = {};
      if (minPrice) where.pricePerHour.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerHour.lte = parseFloat(maxPrice);
    }
  }

  if (covered === "true") where.covered = true;
  if (lit === "true") where.lit = true;
  if (evCharging === "true") where.evCharging = true;
  if (accessible === "true") where.accessible = true;
  if (gated === "true") where.gated = true;
  if (city) where.cityId = city;

  try {
    let listings = await db.listing.findMany({
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

    if (query) {
      const q = query.toLowerCase();
      listings = listings.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
      );
    }

    // Get average ratings and active booking count for each listing
    const listingsWithRatings = await Promise.all(
      listings.map(async (listing) => {
        const [reviews, activeBookings] = await Promise.all([
          db.review.findMany({
            where: { booking: { listingId: listing.id } },
            select: { rating: true },
          }),
          db.booking.count({
            where: {
              listingId: listing.id,
              status: { in: ["PENDING", "CONFIRMED"] },
              endTime: { gte: new Date() },
            },
          }),
        ]);
        return {
          ...listing,
          reviews,
          activeBookings,
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
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      capacity,
      covered,
      lit,
      evCharging,
      accessible,
      photos,
      lat,
      lng,
      parkingType,
      cityId,
      venueId,
      vehicleLength,
      vehicleWidth,
      vehicleHeight,
      hookups,
      gated,
      monthlyRate,
      minDuration,
      maxDuration,
      spotType,
      surfaceType,
      maxClearance,
      securityCamera,
      accessInstructions,
    } = body;

    if (!title || !description || !address || !city || !state || !zipCode) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pt = parkingType || "EVENT";

    // Geocode the address to get exact coordinates
    let listingLat = lat || 0;
    let listingLng = lng || 0;
    if (!lat || !lng) {
      const coords = await geocodeAddress(address, city, state, zipCode);
      if (coords) {
        listingLat = coords.lat;
        listingLng = coords.lng;
      }
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
        lat: listingLat,
        lng: listingLng,
        pricePerHour: pricePerHour ? parseFloat(pricePerHour) : null,
        pricePerDay: pricePerDay ? parseFloat(pricePerDay) : null,
        pricePerWeek: pricePerWeek ? parseFloat(pricePerWeek) : null,
        pricePerMonth: pricePerMonth ? parseFloat(pricePerMonth) : null,
        capacity: capacity || 1,
        covered: covered || false,
        lit: lit || false,
        evCharging: evCharging || false,
        accessible: accessible || false,
        photos: JSON.stringify(photos || []),
        parkingType: pt,
        cityId: cityId || null,
        venueId: venueId || null,
        vehicleLength: vehicleLength ? parseFloat(vehicleLength) : null,
        vehicleWidth: vehicleWidth ? parseFloat(vehicleWidth) : null,
        vehicleHeight: vehicleHeight ? parseFloat(vehicleHeight) : null,
        hookups: hookups || null,
        gated: gated || false,
        monthlyRate: monthlyRate ? parseFloat(monthlyRate) : null,
        minDuration: minDuration ? parseInt(minDuration) : null,
        maxDuration: maxDuration ? parseInt(maxDuration) : null,
        spotType: spotType || null,
        surfaceType: surfaceType || null,
        maxClearance: maxClearance ? parseFloat(maxClearance) : null,
        securityCamera: securityCamera || false,
        accessInstructions: accessInstructions || null,
      },
    });

    return Response.json({ listing }, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error);
    return Response.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
