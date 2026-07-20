"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface LocationMapProps {
  lat: number;
  lng: number;
  title: string;
  address: string;
}

export function LocationMap({ lat, lng, title, address }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 15,
      interactive: true,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    const el = document.createElement("div");
    el.innerHTML = `
      <div style="background:#16a34a;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    `;

    new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding:6px;">
            <div style="font-weight:600;font-size:14px;margin-bottom:2px;">${title}</div>
            <div style="font-size:12px;color:#666;">${address}</div>
          </div>
        `)
      )
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [lat, lng, title, address]);

  if (!mapboxgl.accessToken) {
    return (
      <div className="rounded-xl border bg-muted/30 h-[250px] flex items-center justify-center text-muted-foreground text-sm">
        Map unavailable
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border">
      <div ref={mapContainer} className="h-[250px] w-full" />
    </div>
  );
}
