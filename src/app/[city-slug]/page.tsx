import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/link-button";
import { MapPin, Star, ArrowRight, Clock, Calendar, Anchor, Truck } from "lucide-react";
import Link from "next/link";

interface CityPageProps {
  params: Promise<{ "city-slug": string }>;
}

export async function generateStaticParams() {
  const cities = await db.city.findMany({ where: { active: true } });
  return cities.map((c) => ({ "city-slug": c.slug }));
}

export async function generateMetadata({ params }: CityPageProps) {
  const { "city-slug": citySlug } = await params;
  const city = await db.city.findUnique({ where: { slug: citySlug } });
  if (!city) return {};
  return {
    title: `Parking in ${city.name}, ${city.state} - ParkIt`,
    description: `Find affordable parking near stadiums, arenas, and venues in ${city.name}. Rent driveways, garages, and private spots. Boat & RV parking available.`,
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { "city-slug": citySlug } = await params;
  const city = await db.city.findUnique({
    where: { slug: citySlug },
    include: {
      venues: {
        orderBy: { name: "asc" },
      },
      _count: { select: { listings: true, events: true } },
    },
  });

  if (!city) notFound();

  const events = await db.event.findMany({
    where: { cityId: city.id, eventDate: { gte: new Date() } },
    orderBy: { eventDate: "asc" },
    take: 12,
    include: { venueRef: true },
  });

  const listings = await db.listing.findMany({
    where: { cityId: city.id, active: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const colors: Record<string, string> = {
    NFL: "bg-blue-100 text-blue-700",
    NBA: "bg-orange-100 text-orange-700",
    MLB: "bg-red-100 text-red-700",
    NHL: "bg-blue-100 text-blue-700",
    MLS: "bg-green-100 text-green-700",
    Concert: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a5632] via-[#0f3d22] to-[#0a2618] text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-4 backdrop-blur">
              <MapPin className="h-4 w-4" />
              {city._count.listings} parking spots available
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Parking in {city.name}
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Find affordable spots near every stadium, arena, and venue in{" "}
              {city.name}, {city.state}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <LinkButton
                size="lg"
                href={`/search?city=${city.slug}`}
                className="bg-white text-[#1a5632] hover:bg-white/90"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Find Parking
              </LinkButton>
              <LinkButton
                size="lg"
                variant="outline"
                href={`/listings/new?city=${city.slug}`}
                className="border-white/30 text-white hover:bg-white/10"
              >
                List Your Spot
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-12 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <LinkButton
                href={`/events?city=${city.slug}`}
                variant="outline"
                size="sm"
              >
                View All
              </LinkButton>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[event.eventType] || "bg-gray-100 text-gray-700"}`}
                    >
                      {event.eventType}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="font-bold text-sm leading-tight">{event.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.venueRef?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venues */}
      {city.venues.length > 0 && (
        <section className="py-12 bg-background border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Venues in {city.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {city.venues.map((venue) => (
                <Link
                  key={venue.id}
                  href={`/search?venue=${venue.id}`}
                  className="p-4 rounded-xl border bg-card hover:shadow-md hover:border-green-200 transition-all"
                >
                  <p className="font-semibold text-sm">{venue.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {venue.address}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Boat & RV */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">
            Boat & RV Parking in {city.name}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href={`/search?type=boat&city=${city.slug}`}
              className="p-6 rounded-xl border bg-card hover:shadow-md hover:border-blue-200 transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Anchor className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold">Boat Parking</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Secure spots near marinas and boat ramps. Daily and monthly
                  rates available.
                </p>
              </div>
            </Link>
            <Link
              href={`/search?type=rv&city=${city.slug}`}
              className="p-6 rounded-xl border bg-card hover:shadow-md hover:border-amber-200 transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-bold">RV & Trailer Parking</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Oversized spots with hookups available. Short-term and
                  long-term options.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      {listings.length > 0 && (
        <section className="py-12 bg-background border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">
              Available Parking in {city.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="p-4 rounded-xl border bg-card hover:shadow-md hover:border-green-200 transition-all"
                >
                  <p className="font-bold text-sm">{listing.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-[#1a5632]">
                      ${listing.pricePerHour}/hr
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {listing.address}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <LinkButton
                href={`/search?city=${city.slug}`}
                variant="outline"
                size="lg"
              >
                View All Spots
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            List Your Parking Spot in {city.name}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Earn money from your unused driveway, garage, or lot. Join hosts in{" "}
            {city.name} who are already earning.
          </p>
          <LinkButton
            size="lg"
            href={`/listings/new?city=${city.slug}`}
            className="bg-[#1a5632] hover:bg-[#0f3d22]"
          >
            Start Earning
            <ArrowRight className="ml-2 h-5 w-5" />
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
