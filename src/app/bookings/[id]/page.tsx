import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, User, Car, Camera, Star } from "lucide-react";
import { format } from "date-fns";
import { BookingPhotos } from "@/components/booking-photos";
import { BookingActions } from "@/components/booking-actions";

export default async function BookingDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      listing: {
        include: {
          owner: {
            select: { name: true, image: true, email: true },
          },
        },
      },
      renter: {
        select: { name: true, image: true, email: true },
      },
      event: true,
      review: true,
    },
  });

  if (!booking) {
    notFound();
  }

  const isOwner = booking.listing.ownerId === session.user.id;
  const isRenter = booking.renterId === session.user.id;

  if (!isOwner && !isRenter) {
    notFound();
  }

  const beforePhotos = JSON.parse(booking.beforePhotos) as string[];
  const afterPhotos = JSON.parse(booking.afterPhotos) as string[];
  const isPast = new Date(booking.endTime) < new Date();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Badge
          variant={
            booking.status === "CONFIRMED"
              ? "default"
              : booking.status === "COMPLETED"
              ? "secondary"
              : booking.status === "CANCELLED"
              ? "destructive"
              : "outline"
          }
          className="mb-2"
        >
          {booking.status}
        </Badge>
        <h1 className="text-3xl font-bold">Booking Details</h1>
      </div>

      <div className="space-y-4">
        {/* Cancel / Review Actions */}
        <BookingActions
          bookingId={booking.id}
          status={booking.status}
          startTime={booking.startTime.toISOString()}
          isOwner={isOwner}
          isRenter={isRenter}
          hasReview={!!booking.review}
          isPast={isPast}
          damageDeposit={Number(booking.damageDeposit)}
          depositStatus={booking.depositStatus}
        />

        {/* Listing Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <Car className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{booking.listing.title}</h2>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {booking.listing.address}, {booking.listing.city}, {booking.listing.state}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Info */}
        {booking.event && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Event</h3>
              <p>{booking.event.name}</p>
              <p className="text-muted-foreground">{booking.event.venue}</p>
            </CardContent>
          </Card>
        )}

        {/* Booking Details */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Schedule</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(booking.startTime), "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(booking.startTime), "h:mm a")} -{" "}
                  {format(new Date(booking.endTime), "h:mm a")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Documentation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-4 w-4" />
              <h3 className="font-semibold">Photo Documentation</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Both parties should document the parking space condition before and after the booking for dispute protection.
            </p>
            <BookingPhotos
              bookingId={booking.id}
              beforePhotos={beforePhotos}
              afterPhotos={afterPhotos}
              isRenter={isRenter}
              isOwner={isOwner}
            />
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Payment</h3>
            <div className="space-y-2">
              {Number(booking.damageDeposit) > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Parking</span>
                  <span>${(Number(booking.totalAmount) - Number(booking.damageDeposit)).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Service fee (15%)</span>
                <span>${Number(booking.platformFee).toFixed(2)}</span>
              </div>
              {Number(booking.damageDeposit) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    Refundable deposit
                    <Badge variant={
                      booking.depositStatus === "RELEASED" ? "default" :
                      booking.depositStatus === "CLAIMED" ? "destructive" :
                      "secondary"
                    } className="text-[10px] ml-1">
                      {booking.depositStatus === "HELD" ? "Held" :
                       booking.depositStatus === "RELEASED" ? "Refunded" :
                       "Claimed by Host"}
                    </Badge>
                  </span>
                  <span>${Number(booking.damageDeposit).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Paid</span>
                <span>${Number(booking.totalAmount).toFixed(2)}</span>
              </div>
              {isOwner && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Your Payout (after 15% fee)</span>
                  <span>${Number(booking.ownerPayout).toFixed(2)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Existing Review */}
        {booking.review && (
          <Card className="border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-amber-500" />
                <h3 className="font-semibold">Review</h3>
              </div>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= booking.review!.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              {booking.review.comment && (
                <p className="text-sm text-muted-foreground">{booking.review.comment}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">
              {isOwner ? "Renter" : "Host"} Contact
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                {isOwner ? (
                  booking.renter.image ? (
                    <img
                      src={booking.renter.image}
                      alt=""
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )
                ) : booking.listing.owner.image ? (
                  <img
                    src={booking.listing.owner.image}
                    alt=""
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {isOwner ? booking.renter.name : booking.listing.owner.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isOwner ? booking.renter.email : booking.listing.owner.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
