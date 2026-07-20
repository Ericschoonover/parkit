"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ArrowLeft, MapPin } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface City {
  id: string;
  name: string;
  state: string;
  slug: string;
  lat: number;
  lng: number;
  _count: { listings: number; venues: number; events: number };
}

interface StatesGridProps {
  citiesByState: Record<string, City[]>;
  sortedStates: string[];
}

const STATE_CENTER: Record<string, [number, number, number]> = {
  AL: [-86.9, 32.8, 7], AK: [-153.5, 64.2, 4], AZ: [-111.1, 34.3, 6],
  AR: [-92.4, 34.8, 7], CA: [-119.7, 36.8, 5], CO: [-105.5, 39.0, 6],
  CT: [-72.8, 41.6, 8], DE: [-75.5, 39.0, 8], FL: [-81.7, 27.8, 6],
  GA: [-83.5, 32.7, 6], HI: [-155.5, 20.0, 7], ID: [-114.7, 44.1, 6],
  IL: [-89.2, 40.0, 6], IN: [-86.3, 39.8, 7], IA: [-93.1, 42.0, 7],
  KS: [-98.4, 38.5, 7], KY: [-85.8, 37.8, 7], LA: [-91.9, 30.5, 7],
  ME: [-69.4, 45.4, 7], MD: [-76.6, 39.0, 7], MA: [-71.8, 42.3, 8],
  MI: [-84.5, 44.3, 6], MN: [-94.3, 46.3, 6], MS: [-89.7, 32.6, 7],
  MO: [-91.8, 38.6, 7], MT: [-109.5, 47.1, 6], NE: [-99.7, 41.5, 7],
  NV: [-116.4, 38.8, 6], NH: [-71.6, 43.7, 8], NJ: [-74.4, 40.1, 8],
  NM: [-106.0, 34.5, 6], NY: [-75.5, 43.0, 6], NC: [-79.8, 35.6, 6],
  ND: [-100.5, 47.4, 7], OH: [-82.8, 40.4, 7], OK: [-97.5, 35.6, 7],
  OR: [-120.6, 44.0, 6], PA: [-77.2, 40.9, 7], RI: [-71.5, 41.7, 9],
  SC: [-81.2, 34.0, 7], SD: [-99.9, 44.4, 7], TN: [-86.6, 35.9, 7],
  TX: [-99.4, 31.5, 5], UT: [-111.7, 39.3, 6], VT: [-72.6, 44.0, 8],
  VA: [-79.4, 37.8, 7], WA: [-120.7, 47.4, 6], WV: [-80.6, 38.6, 7],
  WI: [-89.5, 44.6, 7], WY: [-107.3, 43.1, 7],
};

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

export function StatesGrid({ citiesByState, sortedStates }: StatesGridProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken || !selectedState) return;

    if (map.current) {
      map.current.remove();
    }

    const center = STATE_CENTER[selectedState] || [-98.5, 39.8, 4];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [center[0], center[1]],
      zoom: center[2],
      interactive: true,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    const cities = citiesByState[selectedState] || [];

    cities.forEach((city) => {
      const el = document.createElement("div");
      el.innerHTML = `
        <a href="/${city.slug}" style="text-decoration:none;">
          <div style="background:#16a34a;color:white;padding:3px 8px;border-radius:8px;font-weight:600;font-size:11px;white-space:nowrap;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);cursor:pointer;text-align:center;">
            ${city.name}
          </div>
        </a>
      `;

      new mapboxgl.Marker({ element: el })
        .setLngLat([city.lng, city.lat])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [selectedState, citiesByState]);

  const cities = selectedState ? citiesByState[selectedState] || [] : [];

  return (
    <div>
      {selectedState ? (
        <div>
          <button
            onClick={() => {
              setSelectedState(null);
              map.current?.remove();
              map.current = null;
            }}
            className="flex items-center gap-2 text-sm text-green-700 hover:text-green-900 mb-4 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            All States
          </button>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold">{STATE_NAMES[selectedState]}</h3>
            <span className="text-muted-foreground text-sm">
              {cities.length} cities
            </span>
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden border mb-6">
            <div ref={mapContainer} className="h-[300px] w-full" />
          </div>

          {/* City list */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/${city.slug}`}
                className="flex items-center justify-between p-3 rounded-xl border bg-card hover:shadow-md hover:border-green-200 transition-all group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-bold text-xs shrink-0 group-hover:bg-green-200 transition-colors">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{city.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {city._count.venues} venues
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {city._count.listings} spots
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sortedStates.map((state) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md hover:border-green-200 transition-all group text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-700 font-bold text-sm shrink-0 group-hover:bg-green-200 transition-colors">
                  {state}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {STATE_NAMES[state]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {citiesByState[state]?.length || 0} cities
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
