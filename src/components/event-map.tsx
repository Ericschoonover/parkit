"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Navigation } from "lucide-react";
import { haversineDistance, formatDistance } from "@/lib/distance";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapMarker {
  id: string;
  title: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  priceUnit: string;
  distance: string;
  walkTime: string;
  covered?: boolean;
  capacity: number;
  activeBookings: number;
}

interface EventMapProps {
  eventLat: number;
  eventLng: number;
  eventVenue: string;
  listings: MapMarker[];
}

export function EventMap({ eventLat, eventLng, eventVenue, listings }: EventMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const listingsWithDist = useMemo(() => {
    if (!userLocation) return listings;
    return listings.map((l) => ({
      ...l,
      userDist: haversineDistance(userLocation[1], userLocation[0], l.lat, l.lng),
    }));
  }, [listings, userLocation]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [eventLng, eventLat],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      if (!map.current) return;

      const eventEl = document.createElement("div");
      eventEl.innerHTML = `
        <div style="background:#ef4444;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `;

      new mapboxgl.Marker({ element: eventEl })
        .setLngLat([eventLng, eventLat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding:4px 8px;font-weight:600;font-size:14px;">${eventVenue}</div>
            <div style="padding:0 8px 4px;font-size:12px;color:#666;">Event Venue</div>
          `)
        )
        .addTo(map.current!);

      listingsWithDist.forEach((listing) => {
        const isBooked = listing.activeBookings > 0;
        const markerColor = isBooked ? "#dc2626" : "#16a34a";
        const el = document.createElement("div");
        el.innerHTML = `
          <div style="background:${markerColor};color:white;padding:4px 8px;border-radius:12px;font-weight:700;font-size:13px;white-space:nowrap;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;text-align:center;line-height:1.2;">
            $${listing.price}
            <div style="font-weight:400;font-size:9px;opacity:0.9;">${listing.priceUnit}</div>
          </div>
        `;

        const distText = "userDist" in listing
          ? `<div style="font-size:11px;color:#3b82f6;margin-top:2px;">${formatDistance((listing as MapMarker & { userDist: number }).userDist)} from you</div>`
          : "";

        new mapboxgl.Marker({ element: el })
          .setLngLat([listing.lng, listing.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 30 }).setHTML(`
              <div style="padding:6px;min-width:160px;">
                <div style="font-weight:600;font-size:14px;margin-bottom:2px;">${listing.title}</div>
                ${isBooked ? '<div style="font-size:11px;color:#dc2626;font-weight:600;margin-bottom:2px;">BOOKED</div>' : ""}
                <div style="font-size:12px;color:#666;margin-bottom:4px;">${listing.address}</div>
                <div style="font-size:12px;color:${markerColor};font-weight:600;margin-bottom:4px;">
                  $${listing.price} ${listing.priceUnit} &middot; ${listing.distance} &middot; ${listing.walkTime}
                </div>
                ${distText}
                <a href="/listings/${listing.id}" style="display:inline-block;background:${markerColor};color:white;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;margin-top:4px;">View Spot</a>
              </div>
            `)
          )
          .addTo(map.current!);
      });

      if (listingsWithDist.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([eventLng, eventLat]);
        listingsWithDist.forEach((l) => bounds.extend([l.lng, l.lat]));
        map.current.fitBounds(bounds, { padding: 60, maxZoom: 15 });
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [eventLat, eventLng, eventVenue, listingsWithDist]);

  useEffect(() => {
    if (!navigator.geolocation || !map.current) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLng = pos.coords.longitude;
        const userLat = pos.coords.latitude;
        setUserLocation([userLng, userLat]);

        if (!map.current) return;

        const userEl = document.createElement("div");
        userEl.innerHTML = `
          <div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 2px #3b82f6,0 2px 6px rgba(0,0,0,0.3);"></div>
        `;

        new mapboxgl.Marker({ element: userEl })
          .setLngLat([userLng, userLat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding:4px 8px;font-size:13px;font-weight:600;">Your Location</div>
            `)
          )
          .addTo(map.current!);
      },
      () => {}
    );
  }, []);

  if (!mapboxgl.accessToken) {
    return (
      <div className="rounded-xl border bg-muted/30 h-[400px] flex items-center justify-center text-muted-foreground text-sm">
        Map requires Mapbox token configuration
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border">
      <div ref={mapContainer} className="h-[400px] w-full" />
      {!userLocation && (
        <button
          onClick={() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setUserLocation([pos.coords.longitude, pos.coords.latitude]);
                map.current?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 13 });
              },
              () => {}
            );
          }}
          className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors z-10"
        >
          <Navigation className="h-4 w-4 text-blue-600" />
          Show my location
        </button>
      )}
    </div>
  );
}
