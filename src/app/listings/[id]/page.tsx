import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Car, Umbrella, Zap, Accessibility, Shield, Footprints, Calendar, Lock, Camera, Route, Ban } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { BookingForm } from "@/components/booking-form";
import { ReviewsSection } from "@/components/reviews-section";
import { haversineDistance, formatDistance, formatWalkTime } from "@/lib/distance";
import { LocationMap } from "@/components/location-map";
import { UserDistance } from "@/components/user-distance";
import { ReportButton } from "@/components/report-button";
import { SeasonalPricingManager } from "@/components/seasonal-pricing-manager";

export default async function ListingDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const listing = await db.listing.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const session = await auth();
  const currentUserId = session?.user?.id;
  const isOwner = currentUserId === listing.ownerId;

  // Get reviews through bookings
  const reviews = await db.review.findMany({
    where: {
      booking: { listingId: id },
    },
    include: {
      author: {
        select: { name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get active bookings count
  const activeBookings = await db.booking.count({
    where: {
      listingId: id,
      status: { in: ["PENDING", "CONFIRMED"] },
      endTime: { gte: new Date() },
    },
  });

  const photos = JSON.parse(listing.photos) as string[];
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const nearbyEvents = await db.event.findMany({
    where: {
      eventDate: { gte: new Date() },
      lat: { gte: listing.lat - 0.15, lte: listing.lat + 0.15 },
      lng: { gte: listing.lng - 0.15, lte: listing.lng + 0.15 },
    },
    orderBy: { eventDate: "asc" },
    take: 6,
  });

  const eventsWithDistance = nearbyEvents
    .map((event) => ({
      ...event,
      distance: haversineDistance(listing.lat, listing.lng, event.lat, event.lng),
    }))
    .filter((e) => e.distance <= 20)
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Gallery */}
          <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
            {photos.length > 0 ? (
              photos.slice(0, 4).map((photo, i) => (
                <div
                  key={i}
                  className={`${i === 0 ? "col-span-2 row-span-2" : ""} bg-muted`}
                >
                  <img
                    src={photo}
                    alt={`${listing.title} - Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 h-64 bg-muted flex items-center justify-center">
                <Car className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Location Map */}
          <LocationMap
            lat={listing.lat}
            lng={listing.lng}
            title={listing.title}
            address={`${listing.address}, ${listing.city}, ${listing.state} ${listing.zipCode}`}
          />

          {/* Listing Info */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold">{listing.title}</h1>
                  {listing.parkingType && listing.parkingType !== "EVENT" && (
                    <Badge className="text-xs">{listing.parkingType === "BOAT" ? "Boat" : listing.parkingType === "RV" ? "RV" : "Long-Term"}</Badge>
                  )}
                </div>
                {listing.spotType && (
                  <p className="text-sm text-muted-foreground">
                    {listing.spotType.charAt(0) + listing.spotType.slice(1).toLowerCase()} spot
                    {listing.surfaceType ? ` · ${listing.surfaceType.charAt(0) + listing.surfaceType.slice(1).toLowerCase()}` : ""}
                  </p>
                )}
              </div>
              <div className="text-right">
                {listing.parkingType === "RV" && listing.pricePerMonth ? (
                  <>
                    <p className="text-3xl font-bold text-green-600">${String(listing.pricePerMonth)}</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </>
                ) : listing.parkingType === "BOAT" && listing.pricePerWeek ? (
                  <>
                    <p className="text-3xl font-bold text-green-600">${String(listing.pricePerWeek)}</p>
                    <p className="text-sm text-muted-foreground">/week</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-green-600">${String(listing.pricePerHour)}</p>
                    <p className="text-sm text-muted-foreground">/hour</p>
                  </>
                )}
              </div>
            </div>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {listing.address}, {listing.city}, {listing.state} {listing.zipCode}
            </p>
            <UserDistance lat={listing.lat} lng={listing.lng} />
            {activeBookings > 0 && (
              <p className="text-sm text-red-600 font-semibold flex items-center gap-1 mt-1">
                <Ban className="h-4 w-4" />
                Currently Booked
              </p>
            )}
            {avgRating && (
              <p className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{avgRating}</span>
                <span className="text-muted-foreground">({reviews.length} reviews)</span>
              </p>
            )}
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {listing.covered && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Umbrella className="h-3 w-3" /> Covered
              </Badge>
            )}
            {listing.lit && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span className="h-3 w-3">💡</span> Well Lit
              </Badge>
            )}
            {listing.evCharging && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" /> EV Charging
              </Badge>
            )}
            {listing.accessible && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Accessibility className="h-3 w-3" /> Accessible
              </Badge>
            )}
            {listing.gated && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> Gated
              </Badge>
            )}
            {listing.securityCamera && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Camera className="h-3 w-3" /> Security Camera
              </Badge>
            )}
            <Badge variant="secondary" className="flex items-center gap-1">
              <Car className="h-3 w-3" /> {listing.capacity} Spot{listing.capacity > 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Spot Details */}
          {(listing.maxClearance || listing.vehicleLength || listing.vehicleWidth || listing.vehicleHeight) && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Route className="h-4 w-4" /> Spot Details
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {listing.maxClearance && (
                    <div>
                      <span className="text-muted-foreground">Max Clearance:</span>{" "}
                      <span className="font-medium">{listing.maxClearance}</span>
                    </div>
                  )}
                  {listing.vehicleLength && (
                    <div>
                      <span className="text-muted-foreground">Max Length:</span>{" "}
                      <span className="font-medium">{listing.vehicleLength} ft</span>
                    </div>
                  )}
                  {listing.vehicleWidth && (
                    <div>
                      <span className="text-muted-foreground">Max Width:</span>{" "}
                      <span className="font-medium">{listing.vehicleWidth} ft</span>
                    </div>
                  )}
                  {listing.vehicleHeight && (
                    <div>
                      <span className="text-muted-foreground">Max Height:</span>{" "}
                      <span className="font-medium">{listing.vehicleHeight} ft</span>
                    </div>
                  )}
                </div>
                {listing.hookups && (() => {
                  const hooks = JSON.parse(listing.hookups) as string[];
                  if (hooks.length === 0) return null;
                  return (
                    <div>
                      <span className="text-sm text-muted-foreground">Hookups: </span>
                      <span className="text-sm font-medium">{hooks.join(", ")}</span>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Access Instructions */}
          {listing.accessInstructions && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Access Instructions</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{listing.accessInstructions}</p>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">About This Space</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Seasonal Pricing (owner only) */}
          {isOwner && (
            <div className="border-t pt-4">
              <SeasonalPricingManager
                listingId={listing.id}
                basePricePerHour={Number(listing.pricePerHour)}
              />
            </div>
          )}

          {/* Nearby Events */}
          {eventsWithDistance.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Upcoming Events Nearby</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {eventsWithDistance.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <Card className="cursor-pointer transition-all hover:shadow-md">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{event.name}</p>
                            <p className="text-xs text-muted-foreground">{event.venue}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-green-700 font-medium">
                              <Footprints className="h-3 w-3" />
                              {formatDistance(event.distance)} &middot; {formatWalkTime(event.distance)}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(event.eventDate), "MMM d")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(event.startTime), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <ReviewsSection
            listingId={listing.id}
            reviews={reviews.map((r) => ({
              ...r,
              createdAt: r.createdAt.toISOString(),
            }))}
          />

          {/* Report (non-owners only) */}
          {!isOwner && currentUserId && (
            <div className="border-t pt-4">
              <ReportButton listingId={listing.id} listingTitle={listing.title} />
            </div>
          )}
        </div>

        {/* Sidebar - Booking Form */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                {listing.parkingType === "RV" && listing.pricePerMonth ? (
                  <>
                    <p className="text-3xl font-bold text-green-600">${String(listing.pricePerMonth)}</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </>
                ) : listing.parkingType === "BOAT" && listing.pricePerWeek ? (
                  <>
                    <p className="text-3xl font-bold text-green-600">${String(listing.pricePerWeek)}</p>
                    <p className="text-sm text-muted-foreground">per week</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-green-600">${String(listing.pricePerHour)}</p>
                    <p className="text-sm text-muted-foreground">per hour</p>
                  </>
                )}
              </div>
              <BookingForm listingId={listing.id} pricePerHour={Number(listing.pricePerHour)} damageDeposit={Number(listing.damageDeposit)} />
              {Number(listing.damageDeposit) > 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  Includes a ${Number(listing.damageDeposit).toFixed(2)} refundable damage deposit
                </p>
              )}
              <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Shield className="h-4 w-4" />
                Secure payment via Stripe
              </div>
            </CardContent>
          </Card>

          {/* Host Info */}
          <Card className="mt-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  {listing.owner.image ? (
                    <img
                      src={listing.owner.image}
                      alt={listing.owner.name || ""}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-medium">
                      {listing.owner.name?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{listing.owner.name}</p>
                  <p className="text-sm text-muted-foreground">Host</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
