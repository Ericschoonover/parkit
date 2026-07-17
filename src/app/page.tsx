import { LinkButton } from "@/components/link-button";
import { Car, MapPin, Shield, Clock, Star, ArrowRight, Users, DollarSign, CheckCircle, Building2, Zap, Ticket } from "lucide-react";

const testimonials = [
  {
    name: "Marcus T.",
    area: "Landover",
    text: "My driveway is a 5-minute walk from Northwest Stadium. Made $600 last Commanders season just renting it out on game days. Beats sitting in traffic.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    area: "Navy Yard",
    text: "I live near Nationals Park and never drive to games. Sold my spot for every concert and Nats game last summer. Best side hustle ever.",
    rating: 5,
  },
  {
    name: "James L.",
    area: "Chinatown",
    text: "My garage spot near Capital One Arena earns money every time the Wizards or Caps play. I take the Metro and someone else pays for my parking.",
    rating: 5,
  },
];

const areas = [
  { name: "Landover", near: "Northwest Stadium", listings: "15+" },
  { name: "Downtown DC", near: "Capital One Arena", listings: "20+" },
  { name: "Navy Yard", near: "Nationals Park", listings: "12+" },
  { name: "Bristow", near: "Jiffy Lube Live", listings: "8+" },
  { name: "Arlington", near: "Multiple Venues", listings: "14+" },
  { name: "Capitol Heights", near: "NW Stadium / Metro", listings: "10+" },
];

const featuredEvents = [
  { name: "Wizards vs Celtics", venue: "Capital One Arena", date: "Oct 28", type: "NBA", color: "bg-orange-100 text-orange-700" },
  { name: "Caps vs Penguins", venue: "Capital One Arena", date: "Oct 14", type: "NHL", color: "bg-blue-100 text-blue-700" },
  { name: "Nats vs Braves", venue: "Nationals Park", date: "Sep 4", type: "MLB", color: "bg-red-100 text-red-700" },
  { name: "DC United vs Inter Miami", venue: "Audi Field", date: "Sep 13", type: "MLS", color: "bg-green-100 text-green-700" },
  { name: "Foo Fighters", venue: "Nationals Park", date: "Aug 17", type: "Concert", color: "bg-purple-100 text-purple-700" },
  { name: "Commanders vs Seahawks", venue: "Northwest Stadium", date: "Sep 27", type: "NFL", color: "bg-blue-100 text-blue-700" },
  { name: "Morgan Wallen", venue: "Northwest Stadium", date: "Sep 5", type: "Concert", color: "bg-purple-100 text-purple-700" },
  { name: "KAROL G", venue: "Northwest Stadium", date: "Aug 2", type: "Concert", color: "bg-purple-100 text-purple-700" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a5632] via-[#0f3d22] to-[#0a2618] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur">
              <Building2 className="h-4 w-4" />
              DC&apos;s parking marketplace
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Don&apos;t Pay
              <br />
              <span className="text-[#D4A574]">$40-60 for Parking.</span>
              <br />
              Pay a Neighbor Instead.
            </h1>
            <p className="text-lg lg:text-xl text-white/80 max-w-xl mb-8 leading-relaxed">
              Rent driveways, garages, and private spots near every stadium, arena, and venue in the DMV.
              Save up to 70% on game day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <LinkButton size="lg" href="/search" className="bg-white text-[#1a5632] hover:bg-white/90 text-base">
                <MapPin className="mr-2 h-5 w-5" />
                Find Parking
              </LinkButton>
              <LinkButton
                size="lg"
                variant="outline"
                href="/listings/new"
                className="border-white/30 text-white hover:bg-white/10 text-base"
              >
                <Car className="mr-2 h-5 w-5" />
                List Your Spot
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Area Selector */}
      <section className="py-12 bg-background border-b">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center mb-4">Find parking near your venue</p>
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((area) => (
              <LinkButton
                key={area.name}
                href={`/search?q=${area.name}`}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                {area.name}
                <span className="ml-1.5 text-muted-foreground text-xs">{area.near}</span>
              </LinkButton>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Stress-free parking for every game, concert, and event in the DMV</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#1a5632]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-[#1a5632]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Find a Spot</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Search by venue or neighborhood. See real-time prices from homeowners near every DC-area venue.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#1a5632]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-7 w-7 text-[#1a5632]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Book & Pay</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Reserve your spot before the event. Pay securely online. No cash needed on game day.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#1a5632]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-7 w-7 text-[#1a5632]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Park & Go</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Follow directions to your reserved spot. Walk or take the Metro to the venue. Enjoy the event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Teaser */}
      <section className="py-16 lg:py-24 bg-background border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Upcoming Events</h2>
            <p className="text-muted-foreground">Book parking before tickets sell out</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredEvents.map((event) => (
              <div key={event.name + event.date} className="p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${event.color}`}>{event.type}</span>
                  <span className="text-xs text-muted-foreground">{event.date}</span>
                </div>
                <p className="font-bold text-lg leading-tight">{event.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{event.venue}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <LinkButton href="/events" variant="outline" size="lg">
              <Ticket className="mr-2 h-4 w-4" />
              View All Events
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Why List / Why Book Split */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Renter */}
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
                    <p className="text-sm text-muted-foreground">Every spot is reviewed. Read real reviews from other parkers before you book.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Save Up to 70%</p>
                    <p className="text-sm text-muted-foreground">Why pay $40-60 for stadium lots when you can pay $10-20 for a spot closer to the gate?</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Book in Advance</p>
                    <p className="text-sm text-muted-foreground">Reserve days before any event. Never circle the lot on game day.</p>
                  </div>
                </li>
              </ul>
              <LinkButton href="/search" className="w-full mt-6 bg-[#1a5632] hover:bg-[#0f3d22]">
                Find Parking
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
            </div>

            {/* For Owner */}
            <div className="bg-background rounded-2xl p-8 border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold">For Spot Owners</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">List Any Space</p>
                    <p className="text-sm text-muted-foreground">Driveway, garage, lot, or designated spot. If it fits a car, it can be listed.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Earn Passive Income</p>
                    <p className="text-sm text-muted-foreground">Your unused spot earns money. Top hosts make $500+ per season.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">You&apos;re in Control</p>
                    <p className="text-sm text-muted-foreground">Set your price, availability, and rules. Accept or decline bookings.</p>
                  </div>
                </li>
              </ul>
              <LinkButton href="/listings/new" className="w-full mt-6" variant="outline">
                Start Earning
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What DMV Parkers Say</h2>
            <p className="text-muted-foreground">Real users, real spots, real savings in the DC area</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#1a5632]/10 rounded-full flex items-center justify-center text-sm font-bold text-[#1a5632]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.area}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-[#1a5632]">150+</p>
              <p className="text-sm text-muted-foreground mt-1">Parking Spots</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a5632]">40+</p>
              <p className="text-sm text-muted-foreground mt-1">Upcoming Events</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a5632]">4K+</p>
              <p className="text-sm text-muted-foreground mt-1">Bookings Made</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a5632]">4.9</p>
              <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stop Overpaying for Event Parking</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Join thousands of DMV fans who park smarter and earn more with ParkIt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkButton size="lg" href="/auth/signup" className="bg-[#1a5632] hover:bg-[#0f3d22]">
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
