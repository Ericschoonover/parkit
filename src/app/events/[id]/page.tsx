import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, Footprints, Ban } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { haversineDistance, formatDistance, formatWalkTime } from "@/lib/distance";
import { EventMap } from "@/components/event-map";

export default async function EventDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const event = await db.event.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  // Find nearby listings
  const nearbyListings = await db.listing.findMany({
    where: {
      active: true,
      lat: {
        gte: event.lat - 0.1,
        lte: event.lat + 0.1,
      },
      lng: {
        gte: event.lng - 0.1,
        lte: event.lng + 0.1,
      },
    },
    include: {
      owner: {
        select: { name: true },
      },
    },
    take: 10,
  });

  // Get reviews for nearby listings
  const nearbyListingIds = nearbyListings.map((l) => l.id);
  const reviews = await db.review.findMany({
    where: { booking: { listingId: { in: nearbyListingIds } } },
    select: { rating: true, booking: { select: { listingId: true } } },
  });

  // Group reviews by listing
  const reviewsByListing = reviews.reduce((acc, r) => {
    const listingId = r.booking.listingId;
    if (!acc[listingId]) acc[listingId] = [];
    acc[listingId].push(r);
    return acc;
  }, {} as Record<string, typeof reviews>);

  const avgRating = (listingReviews: { rating: number }[]) => {
    if (listingReviews.length === 0) return null;
    return (listingReviews.reduce((sum, r) => sum + r.rating, 0) / listingReviews.length).toFixed(1);
  };

  const listingDistances = nearbyListings.map((listing) => ({
    ...listing,
    distance: haversineDistance(event.lat, event.lng, listing.lat, listing.lng),
  }));
  listingDistances.sort((a, b) => a.distance - b.distance);

  // Get active booking counts
  const listingIds = listingDistances.map((l) => l.id);
  const bookingCounts = await db.booking.groupBy({
    by: ["listingId"],
    where: {
      listingId: { in: listingIds },
      status: { in: ["PENDING", "CONFIRMED"] },
      endTime: { gte: new Date() },
    },
    _count: { id: true },
  });
  const bookingCountMap = new Map(bookingCounts.map((b) => [b.listingId, b._count.id]));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">{event.eventType}</Badge>
        <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {event.venue}, {event.city}, {event.state}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(event.eventDate), "EEEE, MMMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {format(new Date(event.startTime), "h:mm a")}
            {event.endTime && ` - ${format(new Date(event.endTime), "h:mm a")}`}
          </span>
        </div>
        {event.description && (
          <p className="mt-4 text-muted-foreground max-w-3xl">{event.description}</p>
        )}
      </div>

      {/* Interactive Map */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Parking Near {event.venue}</h2>
        <EventMap
          eventLat={event.lat}
          eventLng={event.lng}
          eventVenue={event.venue}
          listings={listingDistances.map((l) => ({
            id: l.id,
            title: l.title,
            address: l.address,
            lat: l.lat,
            lng: l.lng,
            price: Number(l.pricePerHour),
            priceUnit: "/hr",
            distance: formatDistance(l.distance),
            walkTime: formatWalkTime(l.distance),
            covered: l.covered,
            capacity: l.capacity,
            activeBookings: bookingCountMap.get(l.id) || 0,
          }))}
        />
      </div>

      {/* Nearby Parking */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Nearby Parking ({nearbyListings.length})</h2>
        {nearbyListings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No parking spaces found near this venue yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {listingDistances.map((listing) => {
              const listingReviews = reviewsByListing[listing.id] || [];
              return (
                <Link key={listing.id} href={`/listings/${listing.id}`}>
                  <Card className="cursor-pointer transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{listing.title}</h3>
                            {(bookingCountMap.get(listing.id) || 0) > 0 && (
                              <Badge className="text-xs bg-red-100 text-red-700 border-0">
                                <Ban className="h-2.5 w-2.5 mr-0.5" /> Booked
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{listing.address}</p>
                          <div className="flex items-center gap-1 mt-1 text-sm text-green-700 font-medium">
                            <Footprints className="h-3.5 w-3.5" />
                            {formatDistance(listing.distance)} &middot; {formatWalkTime(listing.distance)}
                          </div>
                          {avgRating(listingReviews) && (
                            <p className="text-sm text-muted-foreground mt-1">
                              ⭐ {avgRating(listingReviews)} ({listingReviews.length} reviews)
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">${String(listing.pricePerHour)}</p>
                          <p className="text-xs text-muted-foreground">/hour</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
