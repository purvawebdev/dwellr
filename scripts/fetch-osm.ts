/**
 * Fetch real hostel/PG data from OSM Overpass API for Pune.
 * Uses bounding box instead of area lookup for faster response.
 *
 * Usage: npx tsx scripts/fetch-osm.ts
 */

// Pune bounding box (approx)
const SOUTH = 18.40;
const WEST = 73.70;
const NORTH = 18.65;
const EAST = 74.00;

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const QUERY = `
[out:json][timeout:25];
(
  node["tourism"="hostel"](${SOUTH},${WEST},${NORTH},${EAST});
  node["tourism"="guest_house"](${SOUTH},${WEST},${NORTH},${EAST});
  node["building"="hostel"](${SOUTH},${WEST},${NORTH},${EAST});
);
out body;
`;

interface OverpassElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

async function fetchPuneHostels() {
  console.log("🔍 Querying Overpass API for hostels/PGs in Pune...");
  console.log(`   Bounding box: [${SOUTH},${WEST},${NORTH},${EAST}]\n`);

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(QUERY)}`,
  });

  if (!res.ok) {
    console.error(`❌ API failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const data: OverpassResponse = await res.json();
  console.log(`✅ Found ${data.elements.length} results from OSM\n`);

  if (data.elements.length === 0) {
    console.log("⚠️  No results found. OSM may not have PG data for this area.");
    console.log("   The seed script already has manually curated real PGs as fallback.");
    process.exit(0);
  }

  const pgs = data.elements
    .filter((el) => el.lat && el.lon)
    .map((el) => ({
      name: el.tags?.name || el.tags?.["name:en"] || `Hostel (OSM #${el.id})`,
      location: {
        type: "Point" as const,
        coordinates: [
          parseFloat(el.lon.toFixed(6)),
          parseFloat(el.lat.toFixed(6)),
        ],
      },
      address: [
        el.tags?.["addr:housenumber"],
        el.tags?.["addr:street"],
        el.tags?.["addr:city"] || "Pune",
      ]
        .filter(Boolean)
        .join(", ") || "Pune, Maharashtra",
      rent: { min: 5000, max: 12000 },
      amenities: ["WiFi"],
      ratings: { avg: 0, count: 0 },
    }));

  console.log("--- Copy this array into SAMPLE_PGS in scripts/seed.ts ---\n");
  console.log(JSON.stringify(pgs, null, 2));
  console.log(`\n--- ${pgs.length} entries ---`);
}

fetchPuneHostels().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
