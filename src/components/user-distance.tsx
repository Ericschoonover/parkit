"use client";

import { useState, useEffect } from "react";
import { Navigation } from "lucide-react";
import { haversineDistance, formatDistance } from "@/lib/distance";

interface UserDistanceProps {
  lat: number;
  lng: number;
}

export function UserDistance({ lat, lng }: UserDistanceProps) {
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = haversineDistance(pos.coords.latitude, pos.coords.longitude, lat, lng);
        setDistance(dist);
      },
      () => {}
    );
  }, [lat, lng]);

  if (distance === null) return null;

  return (
    <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
      <Navigation className="h-4 w-4" />
      {formatDistance(distance)} from you
    </p>
  );
}
