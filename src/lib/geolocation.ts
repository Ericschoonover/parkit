import { haversineDistance } from "./distance";

interface GeoCity {
  id: string;
  name: string;
  state: string;
  slug: string;
  lat: number;
  lng: number;
}

interface GeoLocation {
  latitude: number;
  longitude: number;
}

export function findNearestCity(
  userLocation: GeoLocation,
  cities: GeoCity[]
): GeoCity | null {
  if (cities.length === 0) return null;

  let nearest = cities[0];
  let nearestDist = Infinity;

  for (const city of cities) {
    const dist = haversineDistance(
      userLocation.latitude,
      userLocation.longitude,
      city.lat,
      city.lng
    );
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = city;
    }
  }

  return nearest;
}

export function requestBrowserLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  });
}

const CITY_STORAGE_KEY = "parkit-selected-city";
const CITY_TS_KEY = "parkit-city-selected-at";
const ONE_HOUR = 3600000;

export function getStoredCitySlug(): string | null {
  if (typeof window === "undefined") return null;
  const slug = localStorage.getItem(CITY_STORAGE_KEY);
  const ts = localStorage.getItem(CITY_TS_KEY);
  if (!slug || !ts) return null;
  if (Date.now() - parseInt(ts) > ONE_HOUR) {
    localStorage.removeItem(CITY_STORAGE_KEY);
    localStorage.removeItem(CITY_TS_KEY);
    return null;
  }
  return slug;
}

export function setStoredCitySlug(slug: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CITY_STORAGE_KEY, slug);
  localStorage.setItem(CITY_TS_KEY, Date.now().toString());
}
