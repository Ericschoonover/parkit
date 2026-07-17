import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const stmts = [
    `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "name" TEXT, "image" TEXT, "role" TEXT NOT NULL DEFAULT 'RENTER', "phone" TEXT, "stripeAccountId" TEXT, "stripeOnboarded" BOOLEAN NOT NULL DEFAULT false, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
    `CREATE TABLE IF NOT EXISTS "Account" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "type" TEXT NOT NULL, "provider" TEXT NOT NULL, "providerAccountId" TEXT NOT NULL, "refresh_token" TEXT, "access_token" TEXT, "expires_at" INTEGER, "token_type" TEXT, "scope" TEXT, "id_token" TEXT, "session_state" TEXT, CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`,
    `CREATE TABLE IF NOT EXISTS "Session" ("id" TEXT NOT NULL PRIMARY KEY, "sessionToken" TEXT NOT NULL, "userId" TEXT NOT NULL, "expires" DATETIME NOT NULL, CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")`,
    `CREATE TABLE IF NOT EXISTS "VerificationToken" ("identifier" TEXT NOT NULL, "token" TEXT NOT NULL, "expires" DATETIME NOT NULL)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token")`,
    `CREATE TABLE IF NOT EXISTS "Listing" ("id" TEXT NOT NULL PRIMARY KEY, "ownerId" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL, "address" TEXT NOT NULL, "city" TEXT NOT NULL, "state" TEXT NOT NULL, "zipCode" TEXT NOT NULL, "lat" REAL NOT NULL, "lng" REAL NOT NULL, "pricePerHour" REAL NOT NULL, "pricePerEvent" REAL, "capacity" INTEGER NOT NULL DEFAULT 1, "covered" BOOLEAN NOT NULL DEFAULT false, "lit" BOOLEAN NOT NULL DEFAULT false, "evCharging" BOOLEAN NOT NULL DEFAULT false, "accessible" BOOLEAN NOT NULL DEFAULT false, "photos" TEXT NOT NULL DEFAULT '[]', "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
    `CREATE INDEX IF NOT EXISTS "Listing_ownerId_idx" ON "Listing"("ownerId")`,
    `CREATE TABLE IF NOT EXISTS "Event" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "venue" TEXT NOT NULL, "city" TEXT NOT NULL, "state" TEXT NOT NULL, "eventDate" DATETIME NOT NULL, "startTime" DATETIME NOT NULL, "endTime" DATETIME, "lat" REAL NOT NULL, "lng" REAL NOT NULL, "eventType" TEXT NOT NULL, "description" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
    `CREATE INDEX IF NOT EXISTS "Event_eventDate_idx" ON "Event"("eventDate")`,
    `CREATE TABLE IF NOT EXISTS "Booking" ("id" TEXT NOT NULL PRIMARY KEY, "listingId" TEXT NOT NULL, "renterId" TEXT NOT NULL, "eventId" TEXT, "startTime" DATETIME NOT NULL, "endTime" DATETIME NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING', "totalAmount" REAL NOT NULL, "platformFee" REAL NOT NULL, "ownerPayout" REAL NOT NULL, "paymentIntentId" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "Booking_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE)`,
    `CREATE INDEX IF NOT EXISTS "Booking_renterId_idx" ON "Booking"("renterId")`,
    `CREATE INDEX IF NOT EXISTS "Booking_listingId_idx" ON "Booking"("listingId")`,
    `CREATE TABLE IF NOT EXISTS "Review" ("id" TEXT NOT NULL PRIMARY KEY, "bookingId" TEXT NOT NULL, "authorId" TEXT NOT NULL, "subjectId" TEXT NOT NULL, "rating" INTEGER NOT NULL, "comment" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "Review_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Review_bookingId_key" ON "Review"("bookingId")`,
    `CREATE INDEX IF NOT EXISTS "Review_subjectId_idx" ON "Review"("subjectId")`,
  ];

  for (const stmt of stmts) {
    console.log("Running:", stmt.substring(0, 70) + "...");
    await client.execute(stmt);
  }
  console.log("\nSchema pushed to Turso!");

  const r = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("Tables:", r.rows.map(r => r.name).join(", "));
}

main().catch(console.error);
