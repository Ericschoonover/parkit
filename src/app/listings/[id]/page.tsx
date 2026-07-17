import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Car, Umbrella, Zap, Accessibility, Shield } from "lucide-react";
import { BookingForm } from "@/components/booking-form";
import { ReviewsSection } from "@/components/reviews-section";

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

  const photos = JSON.parse(listing.photos) as string[];
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

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

          {/* Listing Info */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{listing.title}</h1>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">${String(listing.pricePerHour)}</p>
                <p className="text-sm text-muted-foreground">/hour</p>
              </div>
            </div>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {listing.address}, {listing.city}, {listing.state} {listing.zipCode}
            </p>
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
            <Badge variant="secondary" className="flex items-center gap-1">
              <Car className="h-3 w-3" /> {listing.capacity} Spot{listing.capacity > 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">About This Space</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Reviews */}
          <ReviewsSection
            listingId={listing.id}
            reviews={reviews.map((r) => ({
              ...r,
              createdAt: r.createdAt.toISOString(),
            }))}
          />
        </div>

        {/* Sidebar - Booking Form */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">${String(listing.pricePerHour)}</p>
                <p className="text-sm text-muted-foreground">per hour</p>
              </div>
              <BookingForm listingId={listing.id} pricePerHour={Number(listing.pricePerHour)} />
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
