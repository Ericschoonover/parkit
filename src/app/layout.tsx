import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParkIt - Affordable Parking Near Venues Nationwide",
  description:
    "ParkIt is a nationwide peer-to-peer parking marketplace. List or rent driveways, garages, lots, boat slips, and RV pads in any city across the US.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster position="top-right" richColors />
            <footer className="border-t py-12 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <p className="font-bold text-lg mb-2">
                      <span className="text-green-600">Park</span>It
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The marketplace for personal parking spots in big cities.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-sm">Explore</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><Link href="/search" className="hover:text-foreground transition-colors">Find Parking</Link></li>
                      <li><Link href="/events" className="hover:text-foreground transition-colors">Events</Link></li>
                      <li><Link href="/search?type=boat" className="hover:text-foreground transition-colors">Boat & RV</Link></li>
                      <li><Link href="/listings/new" className="hover:text-foreground transition-colors">List Your Spot</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-sm">Cities</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><Link href="/new-york-ny" className="hover:text-foreground transition-colors">New York, NY</Link></li>
                      <li><Link href="/los-angeles-ca" className="hover:text-foreground transition-colors">Los Angeles, CA</Link></li>
                      <li><Link href="/chicago-il" className="hover:text-foreground transition-colors">Chicago, IL</Link></li>
                      <li><Link href="/dallas-tx" className="hover:text-foreground transition-colors">Dallas, TX</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-sm">Company</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                      <li><Link href="/safety" className="hover:text-foreground transition-colors">Safety</Link></li>
                      <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                      <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t pt-6 text-center text-sm text-muted-foreground">
                  <p>&copy; {new Date().getFullYear()} ParkIt. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
