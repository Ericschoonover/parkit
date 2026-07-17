"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Calendar, DollarSign, Star, Plus, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface RecentBooking {
  id: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: string;
  listing: {
    id: string;
    title: string;
    address: string;
    city: string;
    photos: string;
  };
  event: {
    name: string;
    venue: string;
  } | null;
}

interface DashboardStats {
  totalListings: number;
  totalBookings: number;
  totalEarnings: number;
  avgRating: number | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState("all");

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setStats(data.stats);
      setRecentBookings(data.recentBookings || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
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
        await fetchDashboardData();
      };
      load();
    }
  }, [status, router]);

  const filteredBookings = recentBookings.filter((b) => {
    if (bookingFilter === "all") return true;
    return b.status === bookingFilter;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-muted rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "My Listings", value: stats?.totalListings || 0, icon: Car, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: Calendar, color: "text-green-600", bg: "bg-green-50" },
    { label: "Earnings", value: `$${stats?.totalEarnings || 0}`, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Avg Rating", value: stats?.avgRating || "-", icon: Star, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {session?.user?.name}</p>
        </div>
        <LinkButton href="/listings/new" className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          List New Space
        </LinkButton>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Select value={bookingFilter} onValueChange={(v) => v && setBookingFilter(v)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No bookings {bookingFilter !== "all" ? "matching this filter" : "yet"}</p>
              <LinkButton href="/search" variant="outline" className="mt-4">
                Find Parking
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <Link key={booking.id} href={`/bookings/${booking.id}`}>
                  <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {(() => {
                          try {
                            const photos = typeof booking.listing.photos === "string" ? JSON.parse(booking.listing.photos) : booking.listing.photos;
                            return photos[0] ? (
                              <img src={photos[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Car className="h-5 w-5 text-muted-foreground" />
                            );
                          } catch {
                            return <Car className="h-5 w-5 text-muted-foreground" />;
                          }
                        })()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{booking.listing?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.listing?.address}, {booking.listing?.city}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(booking.startTime), "MMM d, h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
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
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
