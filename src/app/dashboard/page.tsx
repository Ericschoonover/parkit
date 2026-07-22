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
import { Car, Calendar, DollarSign, Star, Plus, ArrowRight, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

interface RecentBooking {
  id: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  platformFee: number;
  ownerPayout: number;
  damageDeposit: number;
  depositStatus: string;
  status: string;
  listing: {
    id: string;
    title: string;
    address: string;
    city: string;
    photos: string;
    ownerId: string;
  };
  event: {
    name: string;
    venue: string;
  } | null;
  renter?: {
    name: string | null;
  };
}

interface DashboardStats {
  totalListings: number;
  totalBookings: number;
  totalEarnings: number;
  totalPlatformFees: number;
  totalDepositsHeld: number;
  pendingEarnings: number;
  avgRating: number | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState("all");
  const [stripeOnboarded, setStripeOnboarded] = useState<boolean | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [monthlyEarnings, setMonthlyEarnings] = useState<Record<string, number>>({});
  const [upcomingAsHost, setUpcomingAsHost] = useState<Array<RecentBooking & { renter: { name: string | null } }>>([]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setStats(data.stats);
      setRecentBookings(data.recentBookings || []);
      setStripeOnboarded(data.stripeOnboarded || false);
      setMonthlyEarnings(data.monthlyEarnings || {});
      setUpcomingAsHost(data.upcomingAsHost || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStripeConnect = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to start onboarding");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start Stripe onboarding");
    } finally {
      setStripeLoading(false);
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

  // Transaction history: completed bookings as host
  const transactionHistory = recentBookings.filter(
    (b) => b.listing.ownerId === session?.user?.id && b.status === "COMPLETED"
  );

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
    { label: "Earned", value: `$${(stats?.totalEarnings || 0).toFixed(2)}`, sub: stats?.pendingEarnings ? `+$${stats.pendingEarnings.toFixed(2)} pending` : undefined, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
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
                  {"sub" in stat && stat.sub && (
                    <p className="text-xs text-amber-600 mt-0.5">{stat.sub}</p>
                  )}
                </div>
                <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stripe Onboarding Banner */}
      {stripeOnboarded === false && (
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Connect to Stripe</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your bank account to receive payouts when guests book your spots.
                  </p>
                </div>
              </div>
              <button
                onClick={handleStripeConnect}
                disabled={stripeLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {stripeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                {stripeLoading ? "Connecting..." : "Connect Now"}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {stripeOnboarded === true && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Stripe Connected</h3>
                <p className="text-sm text-green-600">
                  Your bank account is connected. You&apos;ll receive payouts automatically after bookings complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earnings Breakdown */}
      {stats && stats.totalEarnings > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Earnings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-green-600 font-medium">Total Earned</p>
                <p className="text-xl font-bold text-green-700">${stats.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-600 font-medium">Pending</p>
                <p className="text-xl font-bold text-amber-700">${(stats.pendingEarnings || 0).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-600 font-medium">Platform Fees (15%)</p>
                <p className="text-xl font-bold text-blue-700">${(stats.totalPlatformFees || 0).toFixed(2)}</p>
              </div>
            </div>
            {Object.keys(monthlyEarnings).length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Monthly Breakdown</p>
                <div className="space-y-1">
                  {Object.entries(monthlyEarnings)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([month, amount]) => (
                      <div key={month} className="flex justify-between text-sm py-1 border-b last:border-0">
                        <span className="text-muted-foreground">{month}</span>
                        <span className="font-medium">${Number(amount).toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      {transactionHistory.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-left">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Listing</th>
                    <th className="pb-2 font-medium text-right">Guest</th>
                    <th className="pb-2 font-medium text-right">Total</th>
                    <th className="pb-2 font-medium text-right">Fee</th>
                    <th className="pb-2 font-medium text-right">Payout</th>
                    <th className="pb-2 font-medium text-right">Deposit</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5">
                        <Link href={`/bookings/${t.id}`} className="hover:underline">
                          {format(new Date(t.startTime), "MMM d, yyyy")}
                        </Link>
                      </td>
                      <td className="py-2.5">
                        <p className="font-medium">{t.listing.title}</p>
                        <p className="text-xs text-muted-foreground">{t.listing.city}</p>
                      </td>
                      <td className="py-2.5 text-right text-muted-foreground">
                        {t.renter?.name || "Guest"}
                      </td>
                      <td className="py-2.5 text-right font-medium">${Number(t.totalAmount).toFixed(2)}</td>
                      <td className="py-2.5 text-right text-red-600">-${Number(t.platformFee).toFixed(2)}</td>
                      <td className="py-2.5 text-right font-semibold text-green-600">${Number(t.ownerPayout).toFixed(2)}</td>
                      <td className="py-2.5 text-right">
                        {Number(t.damageDeposit) > 0 ? (
                          <Badge
                            variant={
                              t.depositStatus === "RELEASED" ? "default" :
                              t.depositStatus === "CLAIMED" ? "destructive" :
                              "secondary"
                            }
                            className="text-[10px]"
                          >
                            ${Number(t.damageDeposit).toFixed(2)} {t.depositStatus === "HELD" ? "held" : t.depositStatus === "RELEASED" ? "released" : "claimed"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming as Host */}
      {upcomingAsHost.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Bookings (Host)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAsHost.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition-all"
                >
                  <div>
                    <p className="font-medium text-sm">{booking.listing.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Renter: {booking.renter.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.startTime), "MMM d, h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(booking.totalAmount).toFixed(2)}</p>
                    <Badge variant={booking.status === "CONFIRMED" ? "default" : "outline"} className="text-xs mt-1">
                      {booking.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
