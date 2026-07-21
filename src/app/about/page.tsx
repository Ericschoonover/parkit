import { Metadata } from "next";
import { MapPin, Users, Shield, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About - ParkIt",
  description: "ParkIt is a peer-to-peer parking marketplace connecting drivers with homeowners who have unused parking spaces.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About ParkIt</h1>
      <p className="text-lg text-muted-foreground mb-8">
        ParkIt is a peer-to-peer parking marketplace that connects drivers with homeowners
        who have unused parking spaces near stadiums, arenas, marinas, and venues nationwide.
      </p>

      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Our Mission</h2>
          </div>
          <p className="text-muted-foreground">
            Event parking is broken. Fans pay $40-60 to sit in traffic and walk miles from
            overpriced lots. Meanwhile, homeowners near venues have empty driveways, garages,
            and lots that sit unused on game day. ParkIt connects these two groups — saving
            parkers money and helping hosts earn passive income from spaces they already have.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">How It Works</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li><strong>Hosts</strong> list their parking spaces — driveways, garages, lots, boat slips, RV pads — set their price, and get paid automatically after each booking.</li>
            <li><strong>Guests</strong> search by venue or city, compare prices and reviews, and book a spot before the event. No cash needed on game day.</li>
            <li><strong>ParkIt</strong> handles payments securely through Stripe, provides photo documentation tools for dispute protection, and enforces a clear cancellation policy.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold">Trust & Safety</h2>
          </div>
          <p className="text-muted-foreground">
            Every booking is protected by our photo documentation system, secure escrow payments,
            and structured dispute resolution process. We require hosts to confirm they carry
            homeowner&apos;s insurance, and we provide clear cancellation policies for both parties.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Heart className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold">Built for Everyone</h2>
          </div>
          <p className="text-muted-foreground">
            Whether you&apos;re in a major city or a small town, if you have a parking space,
            you can list it on ParkIt. We serve all 50 states and welcome listings from
            rural areas, suburban neighborhoods, and urban centers alike.
          </p>
        </section>
      </div>
    </div>
  );
}
