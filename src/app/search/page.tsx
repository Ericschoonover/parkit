"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { Search, MapPin, Filter, Star, Car, Zap, Umbrella, Accessibility, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  pricePerHour: string;
  capacity: number;
  covered: boolean;
  lit: boolean;
  evCharging: boolean;
  accessible: boolean;
  photos: string[];
  lat: number;
  lng: number;
  owner: {
    name: string;
    image: string;
  };
  reviews: {
    rating: number;
  }[];
}

function FilterContent({
  filters,
  setFilters,
}: {
  filters: { minPrice: string; maxPrice: string; covered: boolean; lit: boolean; evCharging: boolean; accessible: boolean };
  setFilters: React.Dispatch<React.SetStateAction<typeof filters>>;
}) {
  const activeCount = [filters.covered, filters.lit, filters.evCharging, filters.accessible].filter(Boolean).length
    + (filters.minPrice ? 1 : 0)
    + (filters.maxPrice ? 1 : 0);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium mb-3">Price Range ($/hr)</p>
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
              placeholder="$100"
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("price-low");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    covered: false,
    lit: false,
    evCharging: false,
    accessible: false,
  });
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mapbox-gl Map type
  const map = useRef<InstanceType<any>>(null);

  const activeFilterCount = [filters.covered, filters.lit, filters.evCharging, filters.accessible].filter(Boolean).length
    + (filters.minPrice ? 1 : 0)
    + (filters.maxPrice ? 1 : 0);

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

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    const load = async () => {
      await searchListings();
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
    if (map.current && listings.length > 0) {
      import("mapbox-gl").then((mapboxgl) => {
        const markers = document.querySelectorAll(".mapboxgl-marker");
        markers.forEach((m) => m.remove());

        listings.forEach((listing) => {
          const popup = new mapboxgl.default.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${listing.title}</h3>
              <p class="text-xs text-gray-500">${listing.address}</p>
              <p class="text-sm font-bold text-green-600 mt-1">$${String(listing.pricePerHour)}/hr</p>
            </div>
          `);

          const el = document.createElement("div");
          el.className = "marker bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold cursor-pointer shadow-lg hover:scale-110 transition-transform";
          el.textContent = `$${String(listing.pricePerHour)}`;
          el.onclick = () => setSelectedListing(listing.id);

          new mapboxgl.default.Marker(el)
            .setLngLat([listing.lng, listing.lat])
            .setPopup(popup)
            .addTo(map.current!);
        });

        if (listings.length > 0) {
          const bounds = new mapboxgl.default.LngLatBounds();
          listings.forEach((l) => bounds.extend([l.lng, l.lat]));
          map.current!.fitBounds(bounds, { padding: 50 });
        }
      });
    }
  }, [listings]);

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) return null;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  };

  const sortedListings = [...listings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Number(a.pricePerHour) - Number(b.pricePerHour);
      case "price-high":
        return Number(b.pricePerHour) - Number(a.pricePerHour);
      case "rating":
        return (Number(getAverageRating(b.reviews)) || 0) - (Number(getAverageRating(a.reviews)) || 0);
      case "spots":
        return b.capacity - a.capacity;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Find Parking</h1>
        <p className="text-muted-foreground">Discover personal parking spots near venues and downtown areas</p>
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
                <FilterContent filters={filters} setFilters={setFilters} />
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
                <FilterContent filters={filters} setFilters={setFilters} />
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
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
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
                            <h3 className="font-semibold truncate">{listing.title}</h3>
                            <p className="text-lg font-bold text-green-600 shrink-0">${String(listing.pricePerHour)}</p>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{listing.address}, {listing.city}</span>
                          </p>
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
