import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "storage", "db.sqlite");
const db = new Database(dbPath);

const andreClothing = [
  {
    name: "Cyber Jacket",
    category: "clothing",
    price: 150,
    description: "Futuristic cyber jacket by Andre Ferwerda",
    thumbnailUrl: "https://placehold.co/300x300/1F2937/E1E7EF?text=Cyber+Jacket",
    artist: "Andre Ferwerda",
  },
  {
    name: "Urban Streetwear",
    category: "clothing",
    price: 120,
    description: "Modern urban streetwear collection by Andre Ferwerda",
    thumbnailUrl: "https://placehold.co/300x300/1F2937/E1E7EF?text=Urban+Streetwear",
    artist: "Andre Ferwerda",
  },
  {
    name: "Futuristic Suit",
    category: "clothing",
    price: 200,
    description: "Premium futuristic suit by Andre Ferwerda",
    thumbnailUrl: "https://placehold.co/300x300/1F2937/E1E7EF?text=Futuristic+Suit",
    artist: "Andre Ferwerda",
  },
  {
    name: "Casual Wear",
    category: "clothing",
    price: 100,
    description: "Comfortable casual wear by Andre Ferwerda",
    thumbnailUrl: "https://placehold.co/300x300/1F2937/E1E7EF?text=Casual+Wear",
    artist: "Andre Ferwerda",
  },
  {
    name: "Evening Dress",
    category: "clothing",
    price: 180,
    description: "Elegant evening dress by Andre Ferwerda",
    thumbnailUrl: "https://placehold.co/300x300/1F2937/E1E7EF?text=Evening+Dress",
    artist: "Andre Ferwerda",
  },
  {
    name: "Tactical Gear",
    category: "clothing",
    price: 160,
    description: "Professional tactical gear by Andre Ferwerda",
    thumbnailUrl: "https://placehold.co/300x300/1F2937/E1E7EF?text=Tactical+Gear",
    artist: "Andre Ferwerda",
  },
];

try {
  console.log("Adding Andre Ferwerda's clothing items...");

  for (const item of andreClothing) {
    db.prepare(
      `INSERT INTO store_items (name, category, price, description, thumbnailUrl, artist)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      item.name,
      item.category,
      item.price,
      item.description,
      item.thumbnailUrl,
      item.artist
    );
  }

  console.log(`✓ Added ${andreClothing.length} clothing items for Andre Ferwerda`);
} catch (error) {
  console.error("Error seeding Andre Ferwerda's clothing:", error);
  process.exit(1);
}
