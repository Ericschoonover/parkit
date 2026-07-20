"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, MapPin, Filter, Star, Car, Zap, Umbrella, Accessibility, SlidersHorizontal, X, Footprints, Anchor, Truck, Lock, Clock, Navigation, Ban } from "lucide-react";
import Link from "next/link";
import { haversineDistance, formatDistance, formatWalkTime } from "@/lib/distance";
import { useSearchParams } from "next/navigation";

interface Listing {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  pricePerHour: string | null;
  pricePerDay: string | null;
  pricePerWeek: string | null;
  pricePerMonth: string | null;
  capacity: number;
  covered: boolean;
  lit: boolean;
  evCharging: boolean;
  accessible: boolean;
  photos: string[];
  lat: number;
  lng: number;
  parkingType: string;
  vehicleLength: number | null;
  vehicleWidth: number | null;
  vehicleHeight: number | null;
  hookups: string | null;
  gated: boolean;
  activeBookings: number;
  owner: {
    name: string;
    image: string;
  };
  reviews: {
    rating: number;
  }[];
}

interface EventVenue {
  id: string;
  name: string;
  venue: string;
  lat: number;
  lng: number;
}

function FilterContent({
  filters,
  setFilters,
  parkingType,
}: {
  filters: { minPrice: string; maxPrice: string; covered: boolean; lit: boolean; evCharging: boolean; accessible: boolean; gated: boolean };
  setFilters: React.Dispatch<React.SetStateAction<typeof filters>>;
  parkingType: string;
}) {
  const isBoatOrRV = parkingType === "boat" || parkingType === "rv";
  const isLongTerm = parkingType === "long_term";
  const activeCount = [filters.covered, filters.lit, filters.evCharging, filters.accessible, filters.gated].filter(Boolean).length
    + (filters.minPrice ? 1 : 0)
    + (filters.maxPrice ? 1 : 0);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium mb-3">
          {isBoatOrRV ? "Price Range ($/day)" : isLongTerm ? "Price Range ($/month)" : "Price Range ($/hr)"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="minPrice" className="text-xs text-muted-foreground">Min</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="$0"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder={isBoatOrRV ? "$100" : isLongTerm ? "$500" : "$100"}
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Amenities</p>
        <div className="space-y-3">
          {[
            { key: "covered" as const, label: "Covered", icon: Umbrella },
            { key: "lit" as const, label: "Well Lit", icon: null },
            { key: "evCharging" as const, label: "EV Charging", icon: Zap },
            { key: "accessible" as const, label: "Accessible", icon: Accessibility },
            ...(isBoatOrRV || isLongTerm ? [
              { key: "gated" as const, label: "Gated / Fenced", icon: Lock },
            ] : []),
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-3 cursor-pointer p-2 -mx-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Checkbox
                checked={filters[item.key]}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, [item.key]: !!checked })
                }
              />
              {item.icon && <item.icon className="h-4 w-4 text-muted-foreground" />}
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-red-600 hover:text-red-600 hover:bg-red-50"
          onClick={() =>
            setFilters({
              minPrice: "",
              maxPrice: "",
              covered: false,
              lit: false,
              evCharging: false,
              accessible: false,
              gated: false,
            })
          }
        >
          <X className="h-4 w-4 mr-1" />
          Clear All Filters ({activeCount})
        </Button>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("price-low");
  const [parkingType, setParkingType] = useState(initialType);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    covered: false,
    lit: false,
    evCharging: false,
    accessible: false,
    gated: false,
  });
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [events, setEvents] = useState<EventVenue[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mapbox-gl Map type
  const map = useRef<InstanceType<any>>(null);

  const activeFilterCount = [filters.covered, filters.lit, filters.evCharging, filters.accessible, filters.gated].filter(Boolean).length
    + (filters.minPrice ? 1 : 0)
    + (filters.maxPrice ? 1 : 0);

  const isBoatOrRV = parkingType === "boat" || parkingType === "rv";
  const isLongTerm = parkingType === "long_term";

  const searchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.covered) params.set("covered", "true");
      if (filters.lit) params.set("lit", "true");
      if (filters.evCharging) params.set("evCharging", "true");
      if (filters.accessible) params.set("accessible", "true");
      if (filters.gated) params.set("gated", "true");
      if (parkingType && parkingType !== "all") params.set("type", parkingType);

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, parkingType]);

  useEffect(() => {
    const load = async () => {
      await searchListings();
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data.events || []);
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    if (mapContainer.current && !map.current && process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      import("mapbox-gl").then((mapboxgl) => {
        mapboxgl.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [-98.5795, 39.8283],
          zoom: 3,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {}
    );
  }, []);

  useEffect(() => {
    if (map.current && listings.length > 0) {
      import("mapbox-gl").then((mapboxgl) => {
        const markers = document.querySelectorAll(".mapboxgl-marker");
        markers.forEach((m) => m.remove());

        listings.forEach((listing) => {
          const isBooked = listing.activeBookings > 0;
          const markerColor = isBooked ? "#dc2626" : "#16a34a";
          const popup = new mapboxgl.default.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${listing.title}</h3>
              ${isBooked ? '<span class="text-xs text-red-600 font-semibold">BOOKED</span>' : ""}
              <p class="text-xs text-gray-500">${listing.address}</p>
              <p class="text-sm font-bold mt-1" style="color:${markerColor}">
                $${isBoatOrRV ? String(listing.pricePerDay || listing.pricePerHour || 0) : isLongTerm ? String(listing.pricePerMonth || listing.pricePerHour || 0) : String(listing.pricePerHour || 0)}
                <span class="text-xs font-normal text-gray-400">${isBoatOrRV ? "/day" : isLongTerm ? "/mo" : "/hr"}</span>
              </p>
              ${userLocation ? (() => {
                const dist = haversineDistance(userLocation.lat, userLocation.lng, listing.lat, listing.lng);
                return `<p class="text-xs text-blue-600 mt-1">${formatDistance(dist)} from you</p>`;
              })() : ""}
            </div>
          `);

          const el = document.createElement("div");
          el.className = `marker text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold cursor-pointer shadow-lg hover:scale-110 transition-transform ${isBooked ? "bg-red-600" : "bg-green-600"}`;
          el.textContent = `$${isBoatOrRV ? String(listing.pricePerDay || listing.pricePerHour || 0) : isLongTerm ? String(listing.pricePerMonth || listing.pricePerHour || 0) : String(listing.pricePerHour || 0)}`;
          el.onclick = () => setSelectedListing(listing.id);

          new mapboxgl.default.Marker(el)
            .setLngLat([listing.lng, listing.lat])
            .setPopup(popup)
            .addTo(map.current!);
        });

        if (userLocation) {
          const userEl = document.createElement("div");
          userEl.innerHTML = `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 2px #3b82f6,0 2px 6px rgba(0,0,0,0.3);"></div>`;
          new mapboxgl.default.Marker({ element: userEl })
            .setLngLat([userLocation.lng, userLocation.lat])
            .setPopup(new mapboxgl.default.Popup({ offset: 25 }).setHTML('<div class="p-1 text-xs font-semibold">Your Location</div>'))
            .addTo(map.current!);
        }

        if (listings.length > 0) {
          const bounds = new mapboxgl.default.LngLatBounds();
          listings.forEach((l) => bounds.extend([l.lng, l.lat]));
          if (userLocation) bounds.extend([userLocation.lng, userLocation.lat]);
          map.current!.fitBounds(bounds, { padding: 50 });
        }
      });
    }
  }, [listings, userLocation]);

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) return null;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  };

  const getNearestVenue = (listing: Listing) => {
    if (events.length === 0) return null;
    let nearest = events[0];
    let minDist = Infinity;
    for (const event of events) {
      const d = haversineDistance(listing.lat, listing.lng, event.lat, event.lng);
      if (d < minDist) {
        minDist = d;
        nearest = event;
      }
    }
    return { event: nearest, distance: minDist };
  };

  const sortedListings = [...listings].sort((a, b) => {
    const getPrice = (l: Listing) => {
      if (isBoatOrRV) return Number(l.pricePerDay) || 0;
      if (isLongTerm) return Number(l.pricePerMonth) || 0;
      return Number(l.pricePerHour) || 0;
    };
    switch (sortBy) {
      case "price-low":
        return getPrice(a) - getPrice(b);
      case "price-high":
        return getPrice(b) - getPrice(a);
      case "rating":
        return (Number(getAverageRating(b.reviews)) || 0) - (Number(getAverageRating(a.reviews)) || 0);
      case "spots":
        return b.capacity - a.capacity;
      case "distance": {
        const aNearest = getNearestVenue(a);
        const bNearest = getNearestVenue(b);
        return (aNearest?.distance ?? 999) - (bNearest?.distance ?? 999);
      }
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">
          {isBoatOrRV ? "Find Boat & RV Parking" : isLongTerm ? "Find Long-Term Storage" : "Find Parking"}
        </h1>
        <p className="text-muted-foreground">
          {isBoatOrRV ? "Spots near marinas, boat ramps, and RV parks"
            : isLongTerm ? "Monthly and extended parking options"
            : "Discover personal parking spots near venues and downtown areas"}
        </p>
      </div>

      {/* Parking Type Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { value: "all", label: "All", icon: Car },
          { value: "event", label: "Event", icon: Car },
          { value: "boat", label: "Boat", icon: Anchor },
          { value: "rv", label: "RV & Trailer", icon: Truck },
          { value: "long_term", label: "Long-Term", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setParkingType(tab.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              parkingType === tab.value
                ? "bg-green-600 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address, venue, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchListings()}
            className="pl-10 h-11"
          />
        </div>

        {/* Desktop Filter Trigger */}
        <div className="hidden md:block">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" className="h-11 gap-2" />}>
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
              <SheetHeader className="border-b px-6 py-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-6 py-5">
                <FilterContent filters={filters} setFilters={setFilters} parkingType={parkingType} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Filter Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" className="h-11 gap-2" />}>
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <FilterContent filters={filters} setFilters={setFilters} parkingType={parkingType} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Button onClick={searchListings} className="h-11 bg-green-600 hover:bg-green-700 px-6" disabled={loading}>
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {/* Sort + Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {loading ? "Searching..." : `${sortedListings.length} spot${sortedListings.length !== 1 ? "s" : ""} found`}
        </p>
        <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="spots">Most Spots</SelectItem>
            <SelectItem value="distance">Nearest Venue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Map and Results */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="h-[500px] rounded-xl overflow-hidden border bg-muted">
          <div ref={mapContainer} className="h-full w-full" />
        </div>

        {/* Listings */}
        <ScrollArea className="h-[500px]">
          <div className="pr-4 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse rounded-xl border p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedListings.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">No parking spots found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isBoatOrRV
                    ? "No boat or RV spots available yet. Be the first to list one!"
                    : isLongTerm
                    ? "No long-term storage spots found."
                    : "Try adjusting your search or filters"}
                </p>
                <Link href="/listings/new" className="mt-4 inline-block">
                  <Button variant="outline" size="sm">List Your Spot</Button>
                </Link>
              </div>
            ) : (
              sortedListings.map((listing) => (
                <Link key={listing.id} href={`/listings/${listing.id}`}>
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md hover:border-green-200 ${
                      selectedListing === listing.id ? "ring-2 ring-green-600 border-green-600" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                          {(() => {
                            const photos = typeof listing.photos === "string" ? JSON.parse(listing.photos) : listing.photos;
                            return photos[0] ? (
                              <img
                                src={photos[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Car className="h-8 w-8 text-muted-foreground" />
                            );
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{listing.title}</h3>
                              {listing.activeBookings > 0 && (
                                <Badge className="text-xs bg-red-100 text-red-700 border-0 shrink-0">
                                  <Ban className="h-2.5 w-2.5 mr-0.5" /> Booked
                                </Badge>
                              )}
                            </div>
                            <p className="text-lg font-bold text-green-600 shrink-0">
                              ${isBoatOrRV ? String(listing.pricePerDay || listing.pricePerHour) : isLongTerm ? String(listing.pricePerMonth || listing.pricePerHour) : String(listing.pricePerHour)}
                              <span className="text-xs font-normal text-muted-foreground">
                                {isBoatOrRV ? "/day" : isLongTerm ? "/mo" : "/hr"}
                              </span>
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{listing.address}, {listing.city}</span>
                          </p>
                          {userLocation && (
                            <p className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-0.5">
                              <Navigation className="h-3 w-3" />
                              {formatDistance(haversineDistance(userLocation.lat, userLocation.lng, listing.lat, listing.lng))} from you
                            </p>
                          )}
                          {(() => {
                            const nearest = getNearestVenue(listing);
                            if (!nearest || nearest.distance > 20) return null;
                            return (
                              <div className="flex items-center gap-1 mt-1 text-xs text-green-700 font-medium">
                                <Footprints className="h-3 w-3" />
                                {formatDistance(nearest.distance)} to {nearest.event.venue} &middot; {formatWalkTime(nearest.distance)}
                              </div>
                            );
                          })()}
                          <div className="flex items-center gap-2 mt-1.5">
                            {getAverageRating(listing.reviews) && (
                              <span className="text-sm flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {getAverageRating(listing.reviews)}
                              </span>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {listing.capacity} spot{listing.capacity > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {listing.covered && <Badge variant="secondary" className="text-xs px-1.5 py-0">Covered</Badge>}
                            {listing.evCharging && <Badge variant="secondary" className="text-xs px-1.5 py-0">EV</Badge>}
                            {listing.lit && <Badge variant="secondary" className="text-xs px-1.5 py-0">Lit</Badge>}
                            {listing.accessible && <Badge variant="secondary" className="text-xs px-1.5 py-0">Accessible</Badge>}
                            {listing.gated && <Badge variant="secondary" className="text-xs px-1.5 py-0">Gated</Badge>}
                            {listing.parkingType === "BOAT" && <Badge className="text-xs px-1.5 py-0 bg-blue-100 text-blue-700 border-0">Boat</Badge>}
                            {listing.parkingType === "RV" && <Badge className="text-xs px-1.5 py-0 bg-amber-100 text-amber-700 border-0">RV</Badge>}
                            {listing.parkingType === "LONG_TERM" && <Badge className="text-xs px-1.5 py-0 bg-purple-100 text-purple-700 border-0">Long-Term</Badge>}
                            {listing.hookups && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                Hookups
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
