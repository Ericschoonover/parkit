"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Search, Store, ArrowRightLeft, Shield, Star, MapPin, Calendar, Car } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

interface ProfileData {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    phone: string | null;
    role: string;
    createdAt: string;
    stripeOnboarded: boolean;
  };
  listings: Array<{
    id: string;
    title: string;
    city: string;
    state: string;
    pricePerHour: number | null;
    pricePerDay: number | null;
    active: boolean;
    parkingType: string;
    _count: { bookings: number };
  }>;
  bookings: Array<{
    id: string;
    startTime: string;
    endTime: string;
    totalAmount: number;
    status: string;
    listing: { id: string; title: string; city: string };
  }>;
  reviewsReceived: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    author: { name: string | null; image: string | null };
    booking: { id: string };
  }>;
  reviewsGiven: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    subject: { name: string | null; image: string | null };
    booking: { id: string; listing: { title: string } };
  }>;
  stats: {
    totalListings: number;
    totalBookings: number;
    avgRating: number | null;
    totalReviews: number;
  };
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<"listings" | "bookings" | "reviews">("listings");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "RENTER",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          setProfileData(data);
          if (data.user) {
            setFormData({
              name: data.user.name ?? "",
              email: data.user.email ?? "",
              phone: data.user.phone ?? "",
              role: data.user.role ?? "RENTER",
            });
          }
        })
        .catch(console.error);
    }
  }, [status, router]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated!");
      update();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || !profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4 max-w-2xl">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  const roles = [
    { value: "RENTER", label: "Find Parking", desc: "I need parking", icon: Search },
    { value: "OWNER", label: "List Space", desc: "I have parking", icon: Store },
    { value: "BOTH", label: "Both", desc: "Rent & list", icon: ArrowRightLeft },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Profile Header */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center overflow-hidden shrink-0">
          {session?.user?.image ? (
            <img src={session.user.image} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{profileData.user.name || "Unnamed User"}</h1>
          <p className="text-muted-foreground">{profileData.user.email}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Member since {format(new Date(profileData.user.createdAt), "MMMM yyyy")}
          </p>
          <div className="flex gap-4 mt-3">
            {profileData.stats.avgRating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{profileData.stats.avgRating}</span>
                <span className="text-sm text-muted-foreground">({profileData.stats.totalReviews})</span>
              </div>
            )}
            <Badge variant="secondary">{profileData.stats.totalListings} listings</Badge>
            <Badge variant="secondary">{profileData.stats.totalBookings} bookings</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} disabled className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Account Type */}
        <Card>
          <CardHeader>
            <CardTitle>Account Type</CardTitle>
            <CardDescription>Choose how you want to use ParkIt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    formData.role === role.value
                      ? "border-green-600 bg-green-50 shadow-sm"
                      : "border-muted hover:border-green-200 hover:bg-muted/50"
                  }`}
                >
                  <role.icon className={`h-6 w-6 mx-auto mb-2 ${formData.role === role.value ? "text-green-600" : "text-muted-foreground"}`} />
                  <p className="font-medium text-sm">{role.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{role.desc}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stripe */}
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>Set up Stripe to receive payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Stripe Connect</p>
                <p className="text-sm text-muted-foreground">
                  {profileData.user.stripeOnboarded
                    ? "Your account is connected and ready to receive payouts"
                    : "Connect your Stripe account to receive payments for your parking spaces"}
                </p>
              </div>
              {profileData.user.stripeOnboarded ? (
                <Badge className="bg-green-100 text-green-700">Connected</Badge>
              ) : (
                <Link href="/dashboard">
                  <Button variant="outline" className="shrink-0">Connect</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Tabs */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-1 mb-6 border-b pb-3">
              {(["listings", "bookings", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? "bg-green-100 text-green-700"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Listings Tab */}
            {activeTab === "listings" && (
              <div className="space-y-3">
                {profileData.listings.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium">No listings yet</p>
                    <Link href="/listings/new">
                      <Button className="mt-3 bg-green-600 hover:bg-green-700" size="sm">List Your Space</Button>
                    </Link>
                  </div>
                ) : (
                  profileData.listings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition-all"
                    >
                      <div>
                        <p className="font-medium text-sm">{listing.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {listing.city}, {listing.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {listing.pricePerHour ? `$${listing.pricePerHour}/hr` : listing.pricePerDay ? `$${listing.pricePerDay}/day` : "—"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={listing.active ? "default" : "secondary"} className="text-xs">
                            {listing.active ? "Active" : "Inactive"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{listing._count.bookings} bookings</span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-3">
                {profileData.bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium">No bookings yet</p>
                    <Link href="/search">
                      <Button className="mt-3 bg-green-600 hover:bg-green-700" size="sm">Find Parking</Button>
                    </Link>
                  </div>
                ) : (
                  profileData.bookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition-all"
                    >
                      <div>
                        <p className="font-medium text-sm">{booking.listing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(booking.startTime), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${Number(booking.totalAmount).toFixed(2)}</p>
                        <Badge
                          variant={
                            booking.status === "CONFIRMED" ? "default"
                            : booking.status === "COMPLETED" ? "secondary"
                            : "destructive"
                          }
                          className="text-xs mt-1"
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-3">
                {profileData.reviewsReceived.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium">No reviews yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Reviews appear after completed bookings</p>
                  </div>
                ) : (
                  profileData.reviewsReceived.map((review) => (
                    <div key={review.id} className="p-3 border rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                            {review.author.image ? (
                              <img src={review.author.image} alt="" className="w-full h-full rounded-full" />
                            ) : (
                              <User className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{review.author.name || "Anonymous"}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(review.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
