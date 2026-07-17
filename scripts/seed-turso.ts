import { createClient } from "@libsql/client";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const NW_STADIUM_LAT = 38.907677;
const NW_STADIUM_LNG = -76.864853;

const events = [
  { name: "Washington Commanders vs Miami Dolphins", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-08-14T00:00:00Z", startTime: "2026-08-14T23:00:00Z", endTime: "2026-08-15T02:00:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "NFL", description: "Commanders preseason home opener vs the Miami Dolphins." },
  { name: "Washington Commanders vs Seattle Seahawks", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-09-27T00:00:00Z", startTime: "2026-09-27T17:00:00Z", endTime: "2026-09-27T20:00:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "NFL", description: "Week 3 NFL matchup." },
  { name: "Washington Commanders vs New York Giants", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-10-11T00:00:00Z", startTime: "2026-10-11T17:00:00Z", endTime: "2026-10-11T20:00:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "NFL", description: "Week 5 NFC East divisional rivalry game." },
  { name: "Washington Commanders vs Philadelphia Eagles", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-11-01T00:00:00Z", startTime: "2026-11-01T00:20:00Z", endTime: "2026-11-01T03:30:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "NFL", description: "Sunday Night Football!" },
  { name: "Washington Commanders vs Los Angeles Rams", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-11-08T00:00:00Z", startTime: "2026-11-08T18:00:00Z", endTime: "2026-11-08T21:00:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "NFL", description: "Week 9 matchup." },
  { name: "Washington Commanders vs Cincinnati Bengals", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-11-23T00:00:00Z", startTime: "2026-11-24T00:15:00Z", endTime: "2026-11-24T03:30:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "NFL", description: "Monday Night Football!" },
  { name: "Washington Commanders vs Houston Texans", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-12-13T00:00:00Z", startTime: "2026-12-13T18:00:00Z", endTime: "2026-12-13T21:00:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "NFL", description: "Week 14 showdown." },
  { name: "Washington Commanders vs Atlanta Falcons", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-12-20T00:00:00Z", startTime: "2026-12-20T18:00:00Z", endTime: "2026-12-20T21:00:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "NFL", description: "Week 15 regular season game." },
  { name: "KAROL G - Viajando Por El Mundo Tropitour", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-08-02T00:00:00Z", startTime: "2026-08-02T23:00:00Z", endTime: "2026-08-03T03:00:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "Concert", description: "KAROL G brings her massive Tropitour to Northwest Stadium." },
  { name: "Foo Fighters: Take Cover Tour 2026", venue: "Nationals Park", city: "Washington", state: "DC", eventDate: "2026-08-17T00:00:00Z", startTime: "2026-08-17T21:30:00Z", endTime: "2026-08-18T00:30:00Z", lat: 38.8730, lng: -77.0074, eventType: "Concert", description: "Foo Fighters Take Cover Tour at Nationals Park." },
  { name: "My Chemical Romance: The Black Parade 2026", venue: "Nationals Park", city: "Washington", state: "DC", eventDate: "2026-08-18T00:00:00Z", startTime: "2026-08-18T23:00:00Z", endTime: "2026-08-19T02:00:00Z", lat: 38.8730, lng: -77.0074, eventType: "Concert", description: "My Chemical Romance The Black Parade 2026 at Nationals Park." },
  { name: "Phoebe Bridgers: The Lost Tour", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2026-09-29T00:00:00Z", startTime: "2026-09-29T23:30:00Z", endTime: "2026-09-30T02:00:00Z", lat: 38.8981, lng: -77.0209, eventType: "Concert", description: "Phoebe Bridgers at Capital One Arena." },
  { name: "Gorillaz: The Mountain Tour", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2026-09-26T00:00:00Z", startTime: "2026-09-26T23:00:00Z", endTime: "2026-09-27T02:00:00Z", lat: 38.8981, lng: -77.0209, eventType: "Concert", description: "Gorillaz The Mountain Tour at Capital One Arena." },
  { name: "Chris Stapleton: All-American Road Show", venue: "Jiffy Lube Live", city: "Bristow", state: "VA", eventDate: "2026-10-02T00:00:00Z", startTime: "2026-10-02T23:30:00Z", endTime: "2026-10-03T02:30:00Z", lat: 38.7863, lng: -77.5876, eventType: "Concert", description: "Chris Stapleton at Jiffy Lube Live." },
  { name: "NE-YO & Akon: Nights Like This Tour", venue: "Jiffy Lube Live", city: "Bristow", state: "VA", eventDate: "2026-07-17T00:00:00Z", startTime: "2026-07-18T00:00:00Z", endTime: "2026-07-18T03:00:00Z", lat: 38.7863, lng: -77.5876, eventType: "Concert", description: "NE-YO & Akon at Jiffy Lube Live." },
  { name: "KATSEYE: The Wild World Tour", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2026-10-22T00:00:00Z", startTime: "2026-10-23T00:00:00Z", endTime: "2026-10-23T03:00:00Z", lat: 38.8981, lng: -77.0209, eventType: "Concert", description: "KATSEYE The Wild World Tour at Capital One Arena." },
  { name: "Otakon 2026", venue: "Walter E. Washington Convention Center", city: "Washington", state: "DC", eventDate: "2026-07-31T00:00:00Z", startTime: "2026-07-31T14:00:00Z", endTime: "2026-08-02T18:00:00Z", lat: 38.9023, lng: -77.0196, eventType: "Other", description: "Three epic days of anime, gaming, and cosplay." },
  { name: "Citi Open Tennis", venue: "Rock Creek Park Tennis Center", city: "Washington", state: "DC", eventDate: "2026-07-25T00:00:00Z", startTime: "2026-07-25T16:00:00Z", endTime: "2026-08-02T22:00:00Z", lat: 38.9480, lng: -77.0500, eventType: "Other", description: "Washington DC's premier tennis event." },
  { name: "Washington Wizards vs Boston Celtics", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2026-10-28T00:00:00Z", startTime: "2026-10-28T23:00:00Z", endTime: "2026-10-29T01:30:00Z", lat: 38.8981, lng: -77.0209, eventType: "NBA", description: "Wizards home opener vs the Celtics." },
  { name: "Washington Wizards vs New York Knicks", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2026-11-15T00:00:00Z", startTime: "2026-11-15T23:00:00Z", endTime: "2026-11-16T01:30:00Z", lat: 38.8981, lng: -77.0209, eventType: "NBA", description: "Saturday night showdown at Capital One Arena." },
  { name: "Washington Wizards vs Los Angeles Lakers", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2026-12-19T00:00:00Z", startTime: "2026-12-19T23:00:00Z", endTime: "2026-12-20T01:30:00Z", lat: 38.8981, lng: -77.0209, eventType: "NBA", description: "Lakers come to DC for a Friday night showdown." },
  { name: "Washington Wizards vs Miami Heat", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2027-01-10T00:00:00Z", startTime: "2027-01-10T22:00:00Z", endTime: "2027-01-11T00:30:00Z", lat: 38.8981, lng: -77.0209, eventType: "NBA", description: "Wizards host the Heat." },
  { name: "Washington Wizards vs Chicago Bulls", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2027-02-21T00:00:00Z", startTime: "2027-02-21T22:00:00Z", endTime: "2027-02-22T00:30:00Z", lat: 38.8981, lng: -77.0209, eventType: "NBA", description: "Presidents Day weekend matchup." },
  { name: "Washington Capitals vs Pittsburgh Penguins", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2026-10-14T00:00:00Z", startTime: "2026-10-14T23:00:00Z", endTime: "2026-10-15T01:30:00Z", lat: 38.8981, lng: -77.0209, eventType: "NHL", description: "Capitals vs Penguins rivalry game." },
  { name: "Washington Capitals vs Philadelphia Flyers", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2026-11-07T00:00:00Z", startTime: "2026-11-07T23:00:00Z", endTime: "2026-11-08T01:30:00Z", lat: 38.8981, lng: -77.0209, eventType: "NHL", description: "NHL rivalry night." },
  { name: "Washington Capitals vs New York Rangers", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2026-12-27T00:00:00Z", startTime: "2026-12-27T23:00:00Z", endTime: "2026-12-28T01:30:00Z", lat: 38.8981, lng: -77.0209, eventType: "NHL", description: "Post-holiday showdown." },
  { name: "Washington Capitals vs Carolina Hurricanes", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2027-01-17T00:00:00Z", startTime: "2027-01-17T22:00:00Z", endTime: "2027-01-18T00:30:00Z", lat: 38.8981, lng: -77.0209, eventType: "NHL", description: "Metropolitan Division clash." },
  { name: "Washington Capitals vs Boston Bruins", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: "2027-02-07T00:00:00Z", startTime: "2027-02-07T23:00:00Z", endTime: "2027-02-08T01:30:00Z", lat: 38.8981, lng: -77.0209, eventType: "NHL", description: "Original Six vs the Caps." },
  { name: "Washington Nationals vs Atlanta Braves", venue: "Nationals Park", city: "Washington", state: "DC", eventDate: "2026-09-04T00:00:00Z", startTime: "2026-09-04T23:05:00Z", endTime: "2026-09-05T02:00:00Z", lat: 38.8730, lng: -77.0074, eventType: "MLB", description: "Friday night baseball at Nationals Park." },
  { name: "Washington Nationals vs New York Mets", venue: "Nationals Park", city: "Washington", state: "DC", eventDate: "2026-09-12T00:00:00Z", startTime: "2026-09-12T22:05:00Z", endTime: "2026-09-13T01:00:00Z", lat: 38.8730, lng: -77.0074, eventType: "MLB", description: "Saturday afternoon baseball." },
  { name: "Washington Nationals vs Philadelphia Phillies", venue: "Nationals Park", city: "Washington", state: "DC", eventDate: "2026-09-25T00:00:00Z", startTime: "2026-09-25T23:05:00Z", endTime: "2026-09-26T02:00:00Z", lat: 38.8730, lng: -77.0074, eventType: "MLB", description: "Final weekend of the regular season." },
  { name: "Washington Nationals vs Miami Marlins", venue: "Nationals Park", city: "Washington", state: "DC", eventDate: "2026-08-21T00:00:00Z", startTime: "2026-08-21T23:05:00Z", endTime: "2026-08-22T02:00:00Z", lat: 38.8730, lng: -77.0074, eventType: "MLB", description: "Friday night at the park. Fireworks after the game." },
  { name: "Washington Nationals vs Los Angeles Dodgers", venue: "Nationals Park", city: "Washington", state: "DC", eventDate: "2026-07-31T00:00:00Z", startTime: "2026-07-31T23:05:00Z", endTime: "2026-08-01T02:00:00Z", lat: 38.8730, lng: -77.0074, eventType: "MLB", description: "Interleague showdown at Nationals Park." },
  { name: "Morgan Wallen: The Dangerous Tour", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-09-05T00:00:00Z", startTime: "2026-09-05T22:00:00Z", endTime: "2026-09-06T02:00:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "Concert", description: "Morgan Wallen stadium tour at Northwest Stadium." },
  { name: "The Weeknd: After Hours Til Dawn Tour", venue: "Northwest Stadium", city: "Landover", state: "MD", eventDate: "2026-08-28T00:00:00Z", startTime: "2026-08-28T22:30:00Z", endTime: "2026-08-29T02:30:00Z", lat: NW_STADIUM_LAT, lng: NW_STADIUM_LNG, eventType: "Concert", description: "The Weeknd performs at Northwest Stadium." },
  { name: "Lainey Wilson: Country's Cool Again Tour", venue: "Jiffy Lube Live", city: "Bristow", state: "VA", eventDate: "2026-08-08T00:00:00Z", startTime: "2026-08-08T22:30:00Z", endTime: "2026-08-09T01:30:00Z", lat: 38.7863, lng: -77.5876, eventType: "Concert", description: "Lainey Wilson at Jiffy Lube Live." },
  { name: "Imagine Dragons: Loom Tour", venue: "Jiffy Lube Live", city: "Bristow", state: "VA", eventDate: "2026-09-19T00:00:00Z", startTime: "2026-09-19T22:00:00Z", endTime: "2026-09-20T01:00:00Z", lat: 38.7863, lng: -77.5876, eventType: "Concert", description: "Imagine Dragons Loom Tour at Jiffy Lube Live." },
  { name: "DC United vs Inter Miami", venue: "Audi Field", city: "Washington", state: "DC", eventDate: "2026-09-13T00:00:00Z", startTime: "2026-09-13T22:30:00Z", endTime: "2026-09-14T00:30:00Z", lat: 38.8686, lng: -77.0128, eventType: "MLS", description: "DC United host Inter Miami at Audi Field." },
  { name: "DC United vs Atlanta United", venue: "Audi Field", city: "Washington", state: "DC", eventDate: "2026-10-04T00:00:00Z", startTime: "2026-10-04T22:00:00Z", endTime: "2026-10-05T00:00:00Z", lat: 38.8686, lng: -77.0128, eventType: "MLS", description: "MLS Eastern Conference clash at Audi Field." },
  { name: "Washington Spirit vs Portland Thorns", venue: "Audi Field", city: "Washington", state: "DC", eventDate: "2026-08-23T00:00:00Z", startTime: "2026-08-23T19:30:00Z", endTime: "2026-08-23T21:30:00Z", lat: 38.8686, lng: -77.0128, eventType: "Other", description: "NWSL action at Audi Field." },
];

const listings = [
  { title: "Driveway Steps from Northwest Stadium", description: "Private driveway directly off Brightseat Rd, 3-minute walk to Northwest Stadium gates.", address: "300 Brightseat Rd", city: "Landover", state: "MD", zipCode: "20785", lat: 38.9090, lng: -76.8620, pricePerHour: 15, capacity: 2, covered: false, lit: true, evCharging: false, accessible: true },
  { title: "Covered Garage - Walking Distance to NW Stadium", description: "Private 1-car garage, 8-minute walk to Northwest Stadium.", address: "7407 Landover Rd", city: "Landover", state: "MD", zipCode: "20785", lat: 38.9065, lng: -76.8580, pricePerHour: 20, capacity: 1, covered: true, lit: true, evCharging: false, accessible: false },
  { title: "Open Lot Near Morgan Blvd Metro", description: "Large gravel lot steps from Morgan Blvd Metro station.", address: "8100 River Rd", city: "Landover", state: "MD", zipCode: "20785", lat: 38.9120, lng: -76.8540, pricePerHour: 10, capacity: 6, covered: false, lit: false, evCharging: false, accessible: true },
  { title: "Premium Spot with EV Charging - Capitol Heights", description: "Level 2 EV charger in my driveway.", address: "150 Southern Ave", city: "Capitol Heights", state: "MD", zipCode: "20743", lat: 38.8880, lng: -76.8580, pricePerHour: 22, capacity: 1, covered: true, lit: true, evCharging: true, accessible: false },
  { title: "Budget Parking - Short Drive to Stadium", description: "Affordable parking in my side yard.", address: "6201 Landover Rd", city: "Landover", state: "MD", zipCode: "20784", lat: 38.9010, lng: -76.8450, pricePerHour: 8, capacity: 3, covered: false, lit: false, evCharging: false, accessible: false },
  { title: "Garage Spot - Downtown DC Near Capital One Arena", description: "Private parking space in a secured garage, 2 blocks from Capital One Arena.", address: "600 F St NW", city: "Washington", state: "DC", zipCode: "20004", lat: 38.8985, lng: -77.0215, pricePerHour: 25, capacity: 1, covered: true, lit: true, evCharging: false, accessible: true },
  { title: "Street Parking Near Chinatown", description: "Reserved street spot on F Street NW, 3-minute walk to Capital One Arena.", address: "701 F St NW", city: "Washington", state: "DC", zipCode: "20004", lat: 38.8978, lng: -77.0190, pricePerHour: 18, capacity: 1, covered: false, lit: true, evCharging: false, accessible: false },
  { title: "Driveway Near Nationals Park", description: "Private driveway in Navy Yard, 5-minute walk to Nationals Park.", address: "100 M St SE", city: "Washington", state: "DC", zipCode: "20003", lat: 38.8725, lng: -77.0055, pricePerHour: 20, capacity: 2, covered: false, lit: true, evCharging: false, accessible: false },
  { title: "Covered Spot in Navy Yard Garage", description: "Reserved spot in a private garage on Half Street SE.", address: "150 Half St SE", city: "Washington", state: "DC", zipCode: "20003", lat: 38.8710, lng: -77.0040, pricePerHour: 28, capacity: 1, covered: true, lit: true, evCharging: true, accessible: true },
  { title: "Farm Field Parking - Jiffy Lube Live", description: "Open field parking on my property, 3-minute drive to Jiffy Lube Live.", address: "10700 Linton Hall Rd", city: "Bristow", state: "VA", zipCode: "20136", lat: 38.7900, lng: -77.5800, pricePerHour: 12, capacity: 8, covered: false, lit: false, evCharging: false, accessible: false },
  { title: "Driveway Parking Near Jiffy Lube Live", description: "Paved driveway on Devlin Rd, 5 minutes from Jiffy Lube Live.", address: "7500 Devlin Rd", city: "Bristow", state: "VA", zipCode: "20136", lat: 38.7830, lng: -77.5750, pricePerHour: 15, capacity: 3, covered: false, lit: true, evCharging: false, accessible: false },
];

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log("Seeding events...");
  for (const event of events) {
    const id = slugify(event.name);
    await client.execute({
      sql: `INSERT OR REPLACE INTO "Event" (id, name, venue, city, state, eventDate, startTime, endTime, lat, lng, eventType, description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      args: [id, event.name, event.venue, event.city, event.state, event.eventDate, event.startTime, event.endTime, event.lat, event.lng, event.eventType, event.description],
    });
    console.log(`  ${event.name}`);
  }

  console.log("Seeding owner...");
  await client.execute({
    sql: `INSERT OR REPLACE INTO "User" (id, email, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
    args: ["seed-owner-1", "owner@parkit-demo.com", "Demo Parking Owner", "OWNER"],
  });

  console.log("Seeding listings...");
  for (const listing of listings) {
    const id = slugify(listing.title);
    await client.execute({
      sql: `INSERT OR REPLACE INTO "Listing" (id, ownerId, title, description, address, city, state, zipCode, lat, lng, pricePerHour, capacity, covered, lit, evCharging, accessible, photos, active, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', true, datetime('now'), datetime('now'))`,
      args: [id, "seed-owner-1", listing.title, listing.description, listing.address, listing.city, listing.state, listing.zipCode, listing.lat, listing.lng, listing.pricePerHour, listing.capacity, listing.covered, listing.lit, listing.evCharging, listing.accessible],
    });
    console.log(`  ${listing.title}`);
  }

  console.log("\nSeed complete!");
}

main().catch(console.error);
