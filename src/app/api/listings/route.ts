import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const STATE_TIMEZONES: Record<string, string> = {
  AL: "America/Chicago", AK: "America/Anchorage", AZ: "America/Phoenix", AR: "America/Chicago",
  CA: "America/Los_Angeles", CO: "America/Denver", CT: "America/New_York", DE: "America/New_York",
  FL: "America/New_York", GA: "America/New_York", HI: "Pacific/Honolulu", ID: "America/Boise",
  IL: "America/Chicago", IN: "America/Indiana/Indianapolis", IA: "America/Chicago",
  KS: "America/Chicago", KY: "America/New_York", LA: "America/Chicago", ME: "America/New_York",
  MD: "America/New_York", MA: "America/New_York", MI: "America/Detroit", MN: "America/Chicago",
  MS: "America/Chicago", MO: "America/Chicago", MT: "America/Denver", NE: "America/Chicago",
  NV: "America/Los_Angeles", NH: "America/New_York", NJ: "America/New_York",
  NM: "America/Denver", NY: "America/New_York", NC: "America/New_York", ND: "America/Chicago",
  OH: "America/New_York", OK: "America/Chicago", OR: "America/Los_Angeles", PA: "America/New_York",
  RI: "America/New_York", SC: "America/New_York", SD: "America/Chicago", TN: "America/Chicago",
  TX: "America/Chicago", UT: "America/Denver", VT: "America/New_York",
  VA: "America/New_York", WA: "America/Los_Angeles", WV: "America/New_York", WI: "America/Chicago",
  WY: "America/Denver", DC: "America/New_York",
};

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

    // Resolve cityId — create City record if not pre-seeded
    let resolvedCityId = cityId || null;
    if (!resolvedCityId && city && state) {
      const slug = `${city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${state.toLowerCase()}`;
      const existing = await db.city.findFirst({ where: { name: city, state } });
      if (existing) {
        resolvedCityId = existing.id;
      } else {
        const newCity = await db.city.create({
          data: {
            name: city,
            state,
            slug,
            lat: listingLat || 0,
            lng: listingLng || 0,
            timezone: STATE_TIMEZONES[state] || "America/New_York",
            active: true,
          },
        });
        resolvedCityId = newCity.id;
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
        cityId: resolvedCityId,
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
