<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ParkIt Project Context

## Overview
ParkIt is a **nationwide peer-to-peer parking marketplace**. Users can list or rent driveways, garages, lots, boat slips, and RV pads in any city across the US. It is NOT limited to event parking — it supports long-term storage, boat/RV parking, and everyday parking.

## Tech Stack
- **Framework**: Next.js 16.2.10 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.3.3
- **Database**: Turso/SQLite via Prisma 7.8
- **Auth**: next-auth 5.0.0-beta.31 (Google OAuth + Credentials)
- **Payments**: Stripe Connect (Express accounts for hosts, PaymentIntents for guests)
- **Maps**: Mapbox GL JS
- **Deployment**: Vercel (auto-deploys from GitHub push)
- **Domain**: https://park-it.net (Cloudflare DNS → Vercel)

## Critical Environment Variables
```
AUTH_SECRET=...
AUTH_URL=https://park-it.net
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DATABASE_URL=file:./dev.db
TURSO_DATABASE_URL=libsql://parkit-db-ericschoonover.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...(see .env)
STRIPE_SECRET_KEY=sk_test_...(see .env)
STRIPE_PUBLISHABLE_KEY=pk_test_...(see .env)
STRIPE_WEBHOOK_SECRET=whsec_...(see .env)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...(see .env)
```

## Critical Dev Notes

### Prisma + Turso
- Prisma CLI CANNOT use `libsql://` URLs. Schema changes must be applied via: `turso db shell parkit-db < migration.sql`
- `createMany` works with Turso but `skipDuplicates` is NOT supported
- Local dev uses `file:./dev.db` (SQLite), production uses Turso

### Next.js 16 Specifics
- Directory `[city-slug]` → params accessed as `params["city-slug"]`, NOT `params.citySlug`
- `useSearchParams()` must be wrapped in `<Suspense>` boundary
- `export const config` with `bodyParser: false` is deprecated — use `request.text()` for raw body
- Route handlers use `NextRequest` from `next/server`

### Auth
- `trustHost: true` is required in NextAuth config for Vercel
- Google OAuth redirect URIs include `https://park-it.net/api/auth/callback/google`

### Stripe
- API version: `2026-06-24.dahlia`
- Host onboarding: `/api/stripe/connect` → creates Express account + account link
- Guest checkout: `/api/stripe/checkout` → creates PaymentIntent with Connect transfer
- Webhook: `/api/stripe/webhook` handles payment_intent.succeeded, payment_intent.payment_failed, account.updated, charge.refunded

## Key Architecture

### Data Models
- **City**: 501 seeded cities (top 10 per state + DC), but ANY city can be created on-the-fly when a listing is created for an unlisted town
- **Venue**: Stadiums, arenas, marinas linked to cities
- **Event**: Upcoming events linked to venues
- **Listing**: Parking spots with full details (parkingType, spotType, surfaceType, dimensions, hookups, amenities, pricing)
- **Booking**: PENDING → CONFIRMED (via Stripe webhook) → COMPLETED; CANCELLED on failure
- **Review**: Bidirectional — renter reviews host, host reviews renter; one per booking per person
- **User**: Has stripeAccountId, stripeOnboarded, emailVerified fields

### Booking Flow
1. Guest selects dates on calendar (booked dates shown in red, unavailable)
2. BookingForm creates booking as PENDING + Stripe PaymentIntent
3. Guest enters card details via Stripe Embedded Checkout
4. On payment success, Stripe webhook confirms booking
5. After booking ends, both parties can leave reviews

### Cancellation Policy (enforced in code)
- Host cancels → full refund (parking + deposit)
- Guest cancels 24+ hrs before → full refund (parking + deposit)
- Guest cancels <24 hrs before → 50% parking refund + full deposit refund
- No-show → no parking refund, deposit refunded

### Damage Deposit Flow
- Two PaymentIntents per booking: parking (transferred to host via Connect) + deposit (held on platform)
- Default $0 (no deposit required), configurable per listing (0-500)
- Smart recommendations: $0-10 for cheap listings, $10-25 for mid-range, $25-50 for premium
- After booking ends: host can INITIATE CLAIM (sets CLAIM_PENDING, 48hr guest response window)
- Guest can DISPUTE claim within 48hr → status becomes DISPUTED, ParkIt reviews
- If no dispute in 48hr: host confirms claim → deposit transferred to their Stripe account
- Host can also RELEASE deposit at any time (refunded to guest)
- Cancellation always refunds the deposit if still held
- Deposit states: HELD → CLAIM_PENDING → CLAIMED | RELEASED | DISPUTED

### Seasonal Pricing
- Hosts set price rules with date ranges, optional day-of-week targeting
- Presets: Weekend Premium (+20%), Holiday Surge (+50%), Weekday Discount (-15%)
- Booking creation checks for matching seasonal rules and uses adjusted price
- Overlapping rules prevented server-side

### Report/Flag System
- Users report listings with predefined reasons (fraudulent, dangerous, misleading, etc.)
- Hosts see reports on their listings and can mark as REVIEWED or DISMISSED
- One report per user per listing (prevents duplicates)

### Photo Documentation
- Booking photos: before (renter only) + after (both), stored as base64 data URLs
- Listing photos: file input → base64 data URLs (NOT stock URLs)

### Geocoding
- All new listings auto-geocoded via Nominatim for exact coordinates
- Seed data also geocoded

## What's Built
- [x] Google OAuth with trustHost
- [x] Domain park-it.net configured (Cloudflare → Vercel)
- [x] Terms of Service (escrow accuracy, class action waiver, binding arbitration, 1099-K, force majeure, hold harmless, DMCA, as-is disclaimer, no employment, user disputes, boat/RV/long-term storage disclaimers)
- [x] Privacy Policy (CCPA Do Not Sell, cookie categories, data retention, account deletion, photo storage)
- [x] DMCA takedown policy page
- [x] 501 cities seeded (local + Turso)
- [x] Free-text city input with autocomplete (any town in the US)
- [x] Interactive Mapbox maps (event maps with booked badges, user location, listing detail maps)
- [x] Listing form with full details (parkingType, spotType, surfaceType, dimensions, hookups, amenities)
- [x] Listing detail page with type-aware pricing, user distance
- [x] Search page with type filters, booked badges, user location + distance
- [x] Booking system with conflict prevention, calendar date blocking
- [x] Stripe Connect onboarding for hosts (dashboard banner)
- [x] Stripe Embedded Checkout for guests
- [x] Stripe webhook handling (payment success/fail, account updated, refund)
- [x] Photo documentation (booking before/after photos)
- [x] Real file upload on listing creation (NOT stock URLs)
- [x] Cancellation policy enforcement with Stripe refunds
- [x] Review system (bidirectional, after completed bookings)
- [x] Host insurance acknowledgment checkbox on listing creation
- [x] User profile page (listing history, booking history, reviews, member since)
- [x] Host earnings dashboard (total earned, pending, monthly breakdown, upcoming bookings)
- [x] About page
- [x] Safety page
- [x] Open Graph + Twitter card metadata for link previewss
- [x] Nationwide copy (not just event parking)
- [x] Damage deposit system — two PaymentIntents with dispute flow (48hr guest response window, CLAIM_PENDING/DISPUTED states, host confirm or guest dispute)
- [x] Report/flag listings — users can report with reason + description; hosts see reports on their listings
- [x] Review moderation — flag reviews with reason, hidden from public view while under review
- [x] Cookie consent banner — Essential/Functional/Analytics toggle, saved to localStorage
- [x] Host payout dashboard — transaction history table with date, listing, guest, total, fee, payout, deposit status; platform fees tracking
- [x] Seasonal pricing tools — hosts set date-range price rules with day-of-week targeting (weekdays/weekends/specific days) and quick presets (Weekend Premium, Holiday Surge, Weekday Discount)

## What's Remaining / Nice-to-Have
- [ ] Email notifications (booking confirmed, reminder, review request, payout) — Resend free tier
- [ ] Host cancellation penalties (account-level)
- [ ] Mobile app (React Native)
- [ ] Instant booking option
- [ ] Messaging between hosts and guests

## Business Notes
- **LLC**: ParkIt LLC — forming in Virginia ($100 filing fee)
- **Operating Agreement**: Draft saved at `parkit/LLC-OPERATING-AGREEMENT.md` and desktop as `ParkIt-LLC-Operating-Agreement.md`
- **Virginia LLC requirements**: $100 filing, $50/year annual registration, registered agent required
- **Next steps**: Get EIN (irs.gov/ein), open business bank account, update Stripe to LLC tax info
- **Marketing wedge**: Boat slips in Virginia (high-value, low-competition niche)
- **Key competitors**: SpotHero, ParkWhiz, JustPark (all focused on commercial lots, not peer-to-peer)

## Social Media Cache Busting
When updating metadata/OG tags, use these tools to force re-crawl:
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter/X: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/
