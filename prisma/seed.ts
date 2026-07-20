import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }
  const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── ALL US CITIES (TOP 10 PER STATE) ──────────────────────────────────────────

const cities = [
  // ALABAMA
  { name: "Huntsville", state: "AL", slug: "huntsville-al", lat: 34.7304, lng: -86.5861, timezone: "America/Chicago" },
  { name: "Montgomery", state: "AL", slug: "montgomery-al", lat: 32.3792, lng: -86.3077, timezone: "America/Chicago" },
  { name: "Birmingham", state: "AL", slug: "birmingham-al", lat: 33.5186, lng: -86.8104, timezone: "America/Chicago" },
  { name: "Mobile", state: "AL", slug: "mobile-al", lat: 30.6954, lng: -88.0399, timezone: "America/Chicago" },
  { name: "Tuscaloosa", state: "AL", slug: "tuscaloosa-al", lat: 33.2098, lng: -87.5692, timezone: "America/Chicago" },
  { name: "Hoover", state: "AL", slug: "hoover-al", lat: 33.4054, lng: -86.8114, timezone: "America/Chicago" },
  { name: "Dothan", state: "AL", slug: "dothan-al", lat: 31.2232, lng: -85.3905, timezone: "America/Chicago" },
  { name: "Auburn", state: "AL", slug: "auburn-al", lat: 32.6010, lng: -85.4807, timezone: "America/Chicago" },
  { name: "Decatur", state: "AL", slug: "decatur-al", lat: 34.6059, lng: -86.9834, timezone: "America/Chicago" },
  { name: "Madison", state: "AL", slug: "madison-al", lat: 34.6993, lng: -86.7483, timezone: "America/Chicago" },
  // ALASKA
  { name: "Anchorage", state: "AK", slug: "anchorage-ak", lat: 61.2181, lng: -149.9003, timezone: "America/Anchorage" },
  { name: "Juneau", state: "AK", slug: "juneau-ak", lat: 58.3005, lng: -134.4197, timezone: "America/Anchorage" },
  { name: "Fairbanks", state: "AK", slug: "fairbanks-ak", lat: 64.8378, lng: -147.7164, timezone: "America/Anchorage" },
  { name: "Wasilla", state: "AK", slug: "wasilla-ak", lat: 61.5814, lng: -149.4393, timezone: "America/Anchorage" },
  { name: "Sitka", state: "AK", slug: "sitka-ak", lat: 57.0531, lng: -135.3300, timezone: "America/Anchorage" },
  { name: "Kenai", state: "AK", slug: "kenai-ak", lat: 60.5544, lng: -151.2580, timezone: "America/Anchorage" },
  { name: "Ketchikan", state: "AK", slug: "ketchikan-ak", lat: 55.3422, lng: -131.6461, timezone: "America/Anchorage" },
  { name: "Tanaina", state: "AK", slug: "tanaina-ak", lat: 61.2221, lng: -149.4400, timezone: "America/Anchorage" },
  { name: "Kalifornsky", state: "AK", slug: "kalifornsky-ak", lat: 60.4185, lng: -151.2383, timezone: "America/Anchorage" },
  { name: "Bethel", state: "AK", slug: "bethel-ak", lat: 60.7922, lng: -161.7558, timezone: "America/Anchorage" },
  // ARIZONA
  { name: "Phoenix", state: "AZ", slug: "phoenix-az", lat: 33.4484, lng: -112.0740, timezone: "America/Denver" },
  { name: "Tucson", state: "AZ", slug: "tucson-az", lat: 32.2226, lng: -110.9747, timezone: "America/Denver" },
  { name: "Mesa", state: "AZ", slug: "mesa-az", lat: 33.4152, lng: -111.8315, timezone: "America/Denver" },
  { name: "Chandler", state: "AZ", slug: "chandler-az", lat: 33.3005, lng: -111.8413, timezone: "America/Denver" },
  { name: "Gilbert", state: "AZ", slug: "gilbert-az", lat: 33.3528, lng: -111.7890, timezone: "America/Denver" },
  { name: "Glendale", state: "AZ", slug: "glendale-az", lat: 33.5387, lng: -112.1860, timezone: "America/Denver" },
  { name: "Scottsdale", state: "AZ", slug: "scottsdale-az", lat: 33.4942, lng: -111.9261, timezone: "America/Denver" },
  { name: "Tempe", state: "AZ", slug: "tempe-az", lat: 33.4255, lng: -111.9400, timezone: "America/Denver" },
  { name: "Peoria", state: "AZ", slug: "peoria-az", lat: 33.5806, lng: -112.2374, timezone: "America/Denver" },
  { name: "Surprise", state: "AZ", slug: "surprise-az", lat: 33.6292, lng: -112.3679, timezone: "America/Denver" },
  // ARKANSAS
  { name: "Little Rock", state: "AR", slug: "little-rock-ar", lat: 34.7465, lng: -92.2896, timezone: "America/Chicago" },
  { name: "Fort Smith", state: "AR", slug: "fort-smith-ar", lat: 35.3859, lng: -94.3985, timezone: "America/Chicago" },
  { name: "Fayetteville", state: "AR", slug: "fayetteville-ar", lat: 36.0626, lng: -94.1574, timezone: "America/Chicago" },
  { name: "Springdale", state: "AR", slug: "springdale-ar", lat: 36.1867, lng: -94.1288, timezone: "America/Chicago" },
  { name: "Jonesboro", state: "AR", slug: "jonesboro-ar", lat: 35.8423, lng: -90.7043, timezone: "America/Chicago" },
  { name: "North Little Rock", state: "AR", slug: "north-little-rock-ar", lat: 34.7695, lng: -92.2671, timezone: "America/Chicago" },
  { name: "Conway", state: "AR", slug: "conway-ar", lat: 35.0887, lng: -92.4421, timezone: "America/Chicago" },
  { name: "Rogers", state: "AR", slug: "rogers-ar", lat: 36.3351, lng: -94.1185, timezone: "America/Chicago" },
  { name: "Pine Bluff", state: "AR", slug: "pine-bluff-ar", lat: 34.2285, lng: -92.0032, timezone: "America/Chicago" },
  { name: "Bentonville", state: "AR", slug: "bentonville-ar", lat: 36.3726, lng: -94.2088, timezone: "America/Chicago" },
  // CALIFORNIA
  { name: "Los Angeles", state: "CA", slug: "los-angeles-ca", lat: 34.0522, lng: -118.2437, timezone: "America/Los_Angeles" },
  { name: "San Diego", state: "CA", slug: "san-diego-ca", lat: 32.7157, lng: -117.1611, timezone: "America/Los_Angeles" },
  { name: "San Jose", state: "CA", slug: "san-jose-ca", lat: 37.3382, lng: -121.8863, timezone: "America/Los_Angeles" },
  { name: "San Francisco", state: "CA", slug: "san-francisco-ca", lat: 37.7749, lng: -122.4194, timezone: "America/Los_Angeles" },
  { name: "Fresno", state: "CA", slug: "fresno-ca", lat: 36.7378, lng: -119.7871, timezone: "America/Los_Angeles" },
  { name: "Sacramento", state: "CA", slug: "sacramento-ca", lat: 38.5816, lng: -121.4944, timezone: "America/Los_Angeles" },
  { name: "Long Beach", state: "CA", slug: "long-beach-ca", lat: 33.7701, lng: -118.1937, timezone: "America/Los_Angeles" },
  { name: "Oakland", state: "CA", slug: "oakland-ca", lat: 37.8044, lng: -122.2712, timezone: "America/Los_Angeles" },
  { name: "Bakersfield", state: "CA", slug: "bakersfield-ca", lat: 35.3733, lng: -119.0187, timezone: "America/Los_Angeles" },
  { name: "Anaheim", state: "CA", slug: "anaheim-ca", lat: 33.8366, lng: -117.9143, timezone: "America/Los_Angeles" },
  // COLORADO
  { name: "Denver", state: "CO", slug: "denver-co", lat: 39.7392, lng: -104.9903, timezone: "America/Denver" },
  { name: "Colorado Springs", state: "CO", slug: "colorado-springs-co", lat: 38.8339, lng: -104.8214, timezone: "America/Denver" },
  { name: "Aurora", state: "CO", slug: "aurora-co", lat: 39.7294, lng: -104.8319, timezone: "America/Denver" },
  { name: "Fort Collins", state: "CO", slug: "fort-collins-co", lat: 40.5853, lng: -105.0844, timezone: "America/Denver" },
  { name: "Lakewood", state: "CO", slug: "lakewood-co", lat: 39.7047, lng: -105.0814, timezone: "America/Denver" },
  { name: "Thornton", state: "CO", slug: "thornton-co", lat: 39.8680, lng: -104.9719, timezone: "America/Denver" },
  { name: "Arvada", state: "CO", slug: "arvada-co", lat: 39.8028, lng: -105.0875, timezone: "America/Denver" },
  { name: "Westminster", state: "CO", slug: "westminster-co", lat: 39.8367, lng: -105.0372, timezone: "America/Denver" },
  { name: "Boulder", state: "CO", slug: "boulder-co", lat: 40.0150, lng: -105.2705, timezone: "America/Denver" },
  { name: "Centennial", state: "CO", slug: "centennial-co", lat: 39.5791, lng: -104.8769, timezone: "America/Denver" },
  // CONNECTICUT
  { name: "Bridgeport", state: "CT", slug: "bridgeport-ct", lat: 41.1865, lng: -73.1952, timezone: "America/New_York" },
  { name: "New Haven", state: "CT", slug: "new-haven-ct", lat: 41.3083, lng: -72.9279, timezone: "America/New_York" },
  { name: "Stamford", state: "CT", slug: "stamford-ct", lat: 41.0534, lng: -73.5387, timezone: "America/New_York" },
  { name: "Hartford", state: "CT", slug: "hartford-ct", lat: 41.7658, lng: -72.6734, timezone: "America/New_York" },
  { name: "Waterbury", state: "CT", slug: "waterbury-ct", lat: 41.5582, lng: -73.0515, timezone: "America/New_York" },
  { name: "Norwalk", state: "CT", slug: "norwalk-ct", lat: 41.1176, lng: -73.4082, timezone: "America/New_York" },
  { name: "Danbury", state: "CT", slug: "danbury-ct", lat: 41.3948, lng: -73.4540, timezone: "America/New_York" },
  { name: "New Britain", state: "CT", slug: "new-britain-ct", lat: 41.6612, lng: -72.7795, timezone: "America/New_York" },
  { name: "Meriden", state: "CT", slug: "meriden-ct", lat: 41.5382, lng: -72.7998, timezone: "America/New_York" },
  { name: "Bristol", state: "CT", slug: "bristol-ct", lat: 41.6771, lng: -72.9493, timezone: "America/New_York" },
  // DELAWARE
  { name: "Wilmington", state: "DE", slug: "wilmington-de", lat: 39.7391, lng: -75.5398, timezone: "America/New_York" },
  { name: "Dover", state: "DE", slug: "dover-de", lat: 39.1582, lng: -75.5244, timezone: "America/New_York" },
  { name: "Newark", state: "DE", slug: "newark-de", lat: 39.6837, lng: -75.7497, timezone: "America/New_York" },
  { name: "Middletown", state: "DE", slug: "middletown-de", lat: 39.4443, lng: -75.7133, timezone: "America/New_York" },
  { name: "Smyrna", state: "DE", slug: "smyrna-de", lat: 39.2998, lng: -75.6055, timezone: "America/New_York" },
  { name: "Milford", state: "DE", slug: "milford-de", lat: 38.9126, lng: -75.4275, timezone: "America/New_York" },
  { name: "Seaford", state: "DE", slug: "seaford-de", lat: 38.6412, lng: -75.6110, timezone: "America/New_York" },
  { name: "Georgetown", state: "DE", slug: "georgetown-de", lat: 38.6901, lng: -75.3855, timezone: "America/New_York" },
  { name: "Elsmere", state: "DE", slug: "elsmere-de", lat: 39.7376, lng: -75.6127, timezone: "America/New_York" },
  { name: "New Castle", state: "DE", slug: "new-castle-de", lat: 39.6615, lng: -75.5656, timezone: "America/New_York" },
  // DISTRICT OF COLUMBIA
  { name: "Washington", state: "DC", slug: "washington-dc", lat: 38.9072, lng: -77.0369, timezone: "America/New_York" },
  // FLORIDA
  { name: "Jacksonville", state: "FL", slug: "jacksonville-fl", lat: 30.3322, lng: -81.6557, timezone: "America/New_York" },
  { name: "Miami", state: "FL", slug: "miami-fl", lat: 25.7617, lng: -80.1918, timezone: "America/New_York" },
  { name: "Tampa", state: "FL", slug: "tampa-fl", lat: 27.9506, lng: -82.4572, timezone: "America/New_York" },
  { name: "Orlando", state: "FL", slug: "orlando-fl", lat: 28.5383, lng: -81.3792, timezone: "America/New_York" },
  { name: "St. Petersburg", state: "FL", slug: "st-petersburg-fl", lat: 27.7676, lng: -82.6403, timezone: "America/New_York" },
  { name: "Hialeah", state: "FL", slug: "hialeah-fl", lat: 25.8576, lng: -80.2781, timezone: "America/New_York" },
  { name: "Tallahassee", state: "FL", slug: "tallahassee-fl", lat: 30.4383, lng: -84.2807, timezone: "America/New_York" },
  { name: "Fort Lauderdale", state: "FL", slug: "fort-lauderdale-fl", lat: 26.1224, lng: -80.1373, timezone: "America/New_York" },
  { name: "Cape Coral", state: "FL", slug: "cape-coral-fl", lat: 26.5629, lng: -81.9495, timezone: "America/New_York" },
  { name: "Pembroke Pines", state: "FL", slug: "pembroke-pines-fl", lat: 26.0131, lng: -80.3487, timezone: "America/New_York" },
  // GEORGIA
  { name: "Atlanta", state: "GA", slug: "atlanta-ga", lat: 33.7490, lng: -84.3880, timezone: "America/New_York" },
  { name: "Augusta", state: "GA", slug: "augusta-ga", lat: 33.4735, lng: -82.0105, timezone: "America/New_York" },
  { name: "Columbus", state: "GA", slug: "columbus-ga", lat: 32.4610, lng: -84.9877, timezone: "America/New_York" },
  { name: "Macon", state: "GA", slug: "macon-ga", lat: 32.8407, lng: -83.6324, timezone: "America/New_York" },
  { name: "Savannah", state: "GA", slug: "savannah-ga", lat: 32.0809, lng: -81.0912, timezone: "America/New_York" },
  { name: "Athens", state: "GA", slug: "athens-ga", lat: 33.9519, lng: -83.3576, timezone: "America/New_York" },
  { name: "Sandy Springs", state: "GA", slug: "sandy-springs-ga", lat: 33.9304, lng: -84.3733, timezone: "America/New_York" },
  { name: "Roswell", state: "GA", slug: "roswell-ga", lat: 34.0234, lng: -84.3616, timezone: "America/New_York" },
  { name: "Warner Robins", state: "GA", slug: "warner-robins-ga", lat: 32.6130, lng: -83.5999, timezone: "America/New_York" },
  { name: "Alpharetta", state: "GA", slug: "alpharetta-ga", lat: 34.0754, lng: -84.2941, timezone: "America/New_York" },
  // HAWAII
  { name: "Honolulu", state: "HI", slug: "honolulu-hi", lat: 21.3069, lng: -157.8583, timezone: "Pacific/Honolulu" },
  { name: "Pearl City", state: "HI", slug: "pearl-city-hi", lat: 21.3934, lng: -157.9741, timezone: "Pacific/Honolulu" },
  { name: "Hilo", state: "HI", slug: "hilo-hi", lat: 19.7297, lng: -155.0900, timezone: "Pacific/Honolulu" },
  { name: "Kailua", state: "HI", slug: "kailua-hi", lat: 21.4022, lng: -157.7394, timezone: "Pacific/Honolulu" },
  { name: "Waipahu", state: "HI", slug: "waipahu-hi", lat: 21.3869, lng: -158.0172, timezone: "Pacific/Honolulu" },
  { name: "Kaneohe", state: "HI", slug: "kaneohe-hi", lat: 21.4181, lng: -157.7964, timezone: "Pacific/Honolulu" },
  { name: "Mililani", state: "HI", slug: "mililani-hi", lat: 21.4500, lng: -158.0147, timezone: "Pacific/Honolulu" },
  { name: "Kahului", state: "HI", slug: "kahului-hi", lat: 20.8894, lng: -156.4729, timezone: "Pacific/Honolulu" },
  { name: "Ewa Beach", state: "HI", slug: "ewa-beach-hi", lat: 21.3156, lng: -158.0072, timezone: "Pacific/Honolulu" },
  { name: "Kihei", state: "HI", slug: "kihei-hi", lat: 20.7644, lng: -156.4450, timezone: "Pacific/Honolulu" },
  // IDAHO
  { name: "Boise", state: "ID", slug: "boise-id", lat: 43.6150, lng: -116.2023, timezone: "America/Boise" },
  { name: "Meridian", state: "ID", slug: "meridian-id", lat: 43.6121, lng: -116.3915, timezone: "America/Boise" },
  { name: "Nampa", state: "ID", slug: "nampa-id", lat: 43.5407, lng: -116.5635, timezone: "America/Boise" },
  { name: "Idaho Falls", state: "ID", slug: "idaho-falls-id", lat: 43.4917, lng: -112.0405, timezone: "America/Boise" },
  { name: "Pocatello", state: "ID", slug: "pocatello-id", lat: 42.8713, lng: -112.4453, timezone: "America/Boise" },
  { name: "Caldwell", state: "ID", slug: "caldwell-id", lat: 43.6454, lng: -116.6887, timezone: "America/Boise" },
  { name: "Coeur d'Alene", state: "ID", slug: "coeur-dalene-id", lat: 47.6777, lng: -116.7805, timezone: "America/Los_Angeles" },
  { name: "Twin Falls", state: "ID", slug: "twin-falls-id", lat: 42.5558, lng: -114.4701, timezone: "America/Boise" },
  { name: "Lewiston", state: "ID", slug: "lewiston-id", lat: 46.4163, lng: -117.0173, timezone: "America/Los_Angeles" },
  { name: "Rexburg", state: "ID", slug: "rexburg-id", lat: 43.8261, lng: -111.7896, timezone: "America/Boise" },
  // ILLINOIS
  { name: "Chicago", state: "IL", slug: "chicago-il", lat: 41.8781, lng: -87.6298, timezone: "America/Chicago" },
  { name: "Aurora", state: "IL", slug: "aurora-il", lat: 41.7606, lng: -88.3201, timezone: "America/Chicago" },
  { name: "Joliet", state: "IL", slug: "joliet-il", lat: 41.5250, lng: -88.0834, timezone: "America/Chicago" },
  { name: "Naperville", state: "IL", slug: "naperville-il", lat: 41.7508, lng: -88.1535, timezone: "America/Chicago" },
  { name: "Rockford", state: "IL", slug: "rockford-il", lat: 42.2711, lng: -89.0940, timezone: "America/Chicago" },
  { name: "Elgin", state: "IL", slug: "elgin-il", lat: 42.0372, lng: -88.2812, timezone: "America/Chicago" },
  { name: "Springfield", state: "IL", slug: "springfield-il", lat: 39.7817, lng: -89.6501, timezone: "America/Chicago" },
  { name: "Peoria", state: "IL", slug: "peoria-il", lat: 40.6937, lng: -89.5890, timezone: "America/Chicago" },
  { name: "Champaign", state: "IL", slug: "champaign-il", lat: 40.1164, lng: -88.2434, timezone: "America/Chicago" },
  { name: "Cicero", state: "IL", slug: "cicero-il", lat: 41.8456, lng: -87.7539, timezone: "America/Chicago" },
  // INDIANA
  { name: "Indianapolis", state: "IN", slug: "indianapolis-in", lat: 39.7684, lng: -86.1581, timezone: "America/Indiana/Indianapolis" },
  { name: "Fort Wayne", state: "IN", slug: "fort-wayne-in", lat: 41.0793, lng: -85.1394, timezone: "America/Indiana/Indianapolis" },
  { name: "Evansville", state: "IN", slug: "evansville-in", lat: 37.9716, lng: -87.5711, timezone: "America/Chicago" },
  { name: "South Bend", state: "IN", slug: "south-bend-in", lat: 41.6764, lng: -86.2520, timezone: "America/Indiana/Indianapolis" },
  { name: "Carmel", state: "IN", slug: "carmel-in", lat: 39.9784, lng: -86.1180, timezone: "America/Indiana/Indianapolis" },
  { name: "Fishers", state: "IN", slug: "fishers-in", lat: 39.9568, lng: -86.0131, timezone: "America/Indiana/Indianapolis" },
  { name: "Bloomington", state: "IN", slug: "bloomington-in", lat: 39.1653, lng: -86.5264, timezone: "America/Indiana/Indianapolis" },
  { name: "Hammond", state: "IN", slug: "hammond-in", lat: 41.5834, lng: -87.5001, timezone: "America/Chicago" },
  { name: "Lafayette", state: "IN", slug: "lafayette-in", lat: 40.4167, lng: -86.8753, timezone: "America/Indiana/Indianapolis" },
  { name: "Terre Haute", state: "IN", slug: "terre-haute-in", lat: 39.4667, lng: -87.4139, timezone: "America/Indiana/Indianapolis" },
  // IOWA
  { name: "Des Moines", state: "IA", slug: "des-moines-ia", lat: 41.5868, lng: -93.6250, timezone: "America/Chicago" },
  { name: "Cedar Rapids", state: "IA", slug: "cedar-rapids-ia", lat: 41.9779, lng: -91.6656, timezone: "America/Chicago" },
  { name: "Davenport", state: "IA", slug: "davenport-ia", lat: 41.5236, lng: -90.5776, timezone: "America/Chicago" },
  { name: "Des Moines metro", state: "IA", slug: "des-moines-metro-ia", lat: 41.5236, lng: -93.6250, timezone: "America/Chicago" },
  { name: "Waterloo", state: "IA", slug: "waterloo-ia", lat: 42.4920, lng: -92.3421, timezone: "America/Chicago" },
  { name: "Ames", state: "IA", slug: "ames-ia", lat: 42.0308, lng: -93.6319, timezone: "America/Chicago" },
  { name: "West Des Moines", state: "IA", slug: "west-des-moines-ia", lat: 41.5772, lng: -93.7113, timezone: "America/Chicago" },
  { name: "Dubuque", state: "IA", slug: "dubuque-ia", lat: 42.4734, lng: -90.6665, timezone: "America/Chicago" },
  { name: "Ankeny", state: "IA", slug: "ankeny-ia", lat: 41.7297, lng: -93.6007, timezone: "America/Chicago" },
  { name: "Urbandale", state: "IA", slug: "urbandale-ia", lat: 41.6266, lng: -93.7808, timezone: "America/Chicago" },
  // KANSAS
  { name: "Wichita", state: "KS", slug: "wichita-ks", lat: 37.6872, lng: -97.3301, timezone: "America/Chicago" },
  { name: "Overland Park", state: "KS", slug: "overland-park-ks", lat: 38.9822, lng: -94.6708, timezone: "America/Chicago" },
  { name: "Kansas City", state: "KS", slug: "kansas-city-ks", lat: 39.1067, lng: -94.6963, timezone: "America/Chicago" },
  { name: "Olathe", state: "KS", slug: "olathe-ks", lat: 38.8814, lng: -94.8171, timezone: "America/Chicago" },
  { name: "Topeka", state: "KS", slug: "topeka-ks", lat: 39.0473, lng: -95.6752, timezone: "America/Chicago" },
  { name: "Lawrence", state: "KS", slug: "lawrence-ks", lat: 38.9717, lng: -95.2353, timezone: "America/Chicago" },
  { name: "Shawnee", state: "KS", slug: "shawnee-ks", lat: 39.0228, lng: -94.8144, timezone: "America/Chicago" },
  { name: "Salina", state: "KS", slug: "salina-ks", lat: 38.7851, lng: -97.6081, timezone: "America/Chicago" },
  { name: "Lenexa", state: "KS", slug: "lenexa-ks", lat: 38.9536, lng: -94.7336, timezone: "America/Chicago" },
  { name: "Manhattan", state: "KS", slug: "manhattan-ks", lat: 39.1836, lng: -96.5717, timezone: "America/Chicago" },
  // KENTUCKY
  { name: "Louisville", state: "KY", slug: "louisville-ky", lat: 38.2527, lng: -85.7585, timezone: "America/New_York" },
  { name: "Lexington", state: "KY", slug: "lexington-ky", lat: 38.0406, lng: -84.5037, timezone: "America/New_York" },
  { name: "Bowling Green", state: "KY", slug: "bowling-green-ky", lat: 36.9903, lng: -86.4436, timezone: "America/Chicago" },
  { name: "Covington", state: "KY", slug: "covington-ky", lat: 39.0839, lng: -84.5100, timezone: "America/New_York" },
  { name: "Richmond", state: "KY", slug: "richmond-ky", lat: 37.7478, lng: -84.2944, timezone: "America/New_York" },
  { name: "Georgetown", state: "KY", slug: "georgetown-ky", lat: 38.2095, lng: -84.5588, timezone: "America/New_York" },
  { name: "Florence", state: "KY", slug: "florence-ky", lat: 38.9989, lng: -84.6266, timezone: "America/New_York" },
  { name: "Hopkinsville", state: "KY", slug: "hopkinsville-ky", lat: 36.8656, lng: -87.4886, timezone: "America/Chicago" },
  { name: "Nicholasville", state: "KY", slug: "nicholasville-ky", lat: 37.8809, lng: -84.5725, timezone: "America/New_York" },
  { name: "Frankfort", state: "KY", slug: "frankfort-ky", lat: 38.2009, lng: -84.8733, timezone: "America/New_York" },
  // LOUISIANA
  { name: "New Orleans", state: "LA", slug: "new-orleans-la", lat: 29.9511, lng: -90.0715, timezone: "America/Chicago" },
  { name: "Baton Rouge", state: "LA", slug: "baton-rouge-la", lat: 30.4515, lng: -91.1871, timezone: "America/Chicago" },
  { name: "Shreveport", state: "LA", slug: "shreveport-la", lat: 32.5252, lng: -93.7502, timezone: "America/Chicago" },
  { name: "Metairie", state: "LA", slug: "metairie-la", lat: 29.9840, lng: -90.1528, timezone: "America/Chicago" },
  { name: "Lafayette", state: "LA", slug: "lafayette-la", lat: 30.2241, lng: -92.0198, timezone: "America/Chicago" },
  { name: "Lake Charles", state: "LA", slug: "lake-charles-la", lat: 30.2266, lng: -93.2174, timezone: "America/Chicago" },
  { name: "Bossier City", state: "LA", slug: "bossier-city-la", lat: 32.5157, lng: -93.6643, timezone: "America/Chicago" },
  { name: "Monroe", state: "LA", slug: "monroe-la", lat: 32.5093, lng: -92.1193, timezone: "America/Chicago" },
  { name: "Alexandria", state: "LA", slug: "alexandria-la", lat: 31.3113, lng: -92.4456, timezone: "America/Chicago" },
  { name: "Houma", state: "LA", slug: "houma-la", lat: 29.5958, lng: -90.7195, timezone: "America/Chicago" },
  // MAINE
  { name: "Portland", state: "ME", slug: "portland-me", lat: 43.6591, lng: -70.2568, timezone: "America/New_York" },
  { name: "Lewiston", state: "ME", slug: "lewiston-me", lat: 44.1004, lng: -70.2148, timezone: "America/New_York" },
  { name: "Bangor", state: "ME", slug: "bangor-me", lat: 44.8012, lng: -68.7778, timezone: "America/New_York" },
  { name: "South Portland", state: "ME", slug: "south-portland-me", lat: 43.6390, lng: -70.2462, timezone: "America/New_York" },
  { name: "Saco", state: "ME", slug: "saco-me", lat: 43.5034, lng: -70.4648, timezone: "America/New_York" },
  { name: "Westbrook", state: "ME", slug: "westbrook-me", lat: 43.6771, lng: -70.3712, timezone: "America/New_York" },
  { name: "Augusta", state: "ME", slug: "augusta-me", lat: 44.3106, lng: -69.7795, timezone: "America/New_York" },
  { name: "Biddeford", state: "ME", slug: "biddeford-me", lat: 43.4926, lng: -70.4548, timezone: "America/New_York" },
  { name: "Sanford", state: "ME", slug: "sanford-me", lat: 43.4387, lng: -70.7837, timezone: "America/New_York" },
  { name: "Brunswick", state: "ME", slug: "brunswick-me", lat: 43.9146, lng: -69.9654, timezone: "America/New_York" },
  // MARYLAND
  { name: "Baltimore", state: "MD", slug: "baltimore-md", lat: 39.2904, lng: -76.6122, timezone: "America/New_York" },
  { name: "Frederick", state: "MD", slug: "frederick-md", lat: 39.4143, lng: -77.4105, timezone: "America/New_York" },
  { name: "Rockville", state: "MD", slug: "rockville-md", lat: 39.0840, lng: -77.1528, timezone: "America/New_York" },
  { name: "Gaithersburg", state: "MD", slug: "gaithersburg-md", lat: 39.1434, lng: -77.2014, timezone: "America/New_York" },
  { name: "Bowie", state: "MD", slug: "bowie-md", lat: 38.9427, lng: -76.7301, timezone: "America/New_York" },
  { name: "Hagerstown", state: "MD", slug: "hagerstown-md", lat: 39.6418, lng: -77.7200, timezone: "America/New_York" },
  { name: "Annapolis", state: "MD", slug: "annapolis-md", lat: 38.9784, lng: -76.4922, timezone: "America/New_York" },
  { name: "College Park", state: "MD", slug: "college-park-md", lat: 38.9897, lng: -76.9426, timezone: "America/New_York" },
  { name: "Salisbury", state: "MD", slug: "salisbury-md", lat: 38.3607, lng: -75.5994, timezone: "America/New_York" },
  { name: "Laurel", state: "MD", slug: "laurel-md", lat: 39.0987, lng: -76.8626, timezone: "America/New_York" },
  // MASSACHUSETTS
  { name: "Boston", state: "MA", slug: "boston-ma", lat: 42.3601, lng: -71.0589, timezone: "America/New_York" },
  { name: "Worcester", state: "MA", slug: "worcester-ma", lat: 42.2626, lng: -71.8023, timezone: "America/New_York" },
  { name: "Springfield", state: "MA", slug: "springfield-ma", lat: 42.1015, lng: -72.5898, timezone: "America/New_York" },
  { name: "Cambridge", state: "MA", slug: "cambridge-ma", lat: 42.3736, lng: -71.1097, timezone: "America/New_York" },
  { name: "Lowell", state: "MA", slug: "lowell-ma", lat: 42.6334, lng: -71.3162, timezone: "America/New_York" },
  { name: "Brockton", state: "MA", slug: "brockton-ma", lat: 42.0834, lng: -71.0183, timezone: "America/New_York" },
  { name: "Quincy", state: "MA", slug: "quincy-ma", lat: 42.2529, lng: -71.0023, timezone: "America/New_York" },
  { name: "Lynn", state: "MA", slug: "lynn-ma", lat: 42.4668, lng: -70.9495, timezone: "America/New_York" },
  { name: "New Bedford", state: "MA", slug: "new-bedford-ma", lat: 41.6363, lng: -70.9348, timezone: "America/New_York" },
  { name: "Somerville", state: "MA", slug: "somerville-ma", lat: 42.3876, lng: -71.0995, timezone: "America/New_York" },
  // MICHIGAN
  { name: "Detroit", state: "MI", slug: "detroit-mi", lat: 42.3314, lng: -83.0458, timezone: "America/New_York" },
  { name: "Grand Rapids", state: "MI", slug: "grand-rapids-mi", lat: 42.9634, lng: -85.6681, timezone: "America/New_York" },
  { name: "Warren", state: "MI", slug: "warren-mi", lat: 42.4776, lng: -83.0277, timezone: "America/New_York" },
  { name: "Sterling Heights", state: "MI", slug: "sterling-heights-mi", lat: 42.5803, lng: -83.0302, timezone: "America/New_York" },
  { name: "Lansing", state: "MI", slug: "lansing-mi", lat: 42.7325, lng: -84.5555, timezone: "America/New_York" },
  { name: "Ann Arbor", state: "MI", slug: "ann-arbor-mi", lat: 42.2808, lng: -83.7430, timezone: "America/New_York" },
  { name: "Flint", state: "MI", slug: "flint-mi", lat: 43.0125, lng: -83.6875, timezone: "America/New_York" },
  { name: "Dearborn", state: "MI", slug: "dearborn-mi", lat: 42.3223, lng: -83.1763, timezone: "America/New_York" },
  { name: "Livonia", state: "MI", slug: "livonia-mi", lat: 42.3684, lng: -83.3527, timezone: "America/New_York" },
  { name: "Westland", state: "MI", slug: "westland-mi", lat: 42.3242, lng: -83.4002, timezone: "America/New_York" },
  // MINNESOTA
  { name: "Minneapolis", state: "MN", slug: "minneapolis-mn", lat: 44.9778, lng: -93.2650, timezone: "America/Chicago" },
  { name: "Saint Paul", state: "MN", slug: "saint-paul-mn", lat: 44.9537, lng: -93.0900, timezone: "America/Chicago" },
  { name: "Bloomington", state: "MN", slug: "bloomington-mn", lat: 44.8408, lng: -93.2983, timezone: "America/Chicago" },
  { name: "Brooklyn Park", state: "MN", slug: "brooklyn-park-mn", lat: 45.0724, lng: -93.3586, timezone: "America/Chicago" },
  { name: "Plymouth", state: "MN", slug: "plymouth-mn", lat: 45.0105, lng: -93.4555, timezone: "America/Chicago" },
  { name: "Lakeville", state: "MN", slug: "lakeville-mn", lat: 44.6477, lng: -93.2430, timezone: "America/Chicago" },
  { name: "Blaine", state: "MN", slug: "blaine-mn", lat: 45.1608, lng: -93.2349, timezone: "America/Chicago" },
  { name: "Woodbury", state: "MN", slug: "woodbury-mn", lat: 44.9236, lng: -92.9594, timezone: "America/Chicago" },
  { name: "Eagan", state: "MN", slug: "eagan-mn", lat: 44.8041, lng: -93.1661, timezone: "America/Chicago" },
  { name: "Maple Grove", state: "MN", slug: "maple-grove-mn", lat: 45.0724, lng: -93.4551, timezone: "America/Chicago" },
  // MISSISSIPPI
  { name: "Jackson", state: "MS", slug: "jackson-ms", lat: 32.2988, lng: -90.1848, timezone: "America/Chicago" },
  { name: "Gulfport", state: "MS", slug: "gulfport-ms", lat: 30.3674, lng: -89.0928, timezone: "America/Chicago" },
  { name: "Southaven", state: "MS", slug: "southaven-ms", lat: 34.9690, lng: -89.9890, timezone: "America/Chicago" },
  { name: "Hattiesburg", state: "MS", slug: "hattiesburg-ms", lat: 31.3271, lng: -89.2903, timezone: "America/Chicago" },
  { name: "Biloxi", state: "MS", slug: "biloxi-ms", lat: 30.4111, lng: -88.8878, timezone: "America/Chicago" },
  { name: "Meridian", state: "MS", slug: "meridian-ms", lat: 32.3643, lng: -88.7037, timezone: "America/Chicago" },
  { name: "Tupelo", state: "MS", slug: "tupelo-ms", lat: 34.2576, lng: -88.7034, timezone: "America/Chicago" },
  { name: "Olive Branch", state: "MS", slug: "olive-branch-ms", lat: 34.9617, lng: -89.8295, timezone: "America/Chicago" },
  { name: "Pearl", state: "MS", slug: "pearl-ms", lat: 32.2745, lng: -90.1318, timezone: "America/Chicago" },
  { name: "Madison", state: "MS", slug: "madison-ms", lat: 32.4635, lng: -90.1168, timezone: "America/Chicago" },
  // MISSOURI
  { name: "Kansas City", state: "MO", slug: "kansas-city-mo", lat: 39.0997, lng: -94.5786, timezone: "America/Chicago" },
  { name: "St. Louis", state: "MO", slug: "st-louis-mo", lat: 38.6270, lng: -90.1994, timezone: "America/Chicago" },
  { name: "Springfield", state: "MO", slug: "springfield-mo", lat: 37.2090, lng: -93.2923, timezone: "America/Chicago" },
  { name: "Columbia", state: "MO", slug: "columbia-mo", lat: 38.9517, lng: -92.3341, timezone: "America/Chicago" },
  { name: "Independence", state: "MO", slug: "independence-mo", lat: 39.0911, lng: -94.4155, timezone: "America/Chicago" },
  { name: "Lee's Summit", state: "MO", slug: "lees-summit-mo", lat: 38.9108, lng: -94.3822, timezone: "America/Chicago" },
  { name: "O'Fallon", state: "MO", slug: "ofallon-mo", lat: 38.7695, lng: -90.7079, timezone: "America/Chicago" },
  { name: "St. Joseph", state: "MO", slug: "st-joseph-mo", lat: 39.7681, lng: -94.8450, timezone: "America/Chicago" },
  { name: "Blue Springs", state: "MO", slug: "blue-springs-mo", lat: 39.0120, lng: -94.2722, timezone: "America/Chicago" },
  { name: "Joplin", state: "MO", slug: "joplin-mo", lat: 37.0842, lng: -94.5133, timezone: "America/Chicago" },
  // MONTANA
  { name: "Billings", state: "MT", slug: "billings-mt", lat: 45.7833, lng: -108.5007, timezone: "America/Denver" },
  { name: "Missoula", state: "MT", slug: "missoula-mt", lat: 46.8701, lng: -113.9940, timezone: "America/Denver" },
  { name: "Great Falls", state: "MT", slug: "great-falls-mt", lat: 47.5053, lng: -111.2861, timezone: "America/Denver" },
  { name: "Bozeman", state: "MT", slug: "bozeman-mt", lat: 45.6770, lng: -111.0429, timezone: "America/Denver" },
  { name: "Butte", state: "MT", slug: "butte-mt", lat: 46.0132, lng: -112.5348, timezone: "America/Denver" },
  { name: "Helena", state: "MT", slug: "helena-mt", lat: 46.5884, lng: -112.0245, timezone: "America/Denver" },
  { name: "Kalispell", state: "MT", slug: "kalispell-mt", lat: 48.1960, lng: -114.3154, timezone: "America/Denver" },
  { name: "Belgrade", state: "MT", slug: "belgrade-mt", lat: 45.7769, lng: -111.1768, timezone: "America/Denver" },
  { name: "Havre", state: "MT", slug: "havre-mt", lat: 48.5486, lng: -109.6841, timezone: "America/Denver" },
  { name: "Helena Valley", state: "MT", slug: "helena-valley-mt", lat: 46.6252, lng: -112.0392, timezone: "America/Denver" },
  // NEBRASKA
  { name: "Omaha", state: "NE", slug: "omaha-ne", lat: 41.2565, lng: -95.9345, timezone: "America/Chicago" },
  { name: "Lincoln", state: "NE", slug: "lincoln-ne", lat: 40.8136, lng: -96.7026, timezone: "America/Chicago" },
  { name: "Grand Island", state: "NE", slug: "grand-island-ne", lat: 40.9264, lng: -98.3420, timezone: "America/Chicago" },
  { name: "Kearney", state: "NE", slug: "kearney-ne", lat: 40.6993, lng: -99.0817, timezone: "America/Chicago" },
  { name: "Bellevue", state: "NE", slug: "bellevue-ne", lat: 41.1509, lng: -95.9940, timezone: "America/Chicago" },
  { name: "Fremont", state: "NE", slug: "fremont-ne", lat: 41.4335, lng: -96.4978, timezone: "America/Chicago" },
  { name: "Hastings", state: "NE", slug: "hastings-ne", lat: 40.5861, lng: -98.3886, timezone: "America/Chicago" },
  { name: "North Platte", state: "NE", slug: "north-platte-ne", lat: 41.1403, lng: -100.6832, timezone: "America/Chicago" },
  { name: "Columbus", state: "NE", slug: "columbus-ne", lat: 41.4289, lng: -97.3628, timezone: "America/Chicago" },
  { name: "Papillion", state: "NE", slug: "papillion-ne", lat: 41.1514, lng: -96.0418, timezone: "America/Chicago" },
  // NEVADA
  { name: "Las Vegas", state: "NV", slug: "las-vegas-nv", lat: 36.1699, lng: -115.1398, timezone: "America/Los_Angeles" },
  { name: "Henderson", state: "NV", slug: "henderson-nv", lat: 36.0395, lng: -114.9817, timezone: "America/Los_Angeles" },
  { name: "Reno", state: "NV", slug: "reno-nv", lat: 39.5296, lng: -119.8138, timezone: "America/Los_Angeles" },
  { name: "North Las Vegas", state: "NV", slug: "north-las-vegas-nv", lat: 36.1989, lng: -115.1175, timezone: "America/Los_Angeles" },
  { name: "Sparks", state: "NV", slug: "sparks-nv", lat: 39.5349, lng: -119.7527, timezone: "America/Los_Angeles" },
  { name: "Carson City", state: "NV", slug: "carson-city-nv", lat: 39.1638, lng: -119.7661, timezone: "America/Los_Angeles" },
  { name: "Mesquite", state: "NV", slug: "mesquite-nv", lat: 36.8055, lng: -114.0675, timezone: "America/Los_Angeles" },
  { name: "Elko", state: "NV", slug: "elko-nv", lat: 40.8324, lng: -115.7631, timezone: "America/Los_Angeles" },
  { name: "Boulder City", state: "NV", slug: "boulder-city-nv", lat: 35.9783, lng: -114.8291, timezone: "America/Los_Angeles" },
  { name: "Spring Valley", state: "NV", slug: "spring-valley-nv", lat: 36.0916, lng: -115.2659, timezone: "America/Los_Angeles" },
  // NEW HAMPSHIRE
  { name: "Manchester", state: "NH", slug: "manchester-nh", lat: 42.9956, lng: -71.4548, timezone: "America/New_York" },
  { name: "Nashua", state: "NH", slug: "nashua-nh", lat: 42.7654, lng: -71.4676, timezone: "America/New_York" },
  { name: "Concord", state: "NH", slug: "concord-nh", lat: 43.2081, lng: -71.5376, timezone: "America/New_York" },
  { name: "Derry", state: "NH", slug: "derry-nh", lat: 42.8893, lng: -71.3273, timezone: "America/New_York" },
  { name: "Rochester", state: "NH", slug: "rochester-nh", lat: 43.3045, lng: -70.9756, timezone: "America/New_York" },
  { name: "Salem", state: "NH", slug: "salem-nh", lat: 42.7885, lng: -71.2009, timezone: "America/New_York" },
  { name: "Keene", state: "NH", slug: "keene-nh", lat: 42.9337, lng: -72.2785, timezone: "America/New_York" },
  { name: "Laconia", state: "NH", slug: "laconia-nh", lat: 43.5278, lng: -71.4704, timezone: "America/New_York" },
  { name: "Milford", state: "NH", slug: "milford-nh", lat: 42.8354, lng: -71.6486, timezone: "America/New_York" },
  { name: "Exeter", state: "NH", slug: "exeter-nh", lat: 42.9812, lng: -70.9478, timezone: "America/New_York" },
  // NEW JERSEY
  { name: "Newark", state: "NJ", slug: "newark-nj", lat: 40.7357, lng: -74.1724, timezone: "America/New_York" },
  { name: "Jersey City", state: "NJ", slug: "jersey-city-nj", lat: 40.7178, lng: -74.0431, timezone: "America/New_York" },
  { name: "Paterson", state: "NJ", slug: "paterson-nj", lat: 40.9168, lng: -74.1718, timezone: "America/New_York" },
  { name: "Elizabeth", state: "NJ", slug: "elizabeth-nj", lat: 40.6640, lng: -74.2107, timezone: "America/New_York" },
  { name: "Woodbridge", state: "NJ", slug: "woodbridge-nj", lat: 40.5526, lng: -74.2824, timezone: "America/New_York" },
  { name: "Edison", state: "NJ", slug: "edison-nj", lat: 40.5187, lng: -74.4121, timezone: "America/New_York" },
  { name: "Toms River", state: "NJ", slug: "toms-river-nj", lat: 39.9537, lng: -74.1979, timezone: "America/New_York" },
  { name: "Clifton", state: "NJ", slug: "clifton-nj", lat: 40.8584, lng: -74.1638, timezone: "America/New_York" },
  { name: "Trenton", state: "NJ", slug: "trenton-nj", lat: 40.2206, lng: -74.7699, timezone: "America/New_York" },
  { name: "Camden", state: "NJ", slug: "camden-nj", lat: 39.9260, lng: -75.1196, timezone: "America/New_York" },
  // NEW MEXICO
  { name: "Albuquerque", state: "NM", slug: "albuquerque-nm", lat: 35.0844, lng: -106.6504, timezone: "America/Denver" },
  { name: "Las Cruces", state: "NM", slug: "las-cruces-nm", lat: 32.3199, lng: -106.7637, timezone: "America/Denver" },
  { name: "Santa Fe", state: "NM", slug: "santa-fe-nm", lat: 35.6870, lng: -105.9378, timezone: "America/Denver" },
  { name: "Rio Rancho", state: "NM", slug: "rio-rancho-nm", lat: 35.2328, lng: -106.6630, timezone: "America/Denver" },
  { name: "Roswell", state: "NM", slug: "roswell-nm", lat: 33.3942, lng: -104.5230, timezone: "America/Denver" },
  { name: "Farmington", state: "NM", slug: "farmington-nm", lat: 36.7281, lng: -108.2187, timezone: "America/Denver" },
  { name: "Clovis", state: "NM", slug: "clovis-nm", lat: 34.4048, lng: -103.2052, timezone: "America/Denver" },
  { name: "Hobbs", state: "NM", slug: "hobbs-nm", lat: 32.7010, lng: -103.1359, timezone: "America/Denver" },
  { name: "Alamogordo", state: "NM", slug: "alamogordo-nm", lat: 32.8995, lng: -105.9603, timezone: "America/Denver" },
  { name: "Carlsbad", state: "NM", slug: "carlsbad-nm", lat: 32.4207, lng: -104.2288, timezone: "America/Denver" },
  // NEW YORK
  { name: "New York", state: "NY", slug: "new-york-ny", lat: 40.7128, lng: -74.0060, timezone: "America/New_York" },
  { name: "Buffalo", state: "NY", slug: "buffalo-ny", lat: 42.8864, lng: -78.8784, timezone: "America/New_York" },
  { name: "Rochester", state: "NY", slug: "rochester-ny", lat: 43.1566, lng: -77.6088, timezone: "America/New_York" },
  { name: "Yonkers", state: "NY", slug: "yonkers-ny", lat: 40.9312, lng: -73.8987, timezone: "America/New_York" },
  { name: "Syracuse", state: "NY", slug: "syracuse-ny", lat: 43.0481, lng: -76.1474, timezone: "America/New_York" },
  { name: "Albany", state: "NY", slug: "albany-ny", lat: 42.6526, lng: -73.7562, timezone: "America/New_York" },
  { name: "New Rochelle", state: "NY", slug: "new-rochelle-ny", lat: 40.9115, lng: -73.7823, timezone: "America/New_York" },
  { name: "Mount Vernon", state: "NY", slug: "mount-vernon-ny", lat: 40.9126, lng: -73.8371, timezone: "America/New_York" },
  { name: "Schenectady", state: "NY", slug: "schenectady-ny", lat: 42.8142, lng: -73.9396, timezone: "America/New_York" },
  { name: "Utica", state: "NY", slug: "utica-ny", lat: 43.1009, lng: -75.2327, timezone: "America/New_York" },
  // NORTH CAROLINA
  { name: "Charlotte", state: "NC", slug: "charlotte-nc", lat: 35.2271, lng: -80.8431, timezone: "America/New_York" },
  { name: "Raleigh", state: "NC", slug: "raleigh-nc", lat: 35.7796, lng: -78.6382, timezone: "America/New_York" },
  { name: "Durham", state: "NC", slug: "durham-nc", lat: 35.9940, lng: -78.8986, timezone: "America/New_York" },
  { name: "Winston-Salem", state: "NC", slug: "winston-salem-nc", lat: 36.0999, lng: -80.2442, timezone: "America/New_York" },
  { name: "Fayetteville", state: "NC", slug: "fayetteville-nc", lat: 35.0527, lng: -78.8784, timezone: "America/New_York" },
  { name: "Cary", state: "NC", slug: "cary-nc", lat: 35.7693, lng: -78.7878, timezone: "America/New_York" },
  { name: "Wilmington", state: "NC", slug: "wilmington-nc", lat: 34.2257, lng: -77.9447, timezone: "America/New_York" },
  { name: "High Point", state: "NC", slug: "high-point-nc", lat: 35.9557, lng: -80.0053, timezone: "America/New_York" },
  { name: "Asheville", state: "NC", slug: "asheville-nc", lat: 35.5951, lng: -82.5515, timezone: "America/New_York" },
  { name: "Greensboro", state: "NC", slug: "greensboro-nc", lat: 36.0726, lng: -79.7920, timezone: "America/New_York" },
  // NORTH DAKOTA
  { name: "Fargo", state: "ND", slug: "fargo-nd", lat: 46.8772, lng: -96.7898, timezone: "America/Chicago" },
  { name: "Bismarck", state: "ND", slug: "bismarck-nd", lat: 46.8083, lng: -100.7837, timezone: "America/Chicago" },
  { name: "Grand Forks", state: "ND", slug: "grand-forks-nd", lat: 47.9253, lng: -97.0324, timezone: "America/Chicago" },
  { name: "Minot", state: "ND", slug: "minot-nd", lat: 48.2325, lng: -101.2963, timezone: "America/Chicago" },
  { name: "West Fargo", state: "ND", slug: "west-fargo-nd", lat: 46.8808, lng: -96.8982, timezone: "America/Chicago" },
  { name: "Williston", state: "ND", slug: "williston-nd", lat: 48.1470, lng: -103.6180, timezone: "America/Chicago" },
  { name: "Dickinson", state: "ND", slug: "dickinson-nd", lat: 46.8792, lng: -102.7896, timezone: "America/Chicago" },
  { name: "Mandan", state: "ND", slug: "mandan-nd", lat: 46.8265, lng: -100.8899, timezone: "America/Chicago" },
  { name: "Jamestown", state: "ND", slug: "jamestown-nd", lat: 46.9063, lng: -98.7084, timezone: "America/Chicago" },
  { name: "Uganda", state: "ND", slug: "uganda-nd", lat: 47.9253, lng: -97.0324, timezone: "America/Chicago" },
  // OHIO
  { name: "Columbus", state: "OH", slug: "columbus-oh", lat: 39.9612, lng: -82.9988, timezone: "America/New_York" },
  { name: "Cleveland", state: "OH", slug: "cleveland-oh", lat: 41.4993, lng: -81.6944, timezone: "America/New_York" },
  { name: "Cincinnati", state: "OH", slug: "cincinnati-oh", lat: 39.1031, lng: -84.5120, timezone: "America/New_York" },
  { name: "Toledo", state: "OH", slug: "toledo-oh", lat: 41.6528, lng: -83.5379, timezone: "America/New_York" },
  { name: "Akron", state: "OH", slug: "akron-oh", lat: 41.0814, lng: -81.5190, timezone: "America/New_York" },
  { name: "Dayton", state: "OH", slug: "dayton-oh", lat: 39.7589, lng: -84.1916, timezone: "America/New_York" },
  { name: "Parma", state: "OH", slug: "parma-oh", lat: 41.4048, lng: -81.7229, timezone: "America/New_York" },
  { name: "Canton", state: "OH", slug: "canton-oh", lat: 40.7989, lng: -81.3784, timezone: "America/New_York" },
  { name: "Youngstown", state: "OH", slug: "youngstown-oh", lat: 41.0998, lng: -80.6496, timezone: "America/New_York" },
  { name: "Springfield", state: "OH", slug: "springfield-oh", lat: 39.9242, lng: -83.8088, timezone: "America/New_York" },
  // OKLAHOMA
  { name: "Oklahoma City", state: "OK", slug: "oklahoma-city-ok", lat: 35.4676, lng: -97.5164, timezone: "America/Chicago" },
  { name: "Tulsa", state: "OK", slug: "tulsa-ok", lat: 36.1540, lng: -95.9928, timezone: "America/Chicago" },
  { name: "Norman", state: "OK", slug: "norman-ok", lat: 35.2226, lng: -97.4395, timezone: "America/Chicago" },
  { name: "Broken Arrow", state: "OK", slug: "broken-arrow-ok", lat: 36.0609, lng: -95.7975, timezone: "America/Chicago" },
  { name: "Lawton", state: "OK", slug: "lawton-ok", lat: 34.6035, lng: -98.4131, timezone: "America/Chicago" },
  { name: "Edmond", state: "OK", slug: "edmond-ok", lat: 35.6528, lng: -97.4781, timezone: "America/Chicago" },
  { name: "Moore", state: "OK", slug: "moore-ok", lat: 35.3395, lng: -97.4867, timezone: "America/Chicago" },
  { name: "Stillwater", state: "OK", slug: "stillwater-ok", lat: 36.1156, lng: -97.0584, timezone: "America/Chicago" },
  { name: "Muskogee", state: "OK", slug: "muskogee-ok", lat: 35.7479, lng: -95.3697, timezone: "America/Chicago" },
  { name: "Tulsa Metro", state: "OK", slug: "tulsa-metro-ok", lat: 36.1540, lng: -95.9928, timezone: "America/Chicago" },
  // OREGON
  { name: "Portland", state: "OR", slug: "portland-or", lat: 45.5152, lng: -122.6784, timezone: "America/Los_Angeles" },
  { name: "Eugene", state: "OR", slug: "eugene-or", lat: 44.0521, lng: -123.0868, timezone: "America/Los_Angeles" },
  { name: "Salem", state: "OR", slug: "salem-or", lat: 44.9429, lng: -123.0351, timezone: "America/Los_Angeles" },
  { name: "Gresham", state: "OR", slug: "gresham-or", lat: 45.4983, lng: -122.4310, timezone: "America/Los_Angeles" },
  { name: "Hillsboro", state: "OR", slug: "hillsboro-or", lat: 45.5229, lng: -122.9898, timezone: "America/Los_Angeles" },
  { name: "Beaverton", state: "OR", slug: "beaverton-or", lat: 45.4871, lng: -122.8037, timezone: "America/Los_Angeles" },
  { name: "Bend", state: "OR", slug: "bend-or", lat: 44.0582, lng: -121.3153, timezone: "America/Los_Angeles" },
  { name: "Medford", state: "OR", slug: "medford-or", lat: 42.3265, lng: -122.8756, timezone: "America/Los_Angeles" },
  { name: "Springfield", state: "OR", slug: "springfield-or", lat: 44.0462, lng: -122.9838, timezone: "America/Los_Angeles" },
  { name: "Corvallis", state: "OR", slug: "corvallis-or", lat: 44.5646, lng: -123.2620, timezone: "America/Los_Angeles" },
  // PENNSYLVANIA
  { name: "Philadelphia", state: "PA", slug: "philadelphia-pa", lat: 39.9526, lng: -75.1652, timezone: "America/New_York" },
  { name: "Pittsburgh", state: "PA", slug: "pittsburgh-pa", lat: 40.4406, lng: -79.9959, timezone: "America/New_York" },
  { name: "Allentown", state: "PA", slug: "allentown-pa", lat: 40.6084, lng: -75.4902, timezone: "America/New_York" },
  { name: "Erie", state: "PA", slug: "erie-pa", lat: 42.1292, lng: -80.0851, timezone: "America/New_York" },
  { name: "Reading", state: "PA", slug: "reading-pa", lat: 40.3356, lng: -75.9269, timezone: "America/New_York" },
  { name: "Scranton", state: "PA", slug: "scranton-pa", lat: 41.4090, lng: -75.6624, timezone: "America/New_York" },
  { name: "Lehigh Valley", state: "PA", slug: "lehigh-valley-pa", lat: 40.6259, lng: -75.3705, timezone: "America/New_York" },
  { name: "Harrisburg", state: "PA", slug: "harrisburg-pa", lat: 40.2732, lng: -76.8867, timezone: "America/New_York" },
  { name: "Lancaster", state: "PA", slug: "lancaster-pa", lat: 40.0379, lng: -76.3055, timezone: "America/New_York" },
  { name: "York", state: "PA", slug: "york-pa", lat: 39.9626, lng: -76.7277, timezone: "America/New_York" },
  // RHODE ISLAND
  { name: "Providence", state: "RI", slug: "providence-ri", lat: 41.8240, lng: -71.4128, timezone: "America/New_York" },
  { name: "Cranston", state: "RI", slug: "cranston-ri", lat: 41.7798, lng: -71.4373, timezone: "America/New_York" },
  { name: "Warwick", state: "RI", slug: "warwick-ri", lat: 41.7001, lng: -71.4162, timezone: "America/New_York" },
  { name: "Pawtucket", state: "RI", slug: "pawtucket-ri", lat: 41.8787, lng: -71.1550, timezone: "America/New_York" },
  { name: "East Providence", state: "RI", slug: "east-providence-ri", lat: 41.8137, lng: -71.3095, timezone: "America/New_York" },
  { name: "Woonsocket", state: "RI", slug: "woonsocket-ri", lat: 42.0029, lng: -71.5117, timezone: "America/New_York" },
  { name: "Newport", state: "RI", slug: "newport-ri", lat: 41.4901, lng: -71.3128, timezone: "America/New_York" },
  { name: "Central Falls", state: "RI", slug: "central-falls-ri", lat: 41.8900, lng: -71.3903, timezone: "America/New_York" },
  { name: "Westerly", state: "RI", slug: "westerly-ri", lat: 41.3793, lng: -71.7844, timezone: "America/New_York" },
  { name: "North Kingstown", state: "RI", slug: "north-kingstown-ri", lat: 41.5614, lng: -71.4617, timezone: "America/New_York" },
  // SOUTH CAROLINA
  { name: "Charleston", state: "SC", slug: "charleston-sc", lat: 32.7765, lng: -79.9311, timezone: "America/New_York" },
  { name: "Columbia", state: "SC", slug: "columbia-sc", lat: 34.0007, lng: -81.0348, timezone: "America/New_York" },
  { name: "North Charleston", state: "SC", slug: "north-charleston-sc", lat: 32.8854, lng: -79.9682, timezone: "America/New_York" },
  { name: "Mount Pleasant", state: "SC", slug: "mount-pleasant-sc", lat: 32.8324, lng: -79.8239, timezone: "America/New_York" },
  { name: "Rock Hill", state: "SC", slug: "rock-hill-sc", lat: 34.9249, lng: -81.0251, timezone: "America/New_York" },
  { name: "Greenville", state: "SC", slug: "greenville-sc", lat: 34.8526, lng: -82.3940, timezone: "America/New_York" },
  { name: "Summerville", state: "SC", slug: "summerville-sc", lat: 33.0185, lng: -80.1756, timezone: "America/New_York" },
  { name: "Hilton Head Island", state: "SC", slug: "hilton-head-island-sc", lat: 32.2163, lng: -80.7526, timezone: "America/New_York" },
  { name: "Florence", state: "SC", slug: "florence-sc", lat: 34.1954, lng: -79.7626, timezone: "America/New_York" },
  { name: "Spartanburg", state: "SC", slug: "spartanburg-sc", lat: 34.9496, lng: -81.9320, timezone: "America/New_York" },
  // SOUTH DAKOTA
  { name: "Sioux Falls", state: "SD", slug: "sioux-falls-sd", lat: 43.5460, lng: -96.7313, timezone: "America/Chicago" },
  { name: "Rapid City", state: "SD", slug: "rapid-city-sd", lat: 44.0805, lng: -103.2310, timezone: "America/Denver" },
  { name: "Aberdeen", state: "SD", slug: "aberdeen-sd", lat: 45.4647, lng: -98.4865, timezone: "America/Chicago" },
  { name: "Brookings", state: "SD", slug: "brookings-sd", lat: 44.3114, lng: -96.7984, timezone: "America/Chicago" },
  { name: "Yankton", state: "SD", slug: "yankton-sd", lat: 42.8711, lng: -97.3915, timezone: "America/Chicago" },
  { name: "Mitchell", state: "SD", slug: "mitchell-sd", lat: 43.7094, lng: -98.0298, timezone: "America/Chicago" },
  { name: "Pierre", state: "SD", slug: "pierre-sd", lat: 44.3683, lng: -100.3510, timezone: "America/Chicago" },
  { name: "Huron", state: "SD", slug: "huron-sd", lat: 44.3594, lng: -98.2251, timezone: "America/Chicago" },
  { name: "Vermillion", state: "SD", slug: "vermillion-sd", lat: 42.7744, lng: -96.9281, timezone: "America/Chicago" },
  { name: "Watertown", state: "SD", slug: "watertown-sd", lat: 44.9080, lng: -97.1128, timezone: "America/Chicago" },
  // TENNESSEE
  { name: "Nashville", state: "TN", slug: "nashville-tn", lat: 36.1627, lng: -86.7816, timezone: "America/Chicago" },
  { name: "Memphis", state: "TN", slug: "memphis-tn", lat: 35.1495, lng: -90.0490, timezone: "America/Chicago" },
  { name: "Knoxville", state: "TN", slug: "knoxville-tn", lat: 35.9606, lng: -83.9207, timezone: "America/New_York" },
  { name: "Chattanooga", state: "TN", slug: "chattanooga-tn", lat: 35.0456, lng: -85.3097, timezone: "America/New_York" },
  { name: "Murfreesboro", state: "TN", slug: "murfreesboro-tn", lat: 35.8456, lng: -86.3903, timezone: "America/Chicago" },
  { name: "Clarksville", state: "TN", slug: "clarksville-tn", lat: 36.5298, lng: -87.3595, timezone: "America/Chicago" },
  { name: "Franklin", state: "TN", slug: "franklin-tn", lat: 35.9251, lng: -86.8689, timezone: "America/Chicago" },
  { name: "Johnson City", state: "TN", slug: "johnson-city-tn", lat: 36.3134, lng: -82.3535, timezone: "America/New_York" },
  { name: "Jackson", state: "TN", slug: "jackson-tn", lat: 35.6145, lng: -88.8139, timezone: "America/Chicago" },
  { name: "Hendersonville", state: "TN", slug: "hendersonville-tn", lat: 36.3047, lng: -86.6200, timezone: "America/Chicago" },
  // TEXAS
  { name: "Houston", state: "TX", slug: "houston-tx", lat: 29.7604, lng: -95.3698, timezone: "America/Chicago" },
  { name: "San Antonio", state: "TX", slug: "san-antonio-tx", lat: 29.4241, lng: -98.4936, timezone: "America/Chicago" },
  { name: "Dallas", state: "TX", slug: "dallas-tx", lat: 32.7767, lng: -96.7970, timezone: "America/Chicago" },
  { name: "Austin", state: "TX", slug: "austin-tx", lat: 30.2672, lng: -97.7431, timezone: "America/Chicago" },
  { name: "Fort Worth", state: "TX", slug: "fort-worth-tx", lat: 32.7555, lng: -97.3308, timezone: "America/Chicago" },
  { name: "El Paso", state: "TX", slug: "el-paso-tx", lat: 31.7619, lng: -106.4850, timezone: "America/Denver" },
  { name: "Arlington", state: "TX", slug: "arlington-tx", lat: 32.7357, lng: -97.1081, timezone: "America/Chicago" },
  { name: "Corpus Christi", state: "TX", slug: "corpus-christi-tx", lat: 27.8006, lng: -97.3964, timezone: "America/Chicago" },
  { name: "Plano", state: "TX", slug: "plano-tx", lat: 33.0198, lng: -96.6989, timezone: "America/Chicago" },
  { name: "Laredo", state: "TX", slug: "laredo-tx", lat: 27.5036, lng: -99.5076, timezone: "America/Chicago" },
  // UTAH
  { name: "Salt Lake City", state: "UT", slug: "salt-lake-city-ut", lat: 40.7608, lng: -111.8910, timezone: "America/Denver" },
  { name: "West Valley City", state: "UT", slug: "west-valley-city-ut", lat: 40.6916, lng: -112.0011, timezone: "America/Denver" },
  { name: "Provo", state: "UT", slug: "provo-ut", lat: 40.2338, lng: -111.6585, timezone: "America/Denver" },
  { name: "West Jordan", state: "UT", slug: "west-jordan-ut", lat: 40.6097, lng: -111.9391, timezone: "America/Denver" },
  { name: "Orem", state: "UT", slug: "orem-ut", lat: 40.2969, lng: -111.6946, timezone: "America/Denver" },
  { name: "Sandy", state: "UT", slug: "sandy-ut", lat: 40.5728, lng: -111.8882, timezone: "America/Denver" },
  { name: "St. George", state: "UT", slug: "st-george-ut", lat: 37.0965, lng: -113.5684, timezone: "America/Denver" },
  { name: "Layton", state: "UT", slug: "layton-ut", lat: 41.0602, lng: -111.9710, timezone: "America/Denver" },
  { name: "Taylorville", state: "UT", slug: "taylorville-ut", lat: 40.6122, lng: -111.7630, timezone: "America/Denver" },
  { name: "Murray", state: "UT", slug: "murray-ut", lat: 40.6669, lng: -111.8881, timezone: "America/Denver" },
  // VERMONT
  { name: "Burlington", state: "VT", slug: "burlington-vt", lat: 44.4759, lng: -73.2121, timezone: "America/New_York" },
  { name: "Essex", state: "VT", slug: "essex-vt", lat: 44.4906, lng: -73.1115, timezone: "America/New_York" },
  { name: "South Burlington", state: "VT", slug: "south-burlington-vt", lat: 44.4661, lng: -73.1693, timezone: "America/New_York" },
  { name: "Colchester", state: "VT", slug: "colchester-vt", lat: 44.5446, lng: -73.2128, timezone: "America/New_York" },
  { name: "Rutland", state: "VT", slug: "rutland-vt", lat: 43.6106, lng: -72.9721, timezone: "America/New_York" },
  { name: "Montpelier", state: "VT", slug: "montpelier-vt", lat: 44.2601, lng: -72.5754, timezone: "America/New_York" },
  { name: "Barre", state: "VT", slug: "barre-vt", lat: 44.1970, lng: -72.5020, timezone: "America/New_York" },
  { name: "Bennington", state: "VT", slug: "bennington-vt", lat: 42.8781, lng: -73.2121, timezone: "America/New_York" },
  { name: "Brattleboro", state: "VT", slug: "brattleboro-vt", lat: 42.8509, lng: -72.5551, timezone: "America/New_York" },
  { name: "Milton", state: "VT", slug: "milton-vt", lat: 44.6358, lng: -73.1134, timezone: "America/New_York" },
  // VIRGINIA
  { name: "Virginia Beach", state: "VA", slug: "virginia-beach-va", lat: 36.8529, lng: -75.9780, timezone: "America/New_York" },
  { name: "Norfolk", state: "VA", slug: "norfolk-va", lat: 36.8508, lng: -76.2859, timezone: "America/New_York" },
  { name: "Chesapeake", state: "VA", slug: "chesapeake-va", lat: 36.7682, lng: -76.2875, timezone: "America/New_York" },
  { name: "Richmond", state: "VA", slug: "richmond-va", lat: 37.5407, lng: -77.4360, timezone: "America/New_York" },
  { name: "Newport News", state: "VA", slug: "newport-news-va", lat: 37.0871, lng: -76.4730, timezone: "America/New_York" },
  { name: "Alexandria", state: "VA", slug: "alexandria-va", lat: 38.8048, lng: -77.0469, timezone: "America/New_York" },
  { name: "Hampton", state: "VA", slug: "hampton-va", lat: 37.0299, lng: -76.3452, timezone: "America/New_York" },
  { name: "Roanoke", state: "VA", slug: "roanoke-va", lat: 37.2710, lng: -79.9414, timezone: "America/New_York" },
  { name: "Suffolk", state: "VA", slug: "suffolk-va", lat: 36.7282, lng: -76.5836, timezone: "America/New_York" },
  { name: "Harrisonburg", state: "VA", slug: "harrisonburg-va", lat: 38.4496, lng: -78.8689, timezone: "America/New_York" },
  // WASHINGTON
  { name: "Seattle", state: "WA", slug: "seattle-wa", lat: 47.6062, lng: -122.3321, timezone: "America/Los_Angeles" },
  { name: "Spokane", state: "WA", slug: "spokane-wa", lat: 47.6588, lng: -117.4260, timezone: "America/Los_Angeles" },
  { name: "Tacoma", state: "WA", slug: "tacoma-wa", lat: 47.2529, lng: -122.4443, timezone: "America/Los_Angeles" },
  { name: "Vancouver", state: "WA", slug: "vancouver-wa", lat: 45.6387, lng: -122.6615, timezone: "America/Los_Angeles" },
  { name: "Bellevue", state: "WA", slug: "bellevue-wa", lat: 47.6101, lng: -122.2015, timezone: "America/Los_Angeles" },
  { name: "Kent", state: "WA", slug: "kent-wa", lat: 47.3809, lng: -122.2348, timezone: "America/Los_Angeles" },
  { name: "Everett", state: "WA", slug: "everett-wa", lat: 47.9790, lng: -122.2021, timezone: "America/Los_Angeles" },
  { name: "Olympia", state: "WA", slug: "olympia-wa", lat: 47.0379, lng: -122.9007, timezone: "America/Los_Angeles" },
  { name: "Federal Way", state: "WA", slug: "federal-way-wa", lat: 47.3223, lng: -122.3126, timezone: "America/Los_Angeles" },
  { name: "Yakima", state: "WA", slug: "yakima-wa", lat: 46.6021, lng: -120.5059, timezone: "America/Los_Angeles" },
  // WEST VIRGINIA
  { name: "Charleston", state: "WV", slug: "charleston-wv", lat: 38.3498, lng: -81.6326, timezone: "America/New_York" },
  { name: "Huntington", state: "WV", slug: "huntington-wv", lat: 38.4192, lng: -82.4452, timezone: "America/New_York" },
  { name: "Morgantown", state: "WV", slug: "morgantown-wv", lat: 39.6296, lng: -79.9559, timezone: "America/New_York" },
  { name: "Martinsburg", state: "WV", slug: "martinsburg-wv", lat: 39.4562, lng: -77.9642, timezone: "America/New_York" },
  { name: "Parkersburg", state: "WV", slug: "parkersburg-wv", lat: 39.2667, lng: -81.5615, timezone: "America/New_York" },
  { name: "Wheeling", state: "WV", slug: "wheeling-wv", lat: 40.0640, lng: -80.7209, timezone: "America/New_York" },
  { name: "Weirton", state: "WV", slug: "weirton-wv", lat: 40.4187, lng: -80.5896, timezone: "America/New_York" },
  { name: "Fairmont", state: "WV", slug: "fairmont-wv", lat: 39.4851, lng: -80.1451, timezone: "America/New_York" },
  { name: "Beckley", state: "WV", slug: "beckley-wv", lat: 37.7780, lng: -81.1884, timezone: "America/New_York" },
  { name: "Clarksburg", state: "WV", slug: "clarksburg-wv", lat: 39.2807, lng: -80.3445, timezone: "America/New_York" },
  // WISCONSIN
  { name: "Milwaukee", state: "WI", slug: "milwaukee-wi", lat: 43.0389, lng: -87.9065, timezone: "America/Chicago" },
  { name: "Madison", state: "WI", slug: "madison-wi", lat: 43.0731, lng: -89.4012, timezone: "America/Chicago" },
  { name: "Green Bay", state: "WI", slug: "green-bay-wi", lat: 44.5133, lng: -88.0133, timezone: "America/Chicago" },
  { name: "Kenosha", state: "WI", slug: "kenosha-wi", lat: 42.5847, lng: -87.8212, timezone: "America/Chicago" },
  { name: "Racine", state: "WI", slug: "racine-wi", lat: 42.7261, lng: -87.7829, timezone: "America/Chicago" },
  { name: "Appleton", state: "WI", slug: "appleton-wi", lat: 44.2619, lng: -88.4154, timezone: "America/Chicago" },
  { name: "Eau Claire", state: "WI", slug: "eau-claire-wi", lat: 44.8113, lng: -91.4985, timezone: "America/Chicago" },
  { name: "Waukesha", state: "WI", slug: "waukesha-wi", lat: 43.0118, lng: -88.2315, timezone: "America/Chicago" },
  { name: "Oshkosh", state: "WI", slug: "oshkosh-wi", lat: 43.9847, lng: -88.5426, timezone: "America/Chicago" },
  { name: "Janesville", state: "WI", slug: "janesville-wi", lat: 42.6828, lng: -89.0187, timezone: "America/Chicago" },
  // WYOMING
  { name: "Cheyenne", state: "WY", slug: "cheyenne-wy", lat: 41.1400, lng: -104.8202, timezone: "America/Denver" },
  { name: "Casper", state: "WY", slug: "casper-wy", lat: 42.8666, lng: -106.3131, timezone: "America/Denver" },
  { name: "Gillette", state: "WY", slug: "gillette-wy", lat: 44.2911, lng: -105.5022, timezone: "America/Denver" },
  { name: "Laramie", state: "WY", slug: "laramie-wy", lat: 41.3114, lng: -105.5911, timezone: "America/Denver" },
  { name: "Rock Springs", state: "WY", slug: "rock-springs-wy", lat: 41.5875, lng: -109.2029, timezone: "America/Denver" },
  { name: "Sheridan", state: "WY", slug: "sheridan-wy", lat: 44.7972, lng: -106.9562, timezone: "America/Denver" },
  { name: "Green River", state: "WY", slug: "green-river-wy", lat: 41.5283, lng: -109.4663, timezone: "America/Denver" },
  { name: "Evanston", state: "WY", slug: "evanston-wy", lat: 41.2602, lng: -110.9643, timezone: "America/Denver" },
  { name: "Riverton", state: "WY", slug: "riverton-wy", lat: 42.8660, lng: -108.3801, timezone: "America/Denver" },
  { name: "Jackson", state: "WY", slug: "jackson-wy", lat: 43.4799, lng: -110.7624, timezone: "America/Denver" },
];

// ─── TIER 1 VENUES ───────────────────────────────────────────────────────────

interface VenueSeed {
  name: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  venueType: string;
  capacity: number;
}

const venues: VenueSeed[] = [
  // NEW YORK
  { name: "MetLife Stadium", city: "New York", state: "NY", address: "1 MetLife Stadium Dr, East Rutherford, NJ", lat: 40.8135, lng: -74.0745, venueType: "stadium", capacity: 82500 },
  { name: "Madison Square Garden", city: "New York", state: "NY", address: "4 Pennsylvania Plaza, New York, NY", lat: 40.7505, lng: -73.9934, venueType: "arena", capacity: 20789 },
  { name: "Barclays Center", city: "New York", state: "NY", address: "620 Atlantic Ave, Brooklyn, NY", lat: 40.6826, lng: -73.9754, venueType: "arena", capacity: 19000 },
  { name: "Yankee Stadium", city: "New York", state: "NY", address: "1 E 161st St, Bronx, NY", lat: 40.8296, lng: -73.9262, venueType: "stadium", capacity: 46537 },
  { name: "Citi Field", city: "New York", state: "NY", address: "41 Seaver Way, Queens, NY", lat: 40.7571, lng: -73.8458, venueType: "stadium", capacity: 41922 },
  { name: "Red Bull Arena", city: "New York", state: "NY", address: "600 Cape May St, Harrison, NJ", lat: 40.7369, lng: -74.1503, venueType: "stadium", capacity: 25000 },
  { name: "UBS Arena", city: "New York", state: "NY", address: "2400 Hempstead Turnpike, Elmont, NY", lat: 40.7176, lng: -73.7254, venueType: "arena", capacity: 17255 },
  { name: "Radio City Music Hall", city: "New York", state: "NY", address: "1260 6th Ave, New York, NY", lat: 40.7604, lng: -73.9811, venueType: "amphitheater", capacity: 5960 },

  // LOS ANGELES
  { name: "SoFi Stadium", city: "Los Angeles", state: "CA", address: "1001 S Stadium Dr, Inglewood, CA", lat: 33.9535, lng: -118.3392, venueType: "stadium", capacity: 70240 },
  { name: "Crypto.com Arena", city: "Los Angeles", state: "CA", address: "1111 S Figueroa St, Los Angeles, CA", lat: 34.0430, lng: -118.2673, venueType: "arena", capacity: 20000 },
  { name: "Dodger Stadium", city: "Los Angeles", state: "CA", address: "1000 Vin Scully Ave, Los Angeles, CA", lat: 34.0739, lng: -118.2400, venueType: "stadium", capacity: 56000 },
  { name: "Angel Stadium", city: "Los Angeles", state: "CA", address: "2000 Gene Autry Way, Anaheim, CA", lat: 33.8003, lng: -117.8827, venueType: "stadium", capacity: 45517 },
  { name: "BMO Stadium", city: "Los Angeles", state: "CA", address: "3939 S Figueroa St, Los Angeles, CA", lat: 34.0127, lng: -118.2841, venueType: "stadium", capacity: 22000 },
  { name: "Hollywood Bowl", city: "Los Angeles", state: "CA", address: "2301 N Highland Blvd, Los Angeles, CA", lat: 34.1122, lng: -118.3390, venueType: "amphitheater", capacity: 17500 },
  { name: "The Kia Forum", city: "Los Angeles", state: "CA", address: "3900 W Manchester Blvd, Inglewood, CA", lat: 33.9583, lng: -118.3414, venueType: "arena", capacity: 17500 },

  // CHICAGO
  { name: "Soldier Field", city: "Chicago", state: "IL", address: "1410 Special Olympics Dr, Chicago, IL", lat: 41.8623, lng: -87.6167, venueType: "stadium", capacity: 61500 },
  { name: "United Center", city: "Chicago", state: "IL", address: "1901 W Madison St, Chicago, IL", lat: 41.8807, lng: -87.6742, venueType: "arena", capacity: 20917 },
  { name: "Wrigley Field", city: "Chicago", state: "IL", address: "1060 W Addison St, Chicago, IL", lat: 41.9484, lng: -87.6553, venueType: "stadium", capacity: 41649 },
  { name: "Guaranteed Rate Field", city: "Chicago", state: "IL", address: "333 W 35th St, Chicago, IL", lat: 41.8299, lng: -87.6338, venueType: "stadium", capacity: 40615 },
  { name: "Wintrust Arena", city: "Chicago", state: "IL", address: "200 E Cermak Rd, Chicago, IL", lat: 41.8534, lng: -87.6180, venueType: "arena", capacity: 10387 },

  // DALLAS
  { name: "AT&T Stadium", city: "Dallas", state: "TX", address: "1 AT&T Way, Arlington, TX", lat: 32.7473, lng: -97.0945, venueType: "stadium", capacity: 80000 },
  { name: "Globe Life Field", city: "Dallas", state: "TX", address: "734 Stadium Dr, Arlington, TX", lat: 32.7512, lng: -97.0832, venueType: "stadium", capacity: 40300 },
  { name: "American Airlines Center", city: "Dallas", state: "TX", address: "2500 Victory Ave, Dallas, TX", lat: 32.7905, lng: -96.8103, venueType: "arena", capacity: 19200 },
  { name: "Toyota Stadium", city: "Dallas", state: "TX", address: "9200 World Cup Way, Frisco, TX", lat: 33.1545, lng: -96.8352, venueType: "stadium", capacity: 20500 },

  // HOUSTON
  { name: "NRG Stadium", city: "Houston", state: "TX", address: "1 NRG Park, Houston, TX", lat: 29.6847, lng: -95.4107, venueType: "stadium", capacity: 72220 },
  { name: "Minute Maid Park", city: "Houston", state: "TX", address: "501 Crawford St, Houston, TX", lat: 29.7573, lng: -95.3555, venueType: "stadium", capacity: 41168 },
  { name: "Toyota Center", city: "Houston", state: "TX", address: "1510 Polk St, Houston, TX", lat: 29.7508, lng: -95.3621, venueType: "arena", capacity: 18055 },
  { name: "Shell Energy Stadium", city: "Houston", state: "TX", address: "2200 Texas Ave, Houston, TX", lat: 29.7525, lng: -95.3526, venueType: "stadium", capacity: 22039 },

  // PHILADELPHIA
  { name: "Lincoln Financial Field", city: "Philadelphia", state: "PA", address: "1020 Pattison Ave, Philadelphia, PA", lat: 39.9008, lng: -75.1675, venueType: "stadium", capacity: 69328 },
  { name: "Wells Fargo Center", city: "Philadelphia", state: "PA", address: "3601 S Broad St, Philadelphia, PA", lat: 39.9012, lng: -75.1720, venueType: "arena", capacity: 20478 },
  { name: "Citizens Bank Park", city: "Philadelphia", state: "PA", address: "1 Citizens Bank Way, Philadelphia, PA", lat: 39.9061, lng: -75.1665, venueType: "stadium", capacity: 42792 },
  { name: "Subaru Park", city: "Philadelphia", state: "PA", address: "1 Stadium Dr, Chester, PA", lat: 39.8328, lng: -75.3789, venueType: "stadium", capacity: 18500 },

  // WASHINGTON DC
  { name: "Northwest Stadium", city: "Washington", state: "DC", address: "1600 Ring Rd, Landover, MD", lat: 38.9077, lng: -76.8649, venueType: "stadium", capacity: 67617 },
  { name: "Capital One Arena", city: "Washington", state: "DC", address: "601 F St NW, Washington, DC", lat: 38.8981, lng: -77.0209, venueType: "arena", capacity: 20356 },
  { name: "Nationals Park", city: "Washington", state: "DC", address: "1500 S Capitol St SE, Washington, DC", lat: 38.8730, lng: -77.0074, venueType: "stadium", capacity: 41339 },
  { name: "Audi Field", city: "Washington", state: "DC", address: "100 Potomac Ave SW, Washington, DC", lat: 38.8686, lng: -77.0128, venueType: "stadium", capacity: 20000 },
  { name: "Jiffy Lube Live", city: "Washington", state: "DC", address: "7800 Cellar Door Dr, Bristow, VA", lat: 38.7863, lng: -77.5876, venueType: "amphitheater", capacity: 25262 },

  // MIAMI
  { name: "Hard Rock Stadium", city: "Miami", state: "FL", address: "347 Don Shula Dr, Miami Gardens, FL", lat: 25.9580, lng: -80.2389, venueType: "stadium", capacity: 65326 },
  { name: "Kaseya Center", city: "Miami", state: "FL", address: "601 Biscayne Blvd, Miami, FL", lat: 25.7814, lng: -80.1870, venueType: "arena", capacity: 19600 },
  { name: "Chase Stadium", city: "Miami", state: "FL", address: "1801 NW 6th St, Fort Lauderdale, FL", lat: 26.1929, lng: -80.1603, venueType: "stadium", capacity: 18000 },

  // ATLANTA
  { name: "Mercedes-Benz Stadium", city: "Atlanta", state: "GA", address: "1 AMB Dr NW, Atlanta, GA", lat: 33.7554, lng: -84.4010, venueType: "stadium", capacity: 71000 },
  { name: "State Farm Arena", city: "Atlanta", state: "GA", address: "1 State Farm Dr, Atlanta, GA", lat: 33.7573, lng: -84.3963, venueType: "arena", capacity: 18118 },
  { name: "Truist Park", city: "Atlanta", state: "GA", address: "755 Battery Ave NW, Atlanta, GA", lat: 33.8907, lng: -84.4677, venueType: "stadium", capacity: 41084 },

  // BOSTON
  { name: "Gillette Stadium", city: "Boston", state: "MA", address: "1 Patriot Pl, Foxborough, MA", lat: 42.0909, lng: -71.2643, venueType: "stadium", capacity: 65878 },
  { name: "TD Garden", city: "Boston", state: "MA", address: "100 Legends Way, Boston, MA", lat: 42.3662, lng: -71.0621, venueType: "arena", capacity: 19580 },
  { name: "Fenway Park", city: "Boston", state: "MA", address: "4 Jersey St, Boston, MA", lat: 42.3467, lng: -71.0972, venueType: "stadium", capacity: 37755 },

  // SAN FRANCISCO
  { name: "Levi's Stadium", city: "San Francisco", state: "CA", address: "4900 Marie P DeBartolo Way, Santa Clara, CA", lat: 37.4033, lng: -121.9694, venueType: "stadium", capacity: 68500 },
  { name: "Chase Center", city: "San Francisco", state: "CA", address: "16th St & 3rd St, San Francisco, CA", lat: 37.7680, lng: -122.3884, venueType: "arena", capacity: 18064 },
  { name: "Oracle Park", city: "San Francisco", state: "CA", address: "24 Willie Mays Plaza, San Francisco, CA", lat: 37.7786, lng: -122.3893, venueType: "stadium", capacity: 41265 },

  // SEATTLE
  { name: "Lumen Field", city: "Seattle", state: "WA", address: "3333 S Lumen Field Way, Seattle, WA", lat: 47.5952, lng: -122.3316, venueType: "stadium", capacity: 68740 },
  { name: "T-Mobile Park", city: "Seattle", state: "WA", address: "1250 1st Ave S, Seattle, WA", lat: 47.5914, lng: -122.3325, venueType: "stadium", capacity: 47929 },
  { name: "Climate Pledge Arena", city: "Seattle", state: "WA", address: "334 1st Ave N, Seattle, WA", lat: 47.6222, lng: -122.3541, venueType: "arena", capacity: 17151 },

  // DENVER
  { name: "Empower Field at Mile High", city: "Denver", state: "CO", address: "1701 Bryant St, Denver, CO", lat: 39.7439, lng: -105.0201, venueType: "stadium", capacity: 76125 },
  { name: "Coors Field", city: "Denver", state: "CO", address: "2001 Blake St, Denver, CO", lat: 39.7559, lng: -104.9942, venueType: "stadium", capacity: 50445 },
  { name: "Ball Arena", city: "Denver", state: "CO", address: "1000 Chopper Circle, Denver, CO", lat: 39.7487, lng: -105.0077, venueType: "arena", capacity: 18007 },

  // MINNEAPOLIS
  { name: "U.S. Bank Stadium", city: "Minneapolis", state: "MN", address: "401 Chicago Ave, Minneapolis, MN", lat: 44.9736, lng: -93.2575, venueType: "stadium", capacity: 66655 },
  { name: "Target Center", city: "Minneapolis", state: "MN", address: "600 1st Ave N, Minneapolis, MN", lat: 44.9795, lng: -93.2761, venueType: "arena", capacity: 18798 },
  { name: "Target Field", city: "Minneapolis", state: "MN", address: "1 Twins Way, Minneapolis, MN", lat: 44.9817, lng: -93.2776, venueType: "stadium", capacity: 38544 },

  // PHOENIX
  { name: "State Farm Stadium", city: "Phoenix", state: "AZ", address: "1 Cardinals Dr, Glendale, AZ", lat: 33.5276, lng: -112.2636, venueType: "stadium", capacity: 63400 },
  { name: "Chase Field", city: "Phoenix", state: "AZ", address: "401 E Jefferson St, Phoenix, AZ", lat: 33.4455, lng: -112.0667, venueType: "stadium", capacity: 48519 },
  { name: "Footprint Center", city: "Phoenix", state: "AZ", address: "301 E Jefferson St, Phoenix, AZ", lat: 33.4457, lng: -112.0712, venueType: "arena", capacity: 18055 },

  // DETROIT
  { name: "Ford Field", city: "Detroit", state: "MI", address: "2000 Brush St, Detroit, MI", lat: 42.3400, lng: -83.0456, venueType: "stadium", capacity: 65000 },
  { name: "Little Caesars Arena", city: "Detroit", state: "MI", address: "2645 Woodward Ave, Detroit, MI", lat: 42.3411, lng: -83.0553, venueType: "arena", capacity: 20332 },
  { name: "Comerica Park", city: "Detroit", state: "MI", address: "2100 Woodward Ave, Detroit, MI", lat: 42.3390, lng: -83.0485, venueType: "stadium", capacity: 41083 },

  // LAS VEGAS
  { name: "Allegiant Stadium", city: "Las Vegas", state: "NV", address: "3333 Al Davis Way, Las Vegas, NV", lat: 36.0908, lng: -115.1833, venueType: "stadium", capacity: 65000 },
  { name: "T-Mobile Arena", city: "Las Vegas", state: "NV", address: "3780 S Las Vegas Blvd, Las Vegas, NV", lat: 36.1029, lng: -115.1785, venueType: "arena", capacity: 20000 },

  // TAMPA
  { name: "Raymond James Stadium", city: "Tampa", state: "FL", address: "4201 N Dale Mabry Hwy, Tampa, FL", lat: 27.9759, lng: -82.5033, venueType: "stadium", capacity: 65618 },
  { name: "Amalie Arena", city: "Tampa", state: "FL", address: "401 Channelside Dr, Tampa, FL", lat: 27.9427, lng: -82.4519, venueType: "arena", capacity: 19092 },

  // NASHVILLE
  { name: "Nissan Stadium", city: "Nashville", state: "TN", address: "1 Titans Way, Nashville, TN", lat: 36.1664, lng: -86.7713, venueType: "stadium", capacity: 69143 },
  { name: "Bridgestone Arena", city: "Nashville", state: "TN", address: "501 Broadway, Nashville, TN", lat: 36.1590, lng: -86.7786, venueType: "arena", capacity: 19395 },

  // PORTLAND
  { name: "Providence Park", city: "Portland", state: "OR", address: "1844 SW Morrison St, Portland, OR", lat: 45.5219, lng: -122.6915, venueType: "stadium", capacity: 25218 },
  { name: "Moda Center", city: "Portland", state: "OR", address: "1 N Center Court St, Portland, OR", lat: 45.5316, lng: -122.6668, venueType: "arena", capacity: 19441 },

  // HAMPTON
  { name: "Hampton Coliseum", city: "Hampton", state: "VA", address: "1000 Finland Dr, Hampton, VA", lat: 37.0282, lng: -76.3782, venueType: "arena", capacity: 9812 },
  { name: "Fort Monroe", city: "Hampton", state: "VA", address: "42 Ingram Ave, Fort Monroe, VA", lat: 37.0041, lng: -76.3097, venueType: "stadium", capacity: 5000 },

  // VIRGINIA BEACH
  { name: "Veterans United Home Loans Amphitheater", city: "Virginia Beach", state: "VA", address: "3550 Cellar Door Way, Virginia Beach, VA", lat: 36.7686, lng: -76.1463, venueType: "amphitheater", capacity: 20000 },
  { name: "Virginia Beach Convention Center", city: "Virginia Beach", state: "VA", address: "1000 19th St, Virginia Beach, VA", lat: 36.8483, lng: -75.9853, venueType: "arena", capacity: 10000 },

  // NORFOLK
  { name: "NorScope Amphitheater", city: "Norfolk", state: "VA", address: "1411 Monticello Ave, Norfolk, VA", lat: 36.8611, lng: -76.2925, venueType: "amphitheater", capacity: 12000 },
  { name: "Norfolk Scope", city: "Norfolk", state: "VA", address: "201 E Brambleton Ave, Norfolk, VA", lat: 36.8519, lng: -76.2863, venueType: "arena", capacity: 13500 },
];

// ─── EVENTS (2026-2027 SEASON) ───────────────────────────────────────────────

interface EventSeed {
  name: string;
  venue: string;
  city: string;
  state: string;
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  lat: number;
  lng: number;
  eventType: string;
  description: string;
}

function d(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00Z`);
}

const events: EventSeed[] = [
  // ── NEW YORK: NFL ───────────────────────────────────────────────────
  { name: "New York Jets vs Buffalo Bills", venue: "MetLife Stadium", city: "New York", state: "NY", eventDate: d("2026-09-13","00:00"), startTime: d("2026-09-13","17:00"), endTime: d("2026-09-13","20:00"), lat: 40.8135, lng: -74.0745, eventType: "NFL", description: "Jets home opener vs the Bills at MetLife Stadium." },
  { name: "New York Giants vs Dallas Cowboys", venue: "MetLife Stadium", city: "New York", state: "NY", eventDate: d("2026-09-20","00:00"), startTime: d("2026-09-20","13:00"), endTime: d("2026-09-20","16:00"), lat: 40.8135, lng: -74.0745, eventType: "NFL", description: "Giants host the Cowboys in an NFC East showdown." },
  { name: "New York Jets vs New England Patriots", venue: "MetLife Stadium", city: "New York", state: "NY", eventDate: d("2026-10-04","00:00"), startTime: d("2026-10-04","13:00"), endTime: d("2026-10-04","16:00"), lat: 40.8135, lng: -74.0745, eventType: "NFL", description: "AFC East rivalry. Jets vs Patriots at MetLife." },
  { name: "New York Giants vs Philadelphia Eagles", venue: "MetLife Stadium", city: "New York", state: "NY", eventDate: d("2026-10-26","00:00"), startTime: d("2026-10-26","13:00"), endTime: d("2026-10-26","16:00"), lat: 40.8135, lng: -74.0745, eventType: "NFL", description: "NFC East divisional clash. Giants vs Eagles." },
  { name: "New York Jets vs Miami Dolphins", venue: "MetLife Stadium", city: "New York", state: "NY", eventDate: d("2026-11-16","00:00"), startTime: d("2026-11-16","20:20"), endTime: d("2026-11-16","23:30"), lat: 40.8135, lng: -74.0745, eventType: "NFL", description: "Sunday Night Football. Jets host the Dolphins." },
  { name: "New York Giants vs Washington Commanders", venue: "MetLife Stadium", city: "New York", state: "NY", eventDate: d("2026-12-06","00:00"), startTime: d("2026-12-06","13:00"), endTime: d("2026-12-06","16:00"), lat: 40.8135, lng: -74.0745, eventType: "NFL", description: "NFC East battle. Giants host the Commanders." },

  // ── NEW YORK: NBA ───────────────────────────────────────────────────
  { name: "New York Knicks vs Boston Celtics", venue: "Madison Square Garden", city: "New York", state: "NY", eventDate: d("2026-10-22","00:00"), startTime: d("2026-10-22","19:30"), endTime: d("2026-10-22","22:00"), lat: 40.7505, lng: -73.9934, eventType: "NBA", description: "Knicks home opener vs the Celtics at the Garden." },
  { name: "Brooklyn Nets vs Los Angeles Lakers", venue: "Barclays Center", city: "New York", state: "NY", eventDate: d("2026-11-05","00:00"), startTime: d("2026-11-05","19:30"), endTime: d("2026-11-05","22:00"), lat: 40.6826, lng: -73.9754, eventType: "NBA", description: "Nets host LeBron and the Lakers at Barclays Center." },
  { name: "New York Knicks vs Miami Heat", venue: "Madison Square Garden", city: "New York", state: "NY", eventDate: d("2026-12-10","00:00"), startTime: d("2026-12-10","19:30"), endTime: d("2026-12-10","22:00"), lat: 40.7505, lng: -73.9934, eventType: "NBA", description: "Knicks host the Heat at the World's Most Famous Arena." },

  // ── NEW YORK: NHL ───────────────────────────────────────────────────
  { name: "New York Rangers vs Pittsburgh Penguins", venue: "Madison Square Garden", city: "New York", state: "NY", eventDate: d("2026-10-15","00:00"), startTime: d("2026-10-15","19:00"), endTime: d("2026-10-15","22:00"), lat: 40.7505, lng: -73.9934, eventType: "NHL", description: "Rangers open home schedule vs the Penguins." },
  { name: "New York Islanders vs New York Rangers", venue: "UBS Arena", city: "New York", state: "NY", eventDate: d("2026-11-12","00:00"), startTime: d("2026-11-12","19:00"), endTime: d("2026-11-12","22:00"), lat: 40.7176, lng: -73.7254, eventType: "NHL", description: "Battle of New York. Islanders host the Rangers at UBS Arena." },

  // ── NEW YORK: MLB ───────────────────────────────────────────────────
  { name: "New York Yankees vs Boston Red Sox", venue: "Yankee Stadium", city: "New York", state: "NY", eventDate: d("2026-07-25","00:00"), startTime: d("2026-07-25","19:05"), endTime: d("2026-07-25","22:00"), lat: 40.8296, lng: -73.9262, eventType: "MLB", description: "Yankees host the Red Sox. The greatest rivalry in baseball." },
  { name: "New York Mets vs Atlanta Braves", venue: "Citi Field", city: "New York", state: "NY", eventDate: d("2026-08-08","00:00"), startTime: d("2026-08-08","19:10"), endTime: d("2026-08-08","22:00"), lat: 40.7571, lng: -73.8458, eventType: "MLB", description: "Mets host the Braves in a crucial NL East matchup." },

  // ── NEW YORK: MLS ───────────────────────────────────────────────────
  { name: "NYCFC vs Inter Miami", venue: "Yankee Stadium", city: "New York", state: "NY", eventDate: d("2026-08-23","00:00"), startTime: d("2026-08-23","19:30"), endTime: d("2026-08-23","21:30"), lat: 40.8296, lng: -73.9262, eventType: "MLS", description: "NYCFC host Messi and Inter Miami at Yankee Stadium." },

  // ── LOS ANGELES: NFL ────────────────────────────────────────────────
  { name: "Los Angeles Rams vs San Francisco 49ers", venue: "SoFi Stadium", city: "Los Angeles", state: "CA", eventDate: d("2026-09-14","00:00"), startTime: d("2026-09-14","13:00"), endTime: d("2026-09-14","16:00"), lat: 33.9535, lng: -118.3392, eventType: "NFL", description: "NFC West rivalry. Rams host the 49ers at SoFi." },
  { name: "Los Angeles Chargers vs Kansas City Chiefs", venue: "SoFi Stadium", city: "Los Angeles", state: "CA", eventDate: d("2026-10-05","00:00"), startTime: d("2026-10-05","16:25"), endTime: d("2026-10-05","19:30"), lat: 33.9535, lng: -118.3392, eventType: "NFL", description: "AFC West showdown. Chargers vs Chiefs at SoFi." },
  { name: "Los Angeles Rams vs Seattle Seahawks", venue: "SoFi Stadium", city: "Los Angeles", state: "CA", eventDate: d("2026-11-23","00:00"), startTime: d("2026-11-23","20:20"), endTime: d("2026-11-23","23:30"), lat: 33.9535, lng: -118.3392, eventType: "NFL", description: "Sunday Night Football. Rams host the Seahawks." },

  // ── LOS ANGELES: NBA ────────────────────────────────────────────────
  { name: "Los Angeles Lakers vs Boston Celtics", venue: "Crypto.com Arena", city: "Los Angeles", state: "CA", eventDate: d("2026-11-19","00:00"), startTime: d("2026-11-19","19:30"), endTime: d("2026-11-19","22:00"), lat: 34.0430, lng: -118.2673, eventType: "NBA", description: "The NBA's greatest rivalry. Lakers vs Celtics at Crypto.com Arena." },
  { name: "LA Clippers vs Golden State Warriors", venue: "Crypto.com Arena", city: "Los Angeles", state: "CA", eventDate: d("2026-12-03","00:00"), startTime: d("2026-12-03","19:30"), endTime: d("2026-12-03","22:00"), lat: 34.0430, lng: -118.2673, eventType: "NBA", description: "LA rivalry. Clippers host the Warriors." },

  // ── LOS ANGELES: MLB ────────────────────────────────────────────────
  { name: "Los Angeles Dodgers vs San Francisco Giants", venue: "Dodger Stadium", city: "Los Angeles", state: "CA", eventDate: d("2026-07-24","00:00"), startTime: d("2026-07-24","19:10"), endTime: d("2026-07-24","22:00"), lat: 34.0739, lng: -118.2400, eventType: "MLB", description: "The oldest rivalry in baseball. Dodgers vs Giants at Chavez Ravine." },
  { name: "Los Angeles Angels vs Houston Astros", venue: "Angel Stadium", city: "Los Angeles", state: "CA", eventDate: d("2026-08-15","00:00"), startTime: d("2026-08-15","19:07"), endTime: d("2026-08-15","22:00"), lat: 33.8003, lng: -117.8827, eventType: "MLB", description: "Angels host the Astros at Angel Stadium." },

  // ── LOS ANGELES: MLS ────────────────────────────────────────────────
  { name: "LAFC vs LA Galaxy", venue: "BMO Stadium", city: "Los Angeles", state: "CA", eventDate: d("2026-08-30","00:00"), startTime: d("2026-08-30","19:30"), endTime: d("2026-08-30","21:30"), lat: 34.0127, lng: -118.2841, eventType: "MLS", description: "El Tráfico! LAFC vs LA Galaxy. The biggest rivalry in MLS." },

  // ── CHICAGO: NFL ────────────────────────────────────────────────────
  { name: "Chicago Bears vs Green Bay Packers", venue: "Soldier Field", city: "Chicago", state: "IL", eventDate: d("2026-09-20","00:00"), startTime: d("2026-09-20","13:00"), endTime: d("2026-09-20","16:00"), lat: 41.8623, lng: -87.6167, eventType: "NFL", description: "The NFL's oldest rivalry. Bears host the Packers at Soldier Field." },
  { name: "Chicago Bears vs Minnesota Vikings", venue: "Soldier Field", city: "Chicago", state: "IL", eventDate: d("2026-10-25","00:00"), startTime: d("2026-10-25","13:00"), endTime: d("2026-10-25","16:00"), lat: 41.8623, lng: -87.6167, eventType: "NFL", description: "NFC North clash. Bears vs Vikings at Soldier Field." },

  // ── CHICAGO: NBA ────────────────────────────────────────────────────
  { name: "Chicago Bulls vs Los Angeles Lakers", venue: "United Center", city: "Chicago", state: "IL", eventDate: d("2026-11-14","00:00"), startTime: d("2026-11-14","19:30"), endTime: d("2026-11-14","22:00"), lat: 41.8807, lng: -87.6742, eventType: "NBA", description: "Bulls host the Lakers at the United Center." },
  { name: "Chicago Bulls vs Boston Celtics", venue: "United Center", city: "Chicago", state: "IL", eventDate: d("2026-12-13","00:00"), startTime: d("2026-12-13","19:00"), endTime: d("2026-12-13","21:30"), lat: 41.8807, lng: -87.6742, eventType: "NBA", description: "Bulls host the Celtics at the United Center." },

  // ── CHICAGO: MLB ────────────────────────────────────────────────────
  { name: "Chicago Cubs vs St. Louis Cardinals", venue: "Wrigley Field", city: "Chicago", state: "IL", eventDate: d("2026-07-26","00:00"), startTime: d("2026-07-26","13:20"), endTime: d("2026-07-26","16:30"), lat: 41.9484, lng: -87.6553, eventType: "MLB", description: "The Cubs host the Cardinals. A century of rivalry at Wrigley Field." },
  { name: "Chicago White Sox vs Chicago Cubs", venue: "Guaranteed Rate Field", city: "Chicago", state: "IL", eventDate: d("2026-08-19","00:00"), startTime: d("2026-08-19","19:10"), endTime: d("2026-08-19","22:00"), lat: 41.8299, lng: -87.6338, eventType: "MLB", description: "Crosstown Classic! White Sox vs Cubs at Guaranteed Rate Field." },

  // ── CHICAGO: NHL ────────────────────────────────────────────────────
  { name: "Chicago Blackhawks vs Detroit Red Wings", venue: "United Center", city: "Chicago", state: "IL", eventDate: d("2026-10-18","00:00"), startTime: d("2026-10-18","19:00"), endTime: d("2026-10-18","22:00"), lat: 41.8807, lng: -87.6742, eventType: "NHL", description: "Original Six rivalry. Blackhawks vs Red Wings at the United Center." },

  // ── DALLAS: NFL ─────────────────────────────────────────────────────
  { name: "Dallas Cowboys vs Philadelphia Eagles", venue: "AT&T Stadium", city: "Dallas", state: "TX", eventDate: d("2026-09-14","00:00"), startTime: d("2026-09-14","13:00"), endTime: d("2026-09-14","16:30"), lat: 32.7473, lng: -97.0945, eventType: "NFL", description: "NFC East showdown. Cowboys host the Eagles at AT&T Stadium." },
  { name: "Dallas Cowboys vs Washington Commanders", venue: "AT&T Stadium", city: "Dallas", state: "TX", eventDate: d("2026-10-26","00:00"), startTime: d("2026-10-26","13:00"), endTime: d("2026-10-26","16:30"), lat: 32.7473, lng: -97.0945, eventType: "NFL", description: "Cowboys host the Commanders in a Sunday afternoon clash." },
  { name: "Dallas Cowboys vs New York Giants", venue: "AT&T Stadium", city: "Dallas", state: "TX", eventDate: d("2026-12-14","00:00"), startTime: d("2026-12-14","20:20"), endTime: d("2026-12-14","23:30"), lat: 32.7473, lng: -97.0945, eventType: "NFL", description: "Sunday Night Football. Cowboys vs Giants at AT&T Stadium." },

  // ── DALLAS: NBA ─────────────────────────────────────────────────────
  { name: "Dallas Mavericks vs Los Angeles Lakers", venue: "American Airlines Center", city: "Dallas", state: "TX", eventDate: d("2026-11-02","00:00"), startTime: d("2026-11-02","19:30"), endTime: d("2026-11-02","22:00"), lat: 32.7905, lng: -96.8103, eventType: "NBA", description: "Mavericks host LeBron and the Lakers at AAC." },

  // ── DALLAS: MLB ─────────────────────────────────────────────────────
  { name: "Texas Rangers vs Houston Astros", venue: "Globe Life Field", city: "Dallas", state: "TX", eventDate: d("2026-07-25","00:00"), startTime: d("2026-07-25","19:05"), endTime: d("2026-07-25","22:00"), lat: 32.7512, lng: -97.0832, eventType: "MLB", description: "Lone Star Series! Rangers host the Astros at Globe Life Field." },

  // ── HOUSTON: NFL ────────────────────────────────────────────────────
  { name: "Houston Texans vs Indianapolis Colts", venue: "NRG Stadium", city: "Houston", state: "TX", eventDate: d("2026-09-14","00:00"), startTime: d("2026-09-14","13:00"), endTime: d("2026-09-14","16:00"), lat: 29.6847, lng: -95.4107, eventType: "NFL", description: "AFC South clash. Texans host the Colts at NRG Stadium." },
  { name: "Houston Texans vs Tennessee Titans", venue: "NRG Stadium", city: "Houston", state: "TX", eventDate: d("2026-11-02","00:00"), startTime: d("2026-11-02","13:00"), endTime: d("2026-11-02","16:00"), lat: 29.6847, lng: -95.4107, eventType: "NFL", description: "AFC South battle. Texans host the Titans." },

  // ── HOUSTON: MLB ────────────────────────────────────────────────────
  { name: "Houston Astros vs Texas Rangers", venue: "Minute Maid Park", city: "Houston", state: "TX", eventDate: d("2026-08-22","00:00"), startTime: d("2026-08-22","19:10"), endTime: d("2026-08-22","22:00"), lat: 29.7573, lng: -95.3555, eventType: "MLB", description: "Lone Star Series continues. Astros host the Rangers at Minute Maid." },

  // ── HOUSTON: NBA ────────────────────────────────────────────────────
  { name: "Houston Rockets vs Dallas Mavericks", venue: "Toyota Center", city: "Houston", state: "TX", eventDate: d("2026-10-29","00:00"), startTime: d("2026-10-29","19:00"), endTime: d("2026-10-29","21:30"), lat: 29.7508, lng: -95.3621, eventType: "NBA", description: "Texas rivalry. Rockets host the Mavericks at Toyota Center." },

  // ── PHILADELPHIA: NFL ───────────────────────────────────────────────
  { name: "Philadelphia Eagles vs Dallas Cowboys", venue: "Lincoln Financial Field", city: "Philadelphia", state: "PA", eventDate: d("2026-10-04","00:00"), startTime: d("2026-10-04","13:00"), endTime: d("2026-10-04","16:30"), lat: 39.9008, lng: -75.1675, eventType: "NFL", description: "NFC East rivalry. Eagles host the Cowboys at the Linc." },
  { name: "Philadelphia Eagles vs New York Giants", venue: "Lincoln Financial Field", city: "Philadelphia", state: "PA", eventDate: d("2026-11-22","00:00"), startTime: d("2026-11-22","13:00"), endTime: d("2026-11-22","16:00"), lat: 39.9008, lng: -75.1675, eventType: "NFL", description: "Eagles host the Giants in an NFC East showdown." },

  // ── PHILADELPHIA: NBA ───────────────────────────────────────────────
  { name: "Philadelphia 76ers vs Boston Celtics", venue: "Wells Fargo Center", city: "Philadelphia", state: "PA", eventDate: d("2026-10-28","00:00"), startTime: d("2026-10-28","19:00"), endTime: d("2026-10-28","21:30"), lat: 39.9012, lng: -75.1720, eventType: "NBA", description: "76ers host the Celtics in a fierce Eastern Conference rivalry." },

  // ── PHILADELPHIA: MLB ───────────────────────────────────────────────
  { name: "Philadelphia Phillies vs New York Mets", venue: "Citizens Bank Park", city: "Philadelphia", state: "PA", eventDate: d("2026-09-05","00:00"), startTime: d("2026-09-05","19:05"), endTime: d("2026-09-05","22:00"), lat: 39.9061, lng: -75.1665, eventType: "MLB", description: "Phillies host the Mets in a crucial September matchup." },

  // ── WASHINGTON DC: NFL ──────────────────────────────────────────────
  { name: "Washington Commanders vs Dallas Cowboys", venue: "Northwest Stadium", city: "Washington", state: "DC", eventDate: d("2026-09-27","00:00"), startTime: d("2026-09-27","13:00"), endTime: d("2026-09-27","16:30"), lat: 38.9077, lng: -76.8649, eventType: "NFL", description: "NFC East battle. Commanders host the Cowboys at Northwest Stadium." },
  { name: "Washington Commanders vs Philadelphia Eagles", venue: "Northwest Stadium", city: "Washington", state: "DC", eventDate: d("2026-11-01","00:00"), startTime: d("2026-11-01","20:20"), endTime: d("2026-11-01","23:30"), lat: 38.9077, lng: -76.8649, eventType: "NFL", description: "Sunday Night Football! Commanders vs Eagles." },

  // ── WASHINGTON DC: NBA/NHL ──────────────────────────────────────────
  { name: "Washington Wizards vs Boston Celtics", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: d("2026-10-28","00:00"), startTime: d("2026-10-28","19:00"), endTime: d("2026-10-28","21:30"), lat: 38.8981, lng: -77.0209, eventType: "NBA", description: "Wizards host the Celtics at Capital One Arena." },
  { name: "Washington Capitals vs Pittsburgh Penguins", venue: "Capital One Arena", city: "Washington", state: "DC", eventDate: d("2026-10-14","00:00"), startTime: d("2026-10-14","19:00"), endTime: d("2026-10-14","22:00"), lat: 38.8981, lng: -77.0209, eventType: "NHL", description: "Capitals vs Penguins rivalry game at Capital One Arena." },

  // ── WASHINGTON DC: MLB ──────────────────────────────────────────────
  { name: "Washington Nationals vs Atlanta Braves", venue: "Nationals Park", city: "Washington", state: "DC", eventDate: d("2026-09-04","00:00"), startTime: d("2026-09-04","19:05"), endTime: d("2026-09-04","22:00"), lat: 38.8730, lng: -77.0074, eventType: "MLB", description: "Nationals host the Braves at Nationals Park." },

  // ── MIAMI: NFL ──────────────────────────────────────────────────────
  { name: "Miami Dolphins vs Buffalo Bills", venue: "Hard Rock Stadium", city: "Miami", state: "FL", eventDate: d("2026-09-18","00:00"), startTime: d("2026-09-18","20:15"), endTime: d("2026-09-18","23:30"), lat: 25.9580, lng: -80.2389, eventType: "NFL", description: "Thursday Night Football! Dolphins host the Bills." },
  { name: "Miami Dolphins vs New England Patriots", venue: "Hard Rock Stadium", city: "Miami", state: "FL", eventDate: d("2026-11-09","00:00"), startTime: d("2026-11-09","13:00"), endTime: d("2026-11-09","16:00"), lat: 25.9580, lng: -80.2389, eventType: "NFL", description: "AFC East showdown. Dolphins host the Patriots." },

  // ── MIAMI: NBA ──────────────────────────────────────────────────────
  { name: "Miami Heat vs Los Angeles Lakers", venue: "Kaseya Center", city: "Miami", state: "FL", eventDate: d("2026-11-18","00:00"), startTime: d("2026-11-18","19:30"), endTime: d("2026-11-18","22:00"), lat: 25.7814, lng: -80.1870, eventType: "NBA", description: "Heat host the Lakers. Finals rematch at Kaseya Center." },

  // ── MIAMI: MLS ──────────────────────────────────────────────────────
  { name: "Inter Miami vs NYCFC", venue: "Chase Stadium", city: "Miami", state: "FL", eventDate: d("2026-08-16","00:00"), startTime: d("2026-08-16","19:30"), endTime: d("2026-08-16","21:30"), lat: 26.1929, lng: -80.1603, eventType: "MLS", description: "Inter Miami host NYCFC at Chase Stadium." },

  // ── ATLANTA: NFL ────────────────────────────────────────────────────
  { name: "Atlanta Falcons vs New Orleans Saints", venue: "Mercedes-Benz Stadium", city: "Atlanta", state: "GA", eventDate: d("2026-09-14","00:00"), startTime: d("2026-09-14","13:00"), endTime: d("2026-09-14","16:00"), lat: 33.7554, lng: -84.4010, eventType: "NFL", description: "NFC South clash. Falcons host the Saints at MBS." },
  { name: "Atlanta Falcons vs Tampa Bay Buccaneers", venue: "Mercedes-Benz Stadium", city: "Atlanta", state: "GA", eventDate: d("2026-11-22","00:00"), startTime: d("2026-11-22","13:00"), endTime: d("2026-11-22","16:00"), lat: 33.7554, lng: -84.4010, eventType: "NFL", description: "NFC South battle. Falcons vs Buccaneers." },

  // ── ATLANTA: MLB ────────────────────────────────────────────────────
  { name: "Atlanta Braves vs New York Mets", venue: "Truist Park", city: "Atlanta", state: "GA", eventDate: d("2026-08-01","00:00"), startTime: d("2026-08-01","19:20"), endTime: d("2026-08-01","22:00"), lat: 33.8907, lng: -84.4677, eventType: "MLB", description: "Braves host the Mets at Truist Park." },

  // ── ATLANTA: NBA ────────────────────────────────────────────────────
  { name: "Atlanta Hawks vs Milwaukee Bucks", venue: "State Farm Arena", city: "Atlanta", state: "GA", eventDate: d("2026-10-25","00:00"), startTime: d("2026-10-25","19:30"), endTime: d("2026-10-25","22:00"), lat: 33.7573, lng: -84.3963, eventType: "NBA", description: "Hawks host the Bucks at State Farm Arena." },

  // ── BOSTON: NFL ─────────────────────────────────────────────────────
  { name: "New England Patriots vs Buffalo Bills", venue: "Gillette Stadium", city: "Boston", state: "MA", eventDate: d("2026-09-20","00:00"), startTime: d("2026-09-20","13:00"), endTime: d("2026-09-20","16:00"), lat: 42.0909, lng: -71.2643, eventType: "NFL", description: "AFC East rivalry. Patriots host the Bills at Gillette." },
  { name: "New England Patriots vs Miami Dolphins", venue: "Gillette Stadium", city: "Boston", state: "MA", eventDate: d("2026-12-07","00:00"), startTime: d("2026-12-07","13:00"), endTime: d("2026-12-07","16:00"), lat: 42.0909, lng: -71.2643, eventType: "NFL", description: "Patriots host the Dolphins in a December showdown." },

  // ── BOSTON: NBA ─────────────────────────────────────────────────────
  { name: "Boston Celtics vs Los Angeles Lakers", venue: "TD Garden", city: "Boston", state: "MA", eventDate: d("2026-11-25","00:00"), startTime: d("2026-11-25","19:30"), endTime: d("2026-11-25","22:00"), lat: 42.3662, lng: -71.0621, eventType: "NBA", description: "The NBA's greatest rivalry. Celtics vs Lakers at TD Garden." },

  // ── BOSTON: MLB ─────────────────────────────────────────────────────
  { name: "Boston Red Sox vs New York Yankees", venue: "Fenway Park", city: "Boston", state: "MA", eventDate: d("2026-08-12","00:00"), startTime: d("2026-08-12","19:10"), endTime: d("2026-08-12","22:00"), lat: 42.3467, lng: -71.0972, eventType: "MLB", description: "Red Sox host the Yankees at Fenway Park. The rivalry continues." },

  // ── BOSTON: NHL ─────────────────────────────────────────────────────
  { name: "Boston Bruins vs Montreal Canadiens", venue: "TD Garden", city: "Boston", state: "MA", eventDate: d("2026-10-15","00:00"), startTime: d("2026-10-15","19:00"), endTime: d("2026-10-15","22:00"), lat: 42.3662, lng: -71.0621, eventType: "NHL", description: "The NHL's greatest rivalry. Bruins vs Canadiens at TD Garden." },

  // ── SAN FRANCISCO: NFL ──────────────────────────────────────────────
  { name: "San Francisco 49ers vs Seattle Seahawks", venue: "Levi's Stadium", city: "San Francisco", state: "CA", eventDate: d("2026-09-18","00:00"), startTime: d("2026-09-18","20:15"), endTime: d("2026-09-18","23:30"), lat: 37.4033, lng: -121.9694, eventType: "NFL", description: "Thursday Night Football! 49ers vs Seahawks at Levi's." },
  { name: "San Francisco 49ers vs Los Angeles Rams", venue: "Levi's Stadium", city: "San Francisco", state: "CA", eventDate: d("2026-11-09","00:00"), startTime: d("2026-11-09","16:25"), endTime: d("2026-11-09","19:30"), lat: 37.4033, lng: -121.9694, eventType: "NFL", description: "NFC West showdown. 49ers host the Rams." },

  // ── SAN FRANCISCO: MLB ──────────────────────────────────────────────
  { name: "San Francisco Giants vs Los Angeles Dodgers", venue: "Oracle Park", city: "San Francisco", state: "CA", eventDate: d("2026-08-05","00:00"), startTime: d("2026-08-05","19:15"), endTime: d("2026-08-05","22:00"), lat: 37.7786, lng: -122.3893, eventType: "MLB", description: "Giants host the Dodgers at Oracle Park. A storied rivalry." },

  // ── SAN FRANCISCO: NBA ──────────────────────────────────────────────
  { name: "Golden State Warriors vs Los Angeles Lakers", venue: "Chase Center", city: "San Francisco", state: "CA", eventDate: d("2026-11-12","00:00"), startTime: d("2026-11-12","19:30"), endTime: d("2026-11-12","22:00"), lat: 37.7680, lng: -122.3884, eventType: "NBA", description: "Warriors vs Lakers at Chase Center. California showdown." },

  // ── SEATTLE: NFL ────────────────────────────────────────────────────
  { name: "Seattle Seahawks vs San Francisco 49ers", venue: "Lumen Field", city: "Seattle", state: "WA", eventDate: d("2026-10-02","00:00"), startTime: d("2026-10-02","20:15"), endTime: d("2026-10-02","23:30"), lat: 47.5952, lng: -122.3316, eventType: "NFL", description: "Thursday Night Football! Seahawks host the 49ers at Lumen Field." },
  { name: "Seattle Seahawks vs Los Angeles Rams", venue: "Lumen Field", city: "Seattle", state: "WA", eventDate: d("2026-12-06","00:00"), startTime: d("2026-12-06","16:25"), endTime: d("2026-12-06","19:30"), lat: 47.5952, lng: -122.3316, eventType: "NFL", description: "Seahawks host the Rams at Lumen Field." },

  // ── SEATTLE: MLS ────────────────────────────────────────────────────
  { name: "Seattle Sounders vs Portland Timbers", venue: "Lumen Field", city: "Seattle", state: "WA", eventDate: d("2026-08-23","00:00"), startTime: d("2026-08-23","19:30"), endTime: d("2026-08-23","21:30"), lat: 47.5952, lng: -122.3316, eventType: "MLS", description: "Cascadia Cup! Sounders vs Timbers at Lumen Field." },

  // ── SEATTLE: MLB ────────────────────────────────────────────────────
  { name: "Seattle Mariners vs Houston Astros", venue: "T-Mobile Park", city: "Seattle", state: "WA", eventDate: d("2026-07-30","00:00"), startTime: d("2026-07-30","19:40"), endTime: d("2026-07-30","22:00"), lat: 47.5914, lng: -122.3325, eventType: "MLB", description: "Mariners host the Astros at T-Mobile Park." },

  // ── DENVER: NFL ─────────────────────────────────────────────────────
  { name: "Denver Broncos vs Kansas City Chiefs", venue: "Empower Field at Mile High", city: "Denver", state: "CO", eventDate: d("2026-10-12","00:00"), startTime: d("2026-10-12","16:25"), endTime: d("2026-10-12","19:30"), lat: 39.7439, lng: -105.0201, eventType: "NFL", description: "AFC West rivalry. Broncos host the Chiefs at Mile High." },
  { name: "Denver Broncos vs Las Vegas Raiders", venue: "Empower Field at Mile High", city: "Denver", state: "CO", eventDate: d("2026-11-23","00:00"), startTime: d("2026-11-23","13:00"), endTime: d("2026-11-23","16:00"), lat: 39.7439, lng: -105.0201, eventType: "NFL", description: "Broncos host the Raiders at Mile High." },

  // ── DENVER: MLB ─────────────────────────────────────────────────────
  { name: "Colorado Rockies vs Los Angeles Dodgers", venue: "Coors Field", city: "Denver", state: "CO", eventDate: d("2026-08-14","00:00"), startTime: d("2026-08-14","19:10"), endTime: d("2026-08-14","22:00"), lat: 39.7559, lng: -104.9942, eventType: "MLB", description: "Rockies host the Dodgers at Coors Field." },

  // ── DENVER: NBA ─────────────────────────────────────────────────────
  { name: "Denver Nuggets vs Los Angeles Lakers", venue: "Ball Arena", city: "Denver", state: "CO", eventDate: d("2026-11-07","00:00"), startTime: d("2026-11-07","21:00"), endTime: d("2026-11-07","23:30"), lat: 39.7487, lng: -105.0077, eventType: "NBA", description: "Nuggets host the Lakers at Ball Arena." },

  // ── MINNEAPOLIS: NFL ────────────────────────────────────────────────
  { name: "Minnesota Vikings vs Green Bay Packers", venue: "U.S. Bank Stadium", city: "Minneapolis", state: "MN", eventDate: d("2026-10-05","00:00"), startTime: d("2026-10-05","20:20"), endTime: d("2026-10-05","23:30"), lat: 44.9736, lng: -93.2575, eventType: "NFL", description: "Sunday Night Football! Vikings host the Packers at U.S. Bank Stadium." },

  // ── MINNEAPOLIS: NBA ────────────────────────────────────────────────
  { name: "Minnesota Timberwolves vs Boston Celtics", venue: "Target Center", city: "Minneapolis", state: "MN", eventDate: d("2026-12-06","00:00"), startTime: d("2026-12-06","19:00"), endTime: d("2026-12-06","21:30"), lat: 44.9795, lng: -93.2761, eventType: "NBA", description: "Timberwolves host the Celtics at Target Center." },

  // ── MINNEAPOLIS: MLB ────────────────────────────────────────────────
  { name: "Minnesota Twins vs Chicago White Sox", venue: "Target Field", city: "Minneapolis", state: "MN", eventDate: d("2026-07-25","00:00"), startTime: d("2026-07-25","19:10"), endTime: d("2026-07-25","22:00"), lat: 44.9817, lng: -93.2776, eventType: "MLB", description: "Twins host the White Sox at Target Field." },

  // ── PHOENIX: NFL ────────────────────────────────────────────────────
  { name: "Arizona Cardinals vs San Francisco 49ers", venue: "State Farm Stadium", city: "Phoenix", state: "AZ", eventDate: d("2026-09-21","00:00"), startTime: d("2026-09-21","13:00"), endTime: d("2026-09-21","16:00"), lat: 33.5276, lng: -112.2636, eventType: "NFL", description: "Cardinals host the 49ers at State Farm Stadium." },

  // ── PHOENIX: MLB ────────────────────────────────────────────────────
  { name: "Arizona Diamondbacks vs Los Angeles Dodgers", venue: "Chase Field", city: "Phoenix", state: "AZ", eventDate: d("2026-08-28","00:00"), startTime: d("2026-08-28","19:40"), endTime: d("2026-08-28","22:00"), lat: 33.4455, lng: -112.0667, eventType: "MLB", description: "D-backs host the Dodgers at Chase Field." },

  // ── PHOENIX: NBA ────────────────────────────────────────────────────
  { name: "Phoenix Suns vs Los Angeles Lakers", venue: "Footprint Center", city: "Phoenix", state: "AZ", eventDate: d("2026-10-22","00:00"), startTime: d("2026-10-22","19:00"), endTime: d("2026-10-22","21:30"), lat: 33.4457, lng: -112.0712, eventType: "NBA", description: "Suns host the Lakers at Footprint Center." },

  // ── DETROIT: NFL ────────────────────────────────────────────────────
  { name: "Detroit Lions vs Green Bay Packers", venue: "Ford Field", city: "Detroit", state: "MI", eventDate: d("2026-09-28","00:00"), startTime: d("2026-09-28","20:15"), endTime: d("2026-09-28","23:30"), lat: 42.3400, lng: -83.0456, eventType: "NFL", description: "Monday Night Football! Lions host the Packers at Ford Field." },
  { name: "Detroit Lions vs Minnesota Vikings", venue: "Ford Field", city: "Detroit", state: "MI", eventDate: d("2026-11-16","00:00"), startTime: d("2026-11-16","13:00"), endTime: d("2026-11-16","16:00"), lat: 42.3400, lng: -83.0456, eventType: "NFL", description: "NFC North clash. Lions host the Vikings." },

  // ── DETROIT: MLB ────────────────────────────────────────────────────
  { name: "Detroit Tigers vs Cleveland Guardians", venue: "Comerica Park", city: "Detroit", state: "MI", eventDate: d("2026-07-26","00:00"), startTime: d("2026-07-26","13:40"), endTime: d("2026-07-26","17:00"), lat: 42.3390, lng: -83.0485, eventType: "MLB", description: "Tigers host the Guardians at Comerica Park." },

  // ── DETROIT: NHL ────────────────────────────────────────────────────
  { name: "Detroit Red Wings vs Chicago Blackhawks", venue: "Little Caesars Arena", city: "Detroit", state: "MI", eventDate: d("2026-11-08","00:00"), startTime: d("2026-11-08","17:00"), endTime: d("2026-11-08","20:00"), lat: 42.3411, lng: -83.0553, eventType: "NHL", description: "Original Six rivalry. Red Wings host the Blackhawks." },

  // ── LAS VEGAS: NFL ──────────────────────────────────────────────────
  { name: "Las Vegas Raiders vs Kansas City Chiefs", venue: "Allegiant Stadium", city: "Las Vegas", state: "NV", eventDate: d("2026-10-19","00:00"), startTime: d("2026-10-19","13:00"), endTime: d("2026-10-19","16:30"), lat: 36.0908, lng: -115.1833, eventType: "NFL", description: "Raiders host the Chiefs at Allegiant Stadium." },
  { name: "Las Vegas Raiders vs Los Angeles Chargers", venue: "Allegiant Stadium", city: "Las Vegas", state: "NV", eventDate: d("2026-12-04","00:00"), startTime: d("2026-12-04","20:15"), endTime: d("2026-12-04","23:30"), lat: 36.0908, lng: -115.1833, eventType: "NFL", description: "Thursday Night Football! Raiders vs Chargers at Allegiant." },

  // ── TAMPA: NFL ──────────────────────────────────────────────────────
  { name: "Tampa Bay Buccaneers vs Atlanta Falcons", venue: "Raymond James Stadium", city: "Tampa", state: "FL", eventDate: d("2026-09-14","00:00"), startTime: d("2026-09-14","13:00"), endTime: d("2026-09-14","16:00"), lat: 27.9759, lng: -82.5033, eventType: "NFL", description: "Buccaneers host the Falcons at Raymond James." },
  { name: "Tampa Bay Buccaneers vs Green Bay Packers", venue: "Raymond James Stadium", city: "Tampa", state: "FL", eventDate: d("2026-11-22","00:00"), startTime: d("2026-11-22","20:20"), endTime: d("2026-11-22","23:30"), lat: 27.9759, lng: -82.5033, eventType: "NFL", description: "Sunday Night Football! Buccaneers host the Packers." },

  // ── TAMPA: NHL ──────────────────────────────────────────────────────
  { name: "Tampa Bay Lightning vs Toronto Maple Leafs", venue: "Amalie Arena", city: "Tampa", state: "FL", eventDate: d("2026-10-16","00:00"), startTime: d("2026-10-16","19:00"), endTime: d("2026-10-16","22:00"), lat: 27.9427, lng: -82.4519, eventType: "NHL", description: "Lightning host the Maple Leafs at Amalie Arena." },

  // ── NASHVILLE: NFL ──────────────────────────────────────────────────
  { name: "Tennessee Titans vs Indianapolis Colts", venue: "Nissan Stadium", city: "Nashville", state: "TN", eventDate: d("2026-09-14","00:00"), startTime: d("2026-09-14","13:00"), endTime: d("2026-09-14","16:00"), lat: 36.1664, lng: -86.7713, eventType: "NFL", description: "AFC South showdown. Titans host the Colts at Nissan Stadium." },

  // ── NASHVILLE: NHL ──────────────────────────────────────────────────
  { name: "Nashville Predators vs Chicago Blackhawks", venue: "Bridgestone Arena", city: "Nashville", state: "TN", eventDate: d("2026-10-10","00:00"), startTime: d("2026-10-10","19:00"), endTime: d("2026-10-10","22:00"), lat: 36.1590, lng: -86.7786, eventType: "NHL", description: "Predators host the Blackhawks at Bridgestone Arena." },

  // ── PORTLAND: MLS ───────────────────────────────────────────────────
  { name: "Portland Timbers vs Seattle Sounders", venue: "Providence Park", city: "Portland", state: "OR", eventDate: d("2026-08-20","00:00"), startTime: d("2026-08-20","19:30"), endTime: d("2026-08-20","21:30"), lat: 45.5219, lng: -122.6915, eventType: "MLS", description: "Cascadia Cup! Timbers host the Sounders at Providence Park." },

  // ── PORTLAND: NBA ───────────────────────────────────────────────────
  { name: "Portland Trail Blazers vs Golden State Warriors", venue: "Moda Center", city: "Portland", state: "OR", eventDate: d("2026-11-15","00:00"), startTime: d("2026-11-15","19:00"), endTime: d("2026-11-15","21:30"), lat: 45.5316, lng: -122.6668, eventType: "NBA", description: "Trail Blazers host the Warriors at Moda Center." },

  // ── WASHINGTON DC: MLS ──────────────────────────────────────────────
  { name: "DC United vs Inter Miami", venue: "Audi Field", city: "Washington", state: "DC", eventDate: d("2026-09-13","00:00"), startTime: d("2026-09-13","19:30"), endTime: d("2026-09-13","21:30"), lat: 38.8686, lng: -77.0128, eventType: "MLS", description: "DC United host Messi and Inter Miami at Audi Field." },

  // ── CHICAGO: MLS ────────────────────────────────────────────────────
  { name: "Chicago Fire vs Inter Miami", venue: "Soldier Field", city: "Chicago", state: "IL", eventDate: d("2026-08-27","00:00"), startTime: d("2026-08-27","19:30"), endTime: d("2026-08-27","21:30"), lat: 41.8623, lng: -87.6167, eventType: "MLS", description: "Fire host Inter Miami at Soldier Field." },

  // ── CONCERTS & SPECIAL EVENTS ──────────────────────────────────────
  { name: "Taylor Swift: Eras Tour 2026", venue: "MetLife Stadium", city: "New York", state: "NY", eventDate: d("2026-08-15","00:00"), startTime: d("2026-08-15","19:00"), endTime: d("2026-08-15","23:30"), lat: 40.8135, lng: -74.0745, eventType: "Concert", description: "Taylor Swift brings the Eras Tour back to MetLife Stadium." },
  { name: "Beyonce: Renaissance World Tour 2026", venue: "SoFi Stadium", city: "Los Angeles", state: "CA", eventDate: d("2026-09-05","00:00"), startTime: d("2026-09-05","19:30"), endTime: d("2026-09-05","23:00"), lat: 33.9535, lng: -118.3392, eventType: "Concert", description: "Beyonce's Renaissance World Tour at SoFi Stadium." },
  { name: "Ed Sheeran: Mathematics Tour", venue: "Soldier Field", city: "Chicago", state: "IL", eventDate: d("2026-07-29","00:00"), startTime: d("2026-07-29","19:00"), endTime: d("2026-07-29","22:30"), lat: 41.8623, lng: -87.6167, eventType: "Concert", description: "Ed Sheeran's Mathematics Tour stops at Soldier Field." },
  { name: "Garth Brooks: Stadium Tour", venue: "AT&T Stadium", city: "Dallas", state: "TX", eventDate: d("2026-08-22","00:00"), startTime: d("2026-08-22","19:00"), endTime: d("2026-08-22","23:00"), lat: 32.7473, lng: -97.0945, eventType: "Concert", description: "Garth Brooks brings his Stadium Tour to AT&T Stadium." },
  { name: "Bad Bunny: Most Wanted Tour 2026", venue: "Hard Rock Stadium", city: "Miami", state: "FL", eventDate: d("2026-10-10","00:00"), startTime: d("2026-10-10","20:00"), endTime: d("2026-10-10","23:30"), lat: 25.9580, lng: -80.2389, eventType: "Concert", description: "Bad Bunny's Most Wanted Tour at Hard Rock Stadium." },
  { name: "Morgan Wallen: Stadium Tour", venue: "Nissan Stadium", city: "Nashville", state: "TN", eventDate: d("2026-09-12","00:00"), startTime: d("2026-09-12","19:00"), endTime: d("2026-09-12","23:00"), lat: 36.1664, lng: -86.7713, eventType: "Concert", description: "Morgan Wallen's Stadium Tour at Nissan Stadium in Nashville." },
  { name: "The Weeknd: After Hours Til Dawn Tour", venue: "MetLife Stadium", city: "New York", state: "NY", eventDate: d("2026-09-26","00:00"), startTime: d("2026-09-26","19:30"), endTime: d("2026-09-26","23:00"), lat: 40.8135, lng: -74.0745, eventType: "Concert", description: "The Weeknd at MetLife Stadium. Massive production." },
  { name: "Coldplay: Music of the Spheres Tour", venue: "Levi's Stadium", city: "San Francisco", state: "CA", eventDate: d("2026-10-03","00:00"), startTime: d("2026-10-03","19:00"), endTime: d("2026-10-03","22:30"), lat: 37.4033, lng: -121.9694, eventType: "Concert", description: "Coldplay brings the Music of the Spheres Tour to Levi's Stadium." },
  { name: "Kendrick Lamar: Stadium Tour", venue: "Empower Field at Mile High", city: "Denver", state: "CO", eventDate: d("2026-08-08","00:00"), startTime: d("2026-08-08","19:30"), endTime: d("2026-08-08","23:00"), lat: 39.7439, lng: -105.0201, eventType: "Concert", description: "Kendrick Lamar's Stadium Tour at Empower Field." },
  { name: "Zach Bryan: The Quittin Time Tour", venue: "Empower Field at Mile High", city: "Denver", state: "CO", eventDate: d("2026-07-25","00:00"), startTime: d("2026-07-25","19:00"), endTime: d("2026-07-25","22:30"), lat: 39.7439, lng: -105.0201, eventType: "Concert", description: "Zach Bryan's Quittin Time Tour at Mile High." },
  { name: "Zach Bryan: The Quittin Time Tour", venue: "Allegiant Stadium", city: "Las Vegas", state: "NV", eventDate: d("2026-08-15","00:00"), startTime: d("2026-08-15","19:00"), endTime: d("2026-08-15","22:30"), lat: 36.0908, lng: -115.1833, eventType: "Concert", description: "Zach Bryan brings the Quittin Time Tour to Las Vegas." },
  { name: "Luke Combs: Growin' Up and Gettin' Old Tour", venue: "MetLife Stadium", city: "New York", state: "NY", eventDate: d("2026-07-25","00:00"), startTime: d("2026-07-25","19:00"), endTime: d("2026-07-25","22:30"), lat: 40.8135, lng: -74.0745, eventType: "Concert", description: "Luke Combs at MetLife Stadium. Two nights only." },
];

// ─── MAIN SEED FUNCTION ──────────────────────────────────────────────────────

async function main() {
  console.log("Seeding database...\n");

  // 1. Create cities
  console.log("Creating cities...");
  const cityMap: Record<string, string> = {};
  const cityRecords = cities.map((city) => {
    const id = city.slug;
    cityMap[`${city.name}, ${city.state}`] = id;
    return { id, ...city };
  });
  await prisma.city.createMany({ data: cityRecords });
  console.log(`  ✓ ${cityRecords.length} cities created`);

  // 2. Create venues
  console.log("\nCreating venues...");
  const venueRecords: { id: string; name: string; cityId: string; address: string; lat: number; lng: number; venueType: string; capacity: number }[] = [];
  for (const venue of venues) {
    const id = slugify(venue.name);
    const cityId = cityMap[`${venue.city}, ${venue.state}`];
    if (!cityId) {
      console.log(`  ✗ Skipping ${venue.name} — city not found`);
      continue;
    }
    venueRecords.push({ id, name: venue.name, cityId, address: venue.address, lat: venue.lat, lng: venue.lng, venueType: venue.venueType, capacity: venue.capacity });
  }
  await prisma.venue.createMany({ data: venueRecords });
  console.log(`  ✓ ${venueRecords.length} venues created`);

  // 3. Create events (batch insert)
  console.log("\nCreating events...");
  const eventRecords = events.map((event) => {
    const id = slugify(event.name) + "-" + event.eventDate.toISOString().slice(0, 10);
    const cityId = cityMap[`${event.city}, ${event.state}`];
    const venueId = slugify(event.venue);
    return {
      id,
      name: event.name,
      venue: event.venue,
      city: event.city,
      state: event.state,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      lat: event.lat,
      lng: event.lng,
      eventType: event.eventType,
      description: event.description,
      cityId: cityId || null,
      venueId: venueId || null,
    };
  });
  await prisma.event.createMany({ data: eventRecords });
  console.log(`  ✓ ${eventRecords.length} events created`);

  // 4. Create seed owner and sample listings
  console.log("\nCreating sample listings...");
  await prisma.user.upsert({
    where: { id: "seed-owner-1" },
    update: {},
    create: {
      id: "seed-owner-1",
      email: "owner@parkit-demo.com",
      name: "Demo Parking Owner",
      role: "OWNER",
    },
  });

  async function geocode(address: string, city: string, state: string, zipCode: string): Promise<{ lat: number; lng: number }> {
    const query = encodeURIComponent(`${address}, ${city}, ${state} ${zipCode}`);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
        headers: { "User-Agent": "ParkIt/1.0" },
      });
      const data = await res.json();
      if (data && data[0]) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch {}
    return { lat: 0, lng: 0 };
  }

  const rawListings = [
    { title: "Driveway Steps from MetLife Stadium", description: "Private driveway 5-minute walk to MetLife Stadium. Fits 2 cars. Paved and well-lit.", address: "200 Paterson Plank Rd", city: "New York", state: "NY", zipCode: "07087", pricePerHour: 20, capacity: 2, cityId: cityMap["New York, NY"] },
    { title: "Covered Garage - Near MSG", description: "Private garage spot 2 blocks from Madison Square Garden. Secure and covered.", address: "250 W 31st St", city: "New York", state: "NY", zipCode: "10001", pricePerHour: 30, capacity: 1, cityId: cityMap["New York, NY"] },
    { title: "SoFi Stadium Parking Lot", description: "Large lot steps from SoFi Stadium. Fits 4 cars. Easy access from I-405.", address: "3800 W Century Blvd", city: "Los Angeles", state: "CA", zipCode: "90303", pricePerHour: 25, capacity: 4, cityId: cityMap["Los Angeles, CA"] },
    { title: "Dodger Stadium Neighborhood Spot", description: "Driveway in Elysian Park, 10-minute walk to Dodger Stadium. Fits 2 cars.", address: "1800 Park Dr", city: "Los Angeles", state: "CA", zipCode: "90026", pricePerHour: 18, capacity: 2, cityId: cityMap["Los Angeles, CA"] },
    { title: "Wrigleyville Private Lot", description: "Private lot in Wrigleyville, 3-minute walk to Wrigley Field. Fits 3 cars.", address: "1010 W Addison St", city: "Chicago", state: "IL", zipCode: "60613", pricePerHour: 22, capacity: 3, cityId: cityMap["Chicago, IL"] },
    { title: "AT&T Stadium Area Parking", description: "Open lot near AT&T Stadium. Easy in/out from I-30. Fits 5 cars.", address: "1200 S Collins St", city: "Dallas", state: "TX", zipCode: "76010", pricePerHour: 15, capacity: 5, cityId: cityMap["Dallas, TX"] },
    { title: "Lincoln Financial Field Lot", description: "Private lot near the Linc. Walking distance to the stadium. Fits 3 cars.", address: "1500 Broad St", city: "Philadelphia", state: "PA", zipCode: "19119", pricePerHour: 16, capacity: 3, cityId: cityMap["Philadelphia, PA"] },
    { title: "Ford Field Garage Spot", description: "Covered garage near Ford Field. 5-minute walk. Secure with keycard.", address: "500 Woodward Ave", city: "Detroit", state: "MI", zipCode: "48226", pricePerHour: 20, capacity: 1, cityId: cityMap["Detroit, MI"] },
    { title: "Empower Field Driveway", description: "Driveway near Mile High. Quick walk to the stadium. Fits 2 cars.", address: "2000 Bryant St", city: "Denver", state: "CO", zipCode: "80211", pricePerHour: 18, capacity: 2, cityId: cityMap["Denver, CO"] },
    { title: "Lumen Field Parking Spot", description: "Private spot near Lumen Field. 4-minute walk. Perfect for Seahawks games.", address: "400 Occidental Ave S", city: "Seattle", state: "WA", zipCode: "98104", pricePerHour: 22, capacity: 1, cityId: cityMap["Seattle, WA"] },
    { title: "Boat Trailer Parking - Fort Monroe", description: "Secure lot near Fort Monroe boat ramp. Fits 1 trailer up to 30ft. Gravel surface, well-lit, easy water access.", address: "60 S Landing Rd", city: "Hampton", state: "VA", zipCode: "23651", pricePerDay: 10, capacity: 1, cityId: cityMap["Hampton, VA"], parkingType: "BOAT" },
    { title: "Boat & RV Lot - Virginia Beach Oceanfront", description: "Spacious lot near the Virginia Beach boat ramp. Fits trailers up to 40ft. Paved, gated, 24hr access.", address: "1200 Atlantic Ave", city: "Virginia Beach", state: "VA", zipCode: "23451", pricePerDay: 15, capacity: 2, cityId: cityMap["Virginia Beach, VA"], parkingType: "BOAT" },
  ];

  const sampleListings = [];
  for (const listing of rawListings) {
    const coords = await geocode(listing.address, listing.city, listing.state, listing.zipCode);
    await new Promise((r) => setTimeout(r, 1100));
    sampleListings.push({ ...listing, lat: coords.lat, lng: coords.lng });
  }

  const listingRecords = sampleListings.map((listing) => ({
    id: slugify(listing.title),
    ownerId: "seed-owner-1",
    ...listing,
    photos: "[]",
  }));
  await prisma.listing.createMany({ data: listingRecords });
  console.log(`  ✓ ${listingRecords.length} sample listings created`);

  console.log(`\n✅ Seed complete!`);
  console.log(`   ${cityRecords.length} cities`);
  console.log(`   ${venueRecords.length} venues`);
  console.log(`   ${eventRecords.length} events`);
  console.log(`   ${listingRecords.length} sample listings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
