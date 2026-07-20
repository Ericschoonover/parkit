import { db } from "@/lib/db";

export const dynamic = "force-static";

export async function GET() {
  const cities = await db.city.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      state: true,
      slug: true,
      lat: true,
      lng: true,
      _count: {
        select: { listings: true, venues: true, events: true },
      },
    },
  });

  return Response.json({
    cities: cities.map((c) => ({
      ...c,
      listings: c._count.listings,
      venues: c._count.venues,
      events: c._count.events,
    })),
  });
}
