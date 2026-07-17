import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, User, Car } from "lucide-react";
import { format } from "date-fns";

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Badge
          variant={
            booking.status === "CONFIRMED"
              ? "default"
              : booking.status === "COMPLETED"
              ? "secondary"
              : "destructive"
          }
          className="mb-2"
        >
          {booking.status}
        </Badge>
        <h1 className="text-3xl font-bold">Booking Details</h1>
      </div>

      <div className="space-y-4">
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

        {/* Payment Info */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Payment</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-bold">${Number(booking.totalAmount).toFixed(2)}</span>
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
