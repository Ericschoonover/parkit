import { LinkButton } from "@/components/link-button";
import { db } from "@/lib/db";
import { CitySelector } from "@/components/city-selector";
import { StatesGrid } from "@/components/states-grid";
import {
  MapPin,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Users,
  DollarSign,
  CheckCircle,
  Zap,
  Anchor,
  Truck,
  Ticket,
} from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const [cities, events] = await Promise.all([
    db.city.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      include: {
        _count: { select: { listings: true, venues: true, events: true } },
      },
    }),
    db.event.findMany({
      where: { eventDate: { gte: new Date() } },
      orderBy: { eventDate: "asc" },
      take: 12,
      include: { venueRef: true, cityRef: true },
    }),
  ]);

  const citiesByState: Record<string, typeof cities> = {};
  cities.forEach((city) => {
    if (!citiesByState[city.state]) citiesByState[city.state] = [];
    citiesByState[city.state].push(city);
  });
  const sortedStates = Object.keys(citiesByState).sort();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a5632] via-[#0f3d22] to-[#0a2618] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2Za3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur">
              <MapPin className="h-4 w-4" />
              Nationwide parking marketplace
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Don&apos;t Pay
              <br />
              <span className="text-[#D4A574]">$40-60 for Parking.</span>
              <br />
              Pay a Neighbor Instead.
            </h1>
            <p className="text-lg lg:text-xl text-white/80 max-w-xl mb-8 leading-relaxed">
              Rent driveways, garages, and private spots near every stadium,
              arena, and venue in cities across the country. Save up to 70%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CitySelector size="lg" />
              <LinkButton
                size="lg"
                variant="ghost"
                href="/listings/new"
                className="border-2 border-white/80 text-white hover:bg-white/20 hover:text-white text-base font-semibold rounded-lg"
              >
                List Your Spot
                <ArrowRight className="ml-2 h-5 w-5" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Stress-free parking for every game, concert, and event
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#1a5632]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-[#1a5632]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Find a Spot</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pick your city and venue. See real-time prices from homeowners
                near every stadium and arena.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#1a5632]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-7 w-7 text-[#1a5632]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Book & Pay</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Reserve your spot before the event. Pay securely online. No cash
                needed on game day.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#1a5632]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-7 w-7 text-[#1a5632]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Park & Go</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Follow directions to your reserved spot. Walk or take transit to
                the venue. Enjoy the event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section className="py-16 lg:py-24 bg-background border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Find Parking Near You</h2>
            <p className="text-muted-foreground">
              Available in {cities.length} cities across {sortedStates.length} states
            </p>
          </div>
          <StatesGrid citiesByState={citiesByState} sortedStates={sortedStates} />
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Upcoming Events</h2>
              <p className="text-muted-foreground">
                Book parking before tickets sell out
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {events.slice(0, 8).map((event) => {
                const colors: Record<string, string> = {
                  NFL: "bg-blue-100 text-blue-700",
                  NBA: "bg-orange-100 text-orange-700",
                  MLB: "bg-red-100 text-red-700",
                  NHL: "bg-blue-100 text-blue-700",
                  MLS: "bg-green-100 text-green-700",
                  Concert: "bg-purple-100 text-purple-700",
                };
                const dateStr = new Date(event.eventDate).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" }
                );
                return (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[event.eventType] || "bg-gray-100 text-gray-700"}`}
                      >
                        {event.eventType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {dateStr}
                      </span>
                    </div>
                    <p className="font-bold text-sm leading-tight">
                      {event.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.venueRef?.name} · {event.cityRef?.name}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-8">
              <LinkButton href="/events" variant="outline" size="lg">
                <Ticket className="mr-2 h-4 w-4" />
                View All Events
              </LinkButton>
            </div>
          </div>
        </section>
      )}

      {/* Boat & RV Section */}
      <section className="py-16 lg:py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Boat & RV Parking Too
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Need long-term or oversized parking? Find spots near boat ramps,
              RV parks, and outdoor areas with daily, weekly, and monthly rates.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background rounded-2xl p-6 border shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Anchor className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-1">Boat Parking</h3>
              <p className="text-sm text-muted-foreground">
                Secure spots near marinas and boat ramps. Daily and monthly
                rates.
              </p>
            </div>
            <div className="bg-background rounded-2xl p-6 border shadow-sm text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Truck className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg mb-1">RV & Trailer Parking</h3>
              <p className="text-sm text-muted-foreground">
                Oversized spots with hookups available. Short-term and
                long-term.
              </p>
            </div>
            <div className="bg-background rounded-2xl p-6 border shadow-sm text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-1">Long-Term Storage</h3>
              <p className="text-sm text-muted-foreground">
                Monthly rates for extended parking. Gated and secure options.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <LinkButton
              href="/search?type=boat"
              variant="outline"
              size="lg"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Anchor className="mr-2 h-4 w-4" />
              Find Boat & RV Parking
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Why List / Why Book Split */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Parkers */}
            <div className="bg-background rounded-2xl p-8 border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">For Parkers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Verified Listings</p>
                    <p className="text-sm text-muted-foreground">
                      Every spot is reviewed. Read real reviews from other
                      parkers before you book.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Save Up to 70%</p>
                    <p className="text-sm text-muted-foreground">
                      Why pay $40-60 for stadium lots when you can pay $10-20
                      for a spot closer to the gate?
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Book in Advance</p>
                    <p className="text-sm text-muted-foreground">
                      Reserve days before any event. Never circle the lot on
                      game day.
                    </p>
                  </div>
                </li>
              </ul>
              <LinkButton
                href="/search"
                className="w-full mt-6 bg-[#1a5632] hover:bg-[#0f3d22]"
              >
                Find Parking
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
            </div>

            {/* For Spot Owners */}
            <div className="bg-background rounded-2xl p-8 border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold">For Spot Owners</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">List Any Space</p>
                    <p className="text-sm text-muted-foreground">
                      Driveway, garage, lot, boat slip, or RV pad. If it fits a
                      vehicle, it can be listed.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Earn Passive Income</p>
                    <p className="text-sm text-muted-foreground">
                      Your unused spot earns money. Top hosts make $500+ per
                      season.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">You&apos;re in Control</p>
                    <p className="text-sm text-muted-foreground">
                      Set your price, availability, and rules. Accept or decline
                      bookings.
                    </p>
                  </div>
                </li>
              </ul>
              <LinkButton
                href="/listings/new"
                className="w-full mt-6"
                variant="outline"
              >
                Start Earning
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-[#1a5632]">
                {cities.length}+
              </p>
              <p className="text-sm text-muted-foreground mt-1">Cities</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a5632]">
                {cities.reduce((acc, c) => acc + c._count.venues, 0)}+
              </p>
              <p className="text-sm text-muted-foreground mt-1">Venues</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a5632]">
                {cities.reduce((acc, c) => acc + c._count.listings, 0)}+
              </p>
              <p className="text-sm text-muted-foreground mt-1">Parking Spots</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a5632]">
                {events.length}+
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Upcoming Events
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stop Overpaying for Event Parking
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Join thousands of fans who park smarter and earn more with ParkIt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton
              size="lg"
              href="/auth/signup"
              className="bg-[#1a5632] hover:bg-[#0f3d22]"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </LinkButton>
            <LinkButton size="lg" variant="outline" href="/search">
              Browse Spots
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
