"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  requestBrowserLocation,
  findNearestCity,
  getStoredCitySlug,
  setStoredCitySlug,
} from "@/lib/geolocation";
import { MapPin, Navigation, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY"
];

const STATE_NAMES: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",
  CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",
  IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",
  ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",
  MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",
  NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",
  OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",
  TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",
  WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"
};

interface City {
  id: string;
  name: string;
  state: string;
  slug: string;
  lat: number;
  lng: number;
  listings: number;
  venues: number;
  events: number;
}

interface CitySelectorProps {
  size?: "default" | "lg";
}

export function CitySelector({ size = "default" }: CitySelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then((data) => {
        setCities(data.cities);
        const stored = getStoredCitySlug();
        if (stored) {
          const found = data.cities.find((c: City) => c.slug === stored);
          if (found) setSelectedCity(found);
        }
      });
  }, []);

  const detectCity = useCallback(async () => {
    if (cities.length === 0) return;
    setDetecting(true);
    try {
      const loc = await requestBrowserLocation();
      const nearest = findNearestCity(loc, cities);
      if (nearest) {
        const found = cities.find((c) => c.id === nearest.id);
        if (found) {
          setSelectedCity(found);
          setStoredCitySlug(found.slug);
        }
      }
    } catch {
      // Geolocation denied or failed
    } finally {
      setDetecting(false);
    }
  }, [cities]);

  const selectCity = (city: City) => {
    setSelectedCity(city);
    setStoredCitySlug(city.slug);
    setSelectedState(null);
    setOpen(false);
  };

  const filteredCities = selectedState
    ? cities.filter((c) => c.state === selectedState)
    : [];

  const uniqueStates = US_STATES.filter((s) =>
    cities.some((c) => c.state === s)
  );

  if (cities.length === 0) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className={`gap-2 rounded-full border-green-200 bg-green-50 text-green-800 hover:bg-green-100 ${
              size === "lg" ? "h-12 px-5 text-base" : "h-9 px-3.5 text-sm"
            }`}
          />
        }
      >
        {selectedCity ? (
          <>
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate max-w-[140px]">
              {selectedCity.name}, {selectedCity.state}
            </span>
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4 shrink-0" />
            <span>Select State</span>
          </>
        )}
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 max-h-96 overflow-hidden p-0">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-2">
          {selectedState ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedState(null)}
                className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All States
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                &middot; {STATE_NAMES[selectedState]}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-green-700" />
              <span className="text-sm font-medium">Select a state</span>
              <button
                onClick={detectCity}
                disabled={detecting}
                className="ml-auto flex items-center gap-1.5 text-xs text-green-700 hover:text-green-900 disabled:opacity-50"
              >
                <Navigation className="h-3 w-3" />
                {detecting ? "..." : "Auto-detect"}
              </button>
            </div>
          )}
        </div>

        {/* State list or City list */}
        <div className="max-h-64 overflow-y-auto p-1">
          {!selectedState ? (
            // Show states
            <div className="grid grid-cols-2 gap-0.5">
              {uniqueStates.map((state) => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted text-left"
                >
                  <span className="font-medium">{state}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {STATE_NAMES[state]}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            // Show cities in selected state
            <>
              {filteredCities.map((city) => (
                <DropdownMenuItem
                  key={city.id}
                  render={
                    <Link
                      href={`/${city.slug}`}
                      onClick={() => selectCity(city)}
                    />
                  }
                  className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 ${
                    selectedCity?.id === city.id ? "bg-green-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{city.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {city.listings} spots
                  </span>
                </DropdownMenuItem>
              ))}
              {filteredCities.length === 0 && (
                <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                  No cities found in {STATE_NAMES[selectedState]}
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-2">
          <Link
            href="/"
            onClick={() => {
              setSelectedState(null);
              setOpen(false);
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            View all cities
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
