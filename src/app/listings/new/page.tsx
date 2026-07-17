"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Upload, X, Umbrella, Zap, Accessibility, Lightbulb, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY"
];

export default function NewListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    pricePerHour: "",
    capacity: "1",
    covered: false,
    lit: false,
    evCharging: false,
    accessible: false,
  });

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pricePerHour: parseFloat(formData.pricePerHour),
          capacity: parseInt(formData.capacity),
          photos,
          lat: 0,
          lng: 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create listing");
      }

      toast.success("Listing created successfully!");
      router.push(`/listings/${data.listing.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const addPhoto = () => {
    const mockUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
    setPhotos([...photos, mockUrl]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>List Your Parking Space</CardTitle>
          <CardDescription>
            Share your driveway, garage, or private spot with people who need parking nearby
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photos */}
            <div>
              <Label>Photos</Label>
              <p className="text-xs text-muted-foreground mb-2">Add photos to help parkers find your spot</p>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square bg-muted rounded-xl overflow-hidden group">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1.5 right-1.5 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPhoto}
                  className="aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-green-600 hover:text-green-600 transition-colors"
                >
                  <ImageIcon className="h-6 w-6 mb-1" />
                  <span className="text-xs">Add Photo</span>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Basic Info</h3>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Driveway Near AT&T Stadium"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your space, include any special instructions for finding it..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1.5"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1.5"
                  required
                />
              </div>
              <div className="grid grid-cols-6 gap-3">
                <div className="col-span-3">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Dallas"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Label>State</Label>
                  <Select value={formData.state} onValueChange={(v) => v && setFormData({ ...formData, state: v })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="TX" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="75201"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Pricing & Capacity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricePerHour">Price per Hour ($)</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    step="0.50"
                    min="1"
                    placeholder="10"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Number of Spots</Label>
                  <Select value={formData.capacity} onValueChange={(v) => v && setFormData({ ...formData, capacity: v })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} spot{n > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "covered" as const, label: "Covered", icon: Umbrella, desc: "Garage or carport" },
                  { key: "lit" as const, label: "Well Lit", icon: Lightbulb, desc: "Lighting available" },
                  { key: "evCharging" as const, label: "EV Charging", icon: Zap, desc: "Charging outlet" },
                  { key: "accessible" as const, label: "Accessible", icon: Accessibility, desc: "ADA accessible" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData[item.key]
                        ? "border-green-600 bg-green-50"
                        : "border-muted hover:border-green-200"
                    }`}
                  >
                    <Checkbox
                      checked={formData[item.key]}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, [item.key]: !!checked })
                      }
                    />
                    <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-sm font-medium">{item.label}</span>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 h-11"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
