"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Calendar, MapPin, ArrowRight, Ticket } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  totalAmount: string;
  status: string;
  listing: {
    id: string;
    title: string;
    address: string;
    city: string;
    photos: string[];
  };
  event: {
    name: string;
    venue: string;
  } | null;
}

export default function BookingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      const load = async () => {
        await fetchBookings();
      };
      load();
    }
  }, [status, router]);

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.startTime) > new Date() && b.status !== "CANCELLED"
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.startTime) <= new Date() || b.status === "COMPLETED"
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const renderBookingList = (items: Booking[]) => {
    const filtered = items.filter((b) => {
      if (statusFilter === "all") return true;
      return b.status === statusFilter;
    });

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">No bookings found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different filter or find a new spot</p>
          <LinkButton href="/search" variant="outline" className="mt-4">
            Find Parking
            <ArrowRight className="ml-2 h-4 w-4" />
          </LinkButton>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filtered.map((booking) => (
          <Link key={booking.id} href={`/bookings/${booking.id}`}>
            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {(() => {
                        try {
                          const photos = typeof booking.listing.photos === "string" ? JSON.parse(booking.listing.photos) : booking.listing.photos;
                          return photos[0] ? (
                            <img src={photos[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Car className="h-6 w-6 text-muted-foreground" />
                          );
                        } catch {
                          return <Car className="h-6 w-6 text-muted-foreground" />;
                        }
                      })()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{booking.listing.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{booking.listing.address}, {booking.listing.city}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(booking.startTime), "MMM d, h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
                      </p>
                      {booking.event && (
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Ticket className="h-3 w-3 shrink-0" />
                          {booking.event.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold">${Number(booking.totalAmount).toFixed(2)}</p>
                    <Badge
                      variant={
                        booking.status === "CONFIRMED"
                          ? "default"
                          : booking.status === "COMPLETED"
                          ? "secondary"
                          : "destructive"
                      }
                      className="mt-1 text-xs"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          {renderBookingList(upcomingBookings)}
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          {renderBookingList(pastBookings)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
