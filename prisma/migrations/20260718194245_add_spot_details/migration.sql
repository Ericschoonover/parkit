-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "pricePerHour" REAL,
    "pricePerEvent" REAL,
    "pricePerDay" REAL,
    "pricePerWeek" REAL,
    "pricePerMonth" REAL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "covered" BOOLEAN NOT NULL DEFAULT false,
    "lit" BOOLEAN NOT NULL DEFAULT false,
    "evCharging" BOOLEAN NOT NULL DEFAULT false,
    "accessible" BOOLEAN NOT NULL DEFAULT false,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parkingType" TEXT NOT NULL DEFAULT 'EVENT',
    "cityId" TEXT,
    "venueId" TEXT,
    "vehicleLength" REAL,
    "vehicleWidth" REAL,
    "vehicleHeight" REAL,
    "hookups" TEXT,
    "gated" BOOLEAN NOT NULL DEFAULT false,
    "monthlyRate" REAL,
    "minDuration" INTEGER,
    "maxDuration" INTEGER,
    "spotType" TEXT,
    "surfaceType" TEXT,
    "maxClearance" REAL,
    "securityCamera" BOOLEAN NOT NULL DEFAULT false,
    "accessInstructions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Listing_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Listing_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("accessible", "active", "address", "capacity", "city", "cityId", "covered", "createdAt", "description", "evCharging", "gated", "hookups", "id", "lat", "lit", "lng", "maxDuration", "minDuration", "monthlyRate", "ownerId", "parkingType", "photos", "pricePerDay", "pricePerEvent", "pricePerHour", "pricePerMonth", "pricePerWeek", "state", "title", "updatedAt", "vehicleHeight", "vehicleLength", "vehicleWidth", "venueId", "zipCode") SELECT "accessible", "active", "address", "capacity", "city", "cityId", "covered", "createdAt", "description", "evCharging", "gated", "hookups", "id", "lat", "lit", "lng", "maxDuration", "minDuration", "monthlyRate", "ownerId", "parkingType", "photos", "pricePerDay", "pricePerEvent", "pricePerHour", "pricePerMonth", "pricePerWeek", "state", "title", "updatedAt", "vehicleHeight", "vehicleLength", "vehicleWidth", "venueId", "zipCode" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE INDEX "Listing_ownerId_idx" ON "Listing"("ownerId");
CREATE INDEX "Listing_cityId_idx" ON "Listing"("cityId");
CREATE INDEX "Listing_parkingType_idx" ON "Listing"("parkingType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
