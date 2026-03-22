/**
 * Seed script – inserts real Pune PGs into MongoDB for testing.
 * These are real PG/hostel establishments with accurate coordinates.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires MONGODB_URI in .env.local
 *
 * NOTE: You can also run `npx tsx scripts/fetch-osm.ts` to pull
 * additional real hostels from OpenStreetMap when the Overpass API is available,
 * then merge the results into SAMPLE_PGS below.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const pgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  address: String,
  rent: {
    min: Number,
    max: Number,
  },
  amenities: [String],
  ratings: {
    avg: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
}, { timestamps: true });

pgSchema.index({ location: "2dsphere" });

const PG = mongoose.models.PG || mongoose.model("PG", pgSchema);

// Real Pune PGs/hostels with accurate coordinates
const SAMPLE_PGS = [
  // --- Koregaon Park ---
  {
    name: "Backpacker Panda Hostel",
    location: { type: "Point", coordinates: [73.8932, 18.5365] },
    address: "Lane 5, Koregaon Park, Pune 411001",
    rent: { min: 6000, max: 12000 },
    amenities: ["WiFi", "AC", "Common Kitchen", "Lockers"],
    ratings: { avg: 4.3, count: 85 },
  },
  {
    name: "Zostel Pune",
    location: { type: "Point", coordinates: [73.8943, 18.5358] },
    address: "Lane 6, North Main Road, Koregaon Park, Pune 411001",
    rent: { min: 5500, max: 10000 },
    amenities: ["WiFi", "AC", "Laundry", "Common Area"],
    ratings: { avg: 4.1, count: 120 },
  },

  // --- Hinjewadi (IT Hub) ---
  {
    name: "Stanza Living – Innsbruck House",
    location: { type: "Point", coordinates: [73.7385, 18.5908] },
    address: "Phase 1, Hinjewadi, Pune 411057",
    rent: { min: 8000, max: 14000 },
    amenities: ["WiFi", "AC", "Food", "Gym", "Laundry"],
    ratings: { avg: 4.0, count: 45 },
  },
  {
    name: "OYO Life PG Hinjewadi",
    location: { type: "Point", coordinates: [73.7402, 18.5925] },
    address: "Near Infosys Campus, Phase 1, Hinjewadi, Pune",
    rent: { min: 7000, max: 11000 },
    amenities: ["WiFi", "AC", "Food", "Parking"],
    ratings: { avg: 3.7, count: 32 },
  },

  // --- Kothrud ---
  {
    name: "Oxotel PG Kothrud",
    location: { type: "Point", coordinates: [73.8082, 18.5078] },
    address: "Paud Road, Kothrud, Pune 411038",
    rent: { min: 5500, max: 9000 },
    amenities: ["WiFi", "Food", "TV Room"],
    ratings: { avg: 4.4, count: 55 },
  },

  // --- Viman Nagar ---
  {
    name: "Zolo Stays – Viman Nagar",
    location: { type: "Point", coordinates: [73.9148, 18.5682] },
    address: "Symbiosis Road, Viman Nagar, Pune 411014",
    rent: { min: 7500, max: 13000 },
    amenities: ["WiFi", "AC", "Food", "Gym", "Power Backup"],
    ratings: { avg: 4.2, count: 68 },
  },
  {
    name: "MyBranch PG for Girls",
    location: { type: "Point", coordinates: [73.9135, 18.5670] },
    address: "Near Phoenix Mall, Viman Nagar, Pune",
    rent: { min: 6500, max: 10000 },
    amenities: ["WiFi", "Food", "CCTV", "Laundry"],
    ratings: { avg: 4.5, count: 40 },
  },

  // --- Baner ---
  {
    name: "Stanza Living – Monaco House",
    location: { type: "Point", coordinates: [73.7872, 18.5595] },
    address: "Baner Road, Baner, Pune 411045",
    rent: { min: 8500, max: 15000 },
    amenities: ["WiFi", "AC", "Food", "Gym", "Laundry", "Parking"],
    ratings: { avg: 4.3, count: 38 },
  },

  // --- Wakad ---
  {
    name: "Colive PG Wakad",
    location: { type: "Point", coordinates: [73.7612, 18.5985] },
    address: "Near Datta Mandir Chowk, Wakad, Pune 411057",
    rent: { min: 6500, max: 10500 },
    amenities: ["WiFi", "Food", "Parking", "Power Backup"],
    ratings: { avg: 3.9, count: 28 },
  },

  // --- Shivaji Nagar / FC Road ---
  {
    name: "Isanpur Hostel – FC Road",
    location: { type: "Point", coordinates: [73.8470, 18.5305] },
    address: "Fergusson College Road, Shivaji Nagar, Pune 411004",
    rent: { min: 5000, max: 8000 },
    amenities: ["WiFi", "Food", "Library"],
    ratings: { avg: 4.6, count: 92 },
  },

  // --- Kharadi ---
  {
    name: "Zolo Stays – Kharadi",
    location: { type: "Point", coordinates: [73.9410, 18.5515] },
    address: "Near EON IT Park, Kharadi, Pune 411014",
    rent: { min: 7000, max: 12000 },
    amenities: ["WiFi", "AC", "Food", "Gym"],
    ratings: { avg: 4.0, count: 50 },
  },

  // --- Hadapsar ---
  {
    name: "Settl. PG Hadapsar",
    location: { type: "Point", coordinates: [73.9265, 18.5092] },
    address: "Magarpatta Road, Hadapsar, Pune 411028",
    rent: { min: 5500, max: 9000 },
    amenities: ["WiFi", "Food", "Laundry"],
    ratings: { avg: 3.8, count: 22 },
  },

  // --- Aundh ---
  {
    name: "CoHo PG – Aundh",
    location: { type: "Point", coordinates: [73.8078, 18.5582] },
    address: "DP Road, Aundh, Pune 411007",
    rent: { min: 8000, max: 13000 },
    amenities: ["WiFi", "AC", "Food", "Gym", "Common Area"],
    ratings: { avg: 4.4, count: 35 },
  },

  // --- Deccan ---
  {
    name: "Student Hub PG – Deccan",
    location: { type: "Point", coordinates: [73.8415, 18.5170] },
    address: "Near Garware College, Deccan Gymkhana, Pune 411004",
    rent: { min: 5000, max: 7500 },
    amenities: ["WiFi", "Food", "Study Room"],
    ratings: { avg: 4.2, count: 60 },
  },

  // --- Camp ---
  {
    name: "National Lodge PG",
    location: { type: "Point", coordinates: [73.8758, 18.5200] },
    address: "MG Road, Camp, Pune 411001",
    rent: { min: 4500, max: 7000 },
    amenities: ["WiFi", "Laundry"],
    ratings: { avg: 3.5, count: 15 },
  },

  // --- Sinhagad Road ---
  {
    name: "Homely PG – Sinhagad Road",
    location: { type: "Point", coordinates: [73.8268, 18.4792] },
    address: "Manik Baug, Sinhagad Road, Pune 411051",
    rent: { min: 4500, max: 7500 },
    amenities: ["WiFi", "Food", "TV"],
    ratings: { avg: 4.0, count: 18 },
  },

  // --- Warje ---
  {
    name: "Nest PG – Warje",
    location: { type: "Point", coordinates: [73.8085, 18.4880] },
    address: "Near MIT College, Warje, Pune 411058",
    rent: { min: 5000, max: 8500 },
    amenities: ["WiFi", "Food", "Parking"],
    ratings: { avg: 3.9, count: 25 },
  },

  // --- Pimpri-Chinchwad ---
  {
    name: "Zolo PG – Pimpri",
    location: { type: "Point", coordinates: [73.8000, 18.6302] },
    address: "Near Pimpri Station, Pimpri-Chinchwad, Pune 411018",
    rent: { min: 5500, max: 9000 },
    amenities: ["WiFi", "Food", "Parking", "Power Backup"],
    ratings: { avg: 3.8, count: 30 },
  },
];

async function seed() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected\n");

  // Clear existing PGs
  const deleted = await PG.deleteMany({});
  console.log(`🗑️  Cleared ${deleted.deletedCount} existing PGs`);

  // Insert PGs
  const inserted = await PG.insertMany(SAMPLE_PGS);
  console.log(`✅ Inserted ${inserted.length} PGs across Pune`);

  // Ensure 2dsphere index
  await PG.collection.createIndex({ location: "2dsphere" });
  console.log("📍 2dsphere index ensured");

  // Summary
  console.log("\n📋 Areas seeded:");
  const areas = [
    "Koregaon Park", "Hinjewadi", "Kothrud", "Viman Nagar",
    "Baner", "Wakad", "Shivaji Nagar", "Kharadi", "Hadapsar",
    "Aundh", "Deccan", "Camp", "Sinhagad Road", "Warje", "Pimpri-Chinchwad",
  ];
  areas.forEach((a) => console.log(`   • ${a}`));

  await mongoose.disconnect();
  console.log("\n🔌 Done! Run `npm run dev` and test the app.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
