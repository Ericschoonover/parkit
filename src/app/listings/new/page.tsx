"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { MapPin, X, Umbrella, Zap, Accessibility, Lightbulb, ImageIcon, Car, Anchor, Truck, Clock, Lock, Camera, Info, Route, Shield } from "lucide-react";
import { toast } from "sonner";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY"
];

const PARKING_TYPES = [
  { value: "EVENT", label: "Event Parking", icon: Car, desc: "Near stadiums, arenas, and venues", color: "bg-green-100 text-green-700" },
  { value: "BOAT", label: "Boat Parking", icon: Anchor, desc: "Near marinas and boat ramps", color: "bg-blue-100 text-blue-700" },
  { value: "RV", label: "RV & Trailer", icon: Truck, desc: "Oversized spots with hookups", color: "bg-amber-100 text-amber-700" },
  { value: "LONG_TERM", label: "Long-Term Storage", icon: Clock, desc: "Monthly rates, extended stays", color: "bg-purple-100 text-purple-700" },
];

const SPOT_TYPES = [
  { value: "DRIVEWAY", label: "Driveway" },
  { value: "GARAGE", label: "Garage" },
  { value: "STREET", label: "Street Parking" },
  { value: "LOT", label: "Parking Lot" },
  { value: "CARPORT", label: "Carport" },
  { value: "ALLEY", label: "Alley / Side" },
  { value: "OTHER", label: "Other" },
];

const SURFACE_TYPES = [
  { value: "PAVED", label: "Paved / Asphalt" },
  { value: "CONCRETE", label: "Concrete" },
  { value: "GRAVEL", label: "Gravel" },
  { value: "DIRT", label: "Dirt" },
  { value: "GRASS", label: "Grass" },
  { value: "OTHER", label: "Other" },
];

interface City {
  id: string;
  name: string;
  state: string;
  slug: string;
}

export default function NewListingPage() {
  return (
    <Suspense>
      <NewListingForm />
    </Suspense>
  );
}

function NewListingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    pricePerHour: "",
    pricePerDay: "",
    pricePerWeek: "",
    pricePerMonth: "",
    capacity: "1",
    covered: false,
    lit: false,
    evCharging: false,
    accessible: false,
    parkingType: searchParams.get("type") || "EVENT",
    cityId: "",
    vehicleLength: "",
    vehicleWidth: "",
    vehicleHeight: "",
    hookups: "",
    gated: false,
    monthlyRate: "",
    minDuration: "",
    maxDuration: "",
    spotType: "",
    surfaceType: "",
    maxClearance: "",
    securityCamera: false,
    accessInstructions: "",
    hasInsurance: false,
  });

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then((data) => setCities(data.cities || []));
  }, []);

  useEffect(() => {
    const citySlug = searchParams.get("city");
    if (citySlug && cities.length > 0) {
      const found = cities.find((c) => c.slug === citySlug);
      if (found) {
        setSelectedState(found.state);
        setFormData((prev) => ({
          ...prev,
          city: found.name,
          state: found.state,
          cityId: found.id,
        }));
      }
    }
  }, [searchParams, cities]);

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const isBoatOrRV = formData.parkingType === "BOAT" || formData.parkingType === "RV";
  const isLongTerm = formData.parkingType === "LONG_TERM";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pricePerHour: formData.pricePerHour || undefined,
          pricePerDay: formData.pricePerDay || undefined,
          pricePerWeek: formData.pricePerWeek || undefined,
          pricePerMonth: formData.pricePerMonth || undefined,
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
          <CardTitle>List Your Space</CardTitle>
          <CardDescription>
            Share your driveway, garage, lot, boat slip, or RV pad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Parking Type Selector */}
            <div>
              <Label>What type of parking is this?</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {PARKING_TYPES.map((pt) => (
                  <label
                    key={pt.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.parkingType === pt.value
                        ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                        : "border-muted hover:border-green-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="parkingType"
                      value={pt.value}
                      checked={formData.parkingType === pt.value}
                      onChange={(e) => setFormData({ ...formData, parkingType: e.target.value })}
                      className="sr-only"
                    />
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${pt.color}`}>
                      <pt.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{pt.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{pt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <Label>Photos</Label>
              <p className="text-xs text-muted-foreground mb-2">Add photos to help people find your spot</p>
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
                  placeholder={
                    formData.parkingType === "BOAT" ? "e.g., Boat Slip Near Grand Lake Marina"
                    : formData.parkingType === "RV" ? "e.g., RV Pad with 50A Hookup"
                    : formData.parkingType === "LONG_TERM" ? "e.g., Secure Monthly Parking - Gated"
                    : "e.g., Driveway Near AT&T Stadium"
                  }
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
                  placeholder={
                    isBoatOrRV
                      ? "Describe your space, access details, surface type, nearby amenities..."
                      : "Describe your space, include any special instructions for finding it..."
                  }
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
                <div className="col-span-2">
                  <Label>State</Label>
                  <Select
                    value={selectedState}
                    onValueChange={(v) => {
                      if (!v) return;
                      setSelectedState(v);
                      setFormData({ ...formData, state: v, city: "", cityId: "" });
                    }}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Label>City</Label>
                  <div className="relative mt-1.5">
                    <Input
                      placeholder={selectedState ? "Type any city name..." : "Select state first"}
                      disabled={!selectedState}
                      value={formData.city}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, city: val, cityId: "" });
                        if (val.length >= 1 && selectedState) {
                          const matches = cities.filter(
                            (c) => c.state === selectedState && c.name.toLowerCase().startsWith(val.toLowerCase())
                          );
                          setCitySuggestions(matches.slice(0, 8));
                          setShowSuggestions(matches.length > 0);
                        } else {
                          setShowSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (formData.city.length >= 1 && selectedState) {
                          const matches = cities.filter(
                            (c) => c.state === selectedState && c.name.toLowerCase().startsWith(formData.city.toLowerCase())
                          );
                          setCitySuggestions(matches.slice(0, 8));
                          setShowSuggestions(matches.length > 0);
                        }
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="mt-1.5"
                      required
                    />
                    {showSuggestions && citySuggestions.length > 0 && (
                      <div className="absolute z-50 top-full mt-1 w-full bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {citySuggestions.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-green-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setFormData({ ...formData, city: c.name, cityId: c.id });
                              setShowSuggestions(false);
                            }}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Any city or town in {selectedState || "the US"} — we&apos;ll find it on the map
                  </p>
                </div>
                <div className="col-span-1">
                  <Label htmlFor="zipCode">ZIP</Label>
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

            {/* Spot Details - always shown */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Route className="h-4 w-4" />
                Spot Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Spot Type</Label>
                  <Select value={formData.spotType} onValueChange={(v) => v && setFormData({ ...formData, spotType: v })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPOT_TYPES.map((st) => (
                        <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Surface</Label>
                  <Select value={formData.surfaceType} onValueChange={(v) => v && setFormData({ ...formData, surfaceType: v })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select surface" />
                    </SelectTrigger>
                    <SelectContent>
                      {SURFACE_TYPES.map((st) => (
                        <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="maxClearance">Max Vehicle Height (ft)</Label>
                <p className="text-xs text-muted-foreground mb-1">Leave blank if no restriction. Important for SUVs, trucks, and vans.</p>
                <Input
                  id="maxClearance"
                  type="number"
                  step="0.5"
                  min="6"
                  placeholder="e.g., 7.0"
                  value={formData.maxClearance}
                  onChange={(e) => setFormData({ ...formData, maxClearance: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Vehicle Size (Boat/RV only) */}
            {isBoatOrRV && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Vehicle / Boat Dimensions
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formData.parkingType === "BOAT"
                    ? "Enter your boat length and beam width"
                    : "Enter your RV or trailer dimensions"}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="vehicleLength">Length (ft)</Label>
                    <Input
                      id="vehicleLength"
                      type="number"
                      step="0.5"
                      min="1"
                      placeholder={formData.parkingType === "BOAT" ? "25" : "35"}
                      value={formData.vehicleLength}
                      onChange={(e) => setFormData({ ...formData, vehicleLength: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleWidth">Width (ft)</Label>
                    <Input
                      id="vehicleWidth"
                      type="number"
                      step="0.5"
                      min="1"
                      placeholder={formData.parkingType === "BOAT" ? "8" : "10"}
                      value={formData.vehicleWidth}
                      onChange={(e) => setFormData({ ...formData, vehicleWidth: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleHeight">Height (ft)</Label>
                    <Input
                      id="vehicleHeight"
                      type="number"
                      step="0.5"
                      min="1"
                      placeholder="12"
                      value={formData.vehicleHeight}
                      onChange={(e) => setFormData({ ...formData, vehicleHeight: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hookups (RV only) */}
            {formData.parkingType === "RV" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Hookups &amp; Utilities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "electric", label: "Electric (30A)" },
                    { key: "electric-50", label: "Electric (50A)" },
                    { key: "water", label: "Water Hookup" },
                    { key: "sewer", label: "Sewer Hookup" },
                    { key: "wifi", label: "Wi-Fi" },
                    { key: "dump", label: "Dump Station" },
                  ].map((h) => (
                    <label
                      key={h.key}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition-all ${
                        formData.hookups.includes(h.key)
                          ? "border-amber-400 bg-amber-50"
                          : "border-muted hover:border-amber-200"
                      }`}
                    >
                      <Checkbox
                        checked={formData.hookups.includes(h.key)}
                        onCheckedChange={(checked) => {
                          const current = formData.hookups ? formData.hookups.split(",") : [];
                          const updated = checked
                            ? [...current, h.key]
                            : current.filter((k) => k !== h.key);
                          setFormData({ ...formData, hookups: updated.join(",") });
                        }}
                      />
                      <span>{h.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Pricing</h3>
              {formData.parkingType === "EVENT" && (
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
              )}

              {isBoatOrRV && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="pricePerDay">Daily ($)</Label>
                      <Input
                        id="pricePerDay"
                        type="number"
                        step="0.50"
                        min="1"
                        placeholder="15"
                        value={formData.pricePerDay}
                        onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pricePerWeek">Weekly ($)</Label>
                      <Input
                        id="pricePerWeek"
                        type="number"
                        step="0.50"
                        placeholder="75"
                        value={formData.pricePerWeek}
                        onChange={(e) => setFormData({ ...formData, pricePerWeek: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pricePerMonth">Monthly ($)</Label>
                      <Input
                        id="pricePerMonth"
                        type="number"
                        step="0.50"
                        placeholder="250"
                        value={formData.pricePerMonth}
                        onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="capacity">Number of Spots</Label>
                    <Select value={formData.capacity} onValueChange={(v) => v && setFormData({ ...formData, capacity: v })}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} spot{n > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {isLongTerm && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="pricePerMonth">Monthly Rate ($)</Label>
                      <Input
                        id="pricePerMonth"
                        type="number"
                        step="0.50"
                        min="1"
                        placeholder="150"
                        value={formData.pricePerMonth}
                        onChange={(e) => setFormData({ ...formData, pricePerMonth: e.target.value })}
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="minDuration">Min Stay (days)</Label>
                      <Input
                        id="minDuration"
                        type="number"
                        min="1"
                        placeholder="30"
                        value={formData.minDuration}
                        onChange={(e) => setFormData({ ...formData, minDuration: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxDuration">Max Stay (days)</Label>
                      <Input
                        id="maxDuration"
                        type="number"
                        min="1"
                        placeholder="365"
                        value={formData.maxDuration}
                        onChange={(e) => setFormData({ ...formData, maxDuration: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities & Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Amenities &amp; Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "covered" as const, label: "Covered", icon: Umbrella, desc: "Garage, carport, or awning" },
                  { key: "lit" as const, label: "Well Lit", icon: Lightbulb, desc: "Lighting available" },
                  { key: "evCharging" as const, label: "EV Charging", icon: Zap, desc: "Charging outlet or station" },
                  { key: "accessible" as const, label: "Accessible", icon: Accessibility, desc: "ADA accessible" },
                  { key: "gated" as const, label: "Gated / Fenced", icon: Lock, desc: "Secure perimeter" },
                  { key: "securityCamera" as const, label: "Security Camera", icon: Camera, desc: "Camera monitoring" },
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

            {/* Access Instructions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Info className="h-4 w-4" />
                Access Instructions
              </h3>
              <p className="text-xs text-muted-foreground">
                Help parkers find and access your spot easily
              </p>
              <div>
                <Label htmlFor="accessInstructions">How to access the spot</Label>
                <Textarea
                  id="accessInstructions"
                  placeholder={
                    "e.g., Enter through the side gate on Oak St. The spot is the second driveway on the left. Look for the ParkIt sign. Gate code is 1234."
                  }
                  value={formData.accessInstructions}
                  onChange={(e) => setFormData({ ...formData, accessInstructions: e.target.value })}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
            </div>

            {/* Insurance Acknowledgment */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Insurance
              </h3>
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="pt-4 pb-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={formData.hasInsurance}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, hasInsurance: !!checked })
                      }
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        I confirm I have homeowner&apos;s or renter&apos;s insurance that covers third-party vehicle parking on my property
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ParkIt is a marketplace, not an insurer. You are responsible for maintaining adequate insurance.{" "}
                        <a href="/terms#insurance" className="underline hover:text-foreground">
                          View insurance requirements
                        </a>
                      </p>
                    </div>
                  </label>
                </CardContent>
              </Card>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 h-11"
              disabled={loading || !formData.hasInsurance}
            >
              {loading ? "Creating..." : "Create Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
