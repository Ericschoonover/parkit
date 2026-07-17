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
  title: "ParkIt - Parking Near Northwest Stadium & DC Venues",
  description: "Rent driveways, garages, and private spots near Northwest Stadium, Capital One Arena, Nationals Park, and more. Save up to 70% vs stadium lots.",
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
                      <li><Link href="/listings/new" className="hover:text-foreground transition-colors">List Your Spot</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-sm">Cities</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><span className="hover:text-foreground transition-colors cursor-default">Landover (NW Stadium)</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-default">Downtown DC</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-default">Navy Yard</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-default">Bristow, VA</span></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-sm">Company</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><span className="hover:text-foreground transition-colors cursor-default">About</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-default">Safety</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-default">Terms</span></li>
                      <li><span className="hover:text-foreground transition-colors cursor-default">Privacy</span></li>
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
