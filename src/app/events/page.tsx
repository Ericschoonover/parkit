"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Search, Calendar, MapPin, Ticket, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  state: string;
  eventDate: string;
  startTime: string;
  eventType: string;
  description: string | null;
}

const eventTypes = [
  { value: "NFL", label: "NFL", color: "bg-blue-100 text-blue-700" },
  { value: "NBA", label: "NBA", color: "bg-orange-100 text-orange-700" },
  { value: "MLB", label: "MLB", color: "bg-red-100 text-red-700" },
  { value: "MLS", label: "MLS", color: "bg-green-100 text-green-700" },
  { value: "Concert", label: "Concerts", color: "bg-purple-100 text-purple-700" },
  { value: "Other", label: "Other", color: "bg-gray-100 text-gray-700" },
];

const eventTypeBadgeColor: Record<string, string> = {
  NFL: "bg-blue-100 text-blue-700 border-blue-200",
  NBA: "bg-orange-100 text-orange-700 border-orange-200",
  MLB: "bg-red-100 text-red-700 border-red-200",
  MLS: "bg-green-100 text-green-700 border-green-200",
  Concert: "bg-purple-100 text-purple-700 border-purple-200",
  Other: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date-asc");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTypes.length === 1) params.set("type", selectedTypes[0]);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedTypes, searchQuery]);

  useEffect(() => {
    const load = async () => {
      await fetchEvents();
    };
    load();
  }, [fetchEvents]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredEvents = events
    .filter((e) => selectedTypes.length === 0 || selectedTypes.includes(e.eventType))
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case "date-desc":
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Upcoming Events</h1>
        <p className="text-muted-foreground">Find parking near games, concerts, and live events</p>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, teams, or venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchEvents()}
            className="pl-10 h-11"
          />
        </div>
        <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
          <SelectTrigger className="w-full sm:w-[180px] h-11">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-asc">Date: Soonest First</SelectItem>
            <SelectItem value="date-desc">Date: Latest First</SelectItem>
            <SelectItem value="name">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Event Type Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTypes([])}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedTypes.length === 0
              ? "bg-green-600 text-white shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All Events
        </button>
        {eventTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => toggleType(type.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTypes.includes(type.value)
                ? "bg-green-600 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 bg-muted rounded-full w-16" />
                  <div className="h-4 bg-muted rounded w-12" />
                </div>
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                <div className="h-3 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">No events found</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different search or filter</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-green-200 group">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${eventTypeBadgeColor[event.eventType] || ""}`}
                    >
                      {event.eventType}
                    </Badge>
                    <span className="text-sm font-medium text-green-600">
                      {format(new Date(event.eventDate), "MMM d")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1.5 group-hover:text-green-700 transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{event.venue}, {event.city}</span>
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {format(new Date(event.startTime), "h:mm a")}
                  </p>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
