"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Search, Store, ArrowRightLeft, Shield } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    const load = () => {
      if (session?.user) {
        const u = session.user;
        setFormData({
          name: u.name ?? "",
          email: u.email ?? "",
          phone: (typeof (u as Record<string, unknown>).phone === "string" ? (u as Record<string, unknown>).phone as string : "") || "",
          role: (typeof (u as Record<string, unknown>).role === "string" ? (u as Record<string, unknown>).role as string : "RENTER"),
        });
      }
    };
    load();
  }, [session, status, router]);

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

  if (status === "loading") {
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="space-y-6">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium">{session?.user?.name}</p>
                <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              </div>
            </div>

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
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="mt-1.5"
              />
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

        {/* Stripe Onboarding */}
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
                  Connect your Stripe account to receive payments for your parking spaces
                </p>
              </div>
              <Button variant="outline" className="shrink-0">Connect Stripe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
