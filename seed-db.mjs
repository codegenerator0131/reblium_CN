import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log("Starting database seed...");

// Seed credit packs
console.log("Seeding credit packs...");
await db.execute(`
  INSERT INTO creditPacks (credits, priceUSD, isActive) VALUES
  (10, 990, 1),
  (50, 4490, 1),
  (100, 7990, 1),
  (500, 34990, 1),
  (1000, 59990, 1)
  ON DUPLICATE KEY UPDATE credits=credits
`);

// Seed template avatars with placeholder images
console.log("Seeding template avatars...");
await db.execute(`
  INSERT INTO templateAvatars (name, thumbnailUrl, thumbnailKey, description) VALUES
  ('Professional Female', 'https://api.dicebear.com/7.x/avataaars/svg?seed=female1', 'templates/female1.svg', 'Professional female avatar template'),
  ('Professional Male', 'https://api.dicebear.com/7.x/avataaars/svg?seed=male1', 'templates/male1.svg', 'Professional male avatar template'),
  ('Casual Female', 'https://api.dicebear.com/7.x/avataaars/svg?seed=female2', 'templates/female2.svg', 'Casual female avatar template'),
  ('Casual Male', 'https://api.dicebear.com/7.x/avataaars/svg?seed=male2', 'templates/male2.svg', 'Casual male avatar template'),
  ('Business Female', 'https://api.dicebear.com/7.x/avataaars/svg?seed=female3', 'templates/female3.svg', 'Business female avatar template'),
  ('Business Male', 'https://api.dicebear.com/7.x/avataaars/svg?seed=male3', 'templates/male3.svg', 'Business male avatar template'),
  ('Creative Female', 'https://api.dicebear.com/7.x/avataaars/svg?seed=female4', 'templates/female4.svg', 'Creative female avatar template'),
  ('Creative Male', 'https://api.dicebear.com/7.x/avataaars/svg?seed=male4', 'templates/male4.svg', 'Creative male avatar template'),
  ('Athletic Female', 'https://api.dicebear.com/7.x/avataaars/svg?seed=female5', 'templates/female5.svg', 'Athletic female avatar template'),
  ('Athletic Male', 'https://api.dicebear.com/7.x/avataaars/svg?seed=male5', 'templates/male5.svg', 'Athletic male avatar template'),
  ('Elegant Female', 'https://api.dicebear.com/7.x/avataaars/svg?seed=female6', 'templates/female6.svg', 'Elegant female avatar template'),
  ('Elegant Male', 'https://api.dicebear.com/7.x/avataaars/svg?seed=male6', 'templates/male6.svg', 'Elegant male avatar template')
  ON DUPLICATE KEY UPDATE name=name
`);

// Seed store items - Clothing
console.log("Seeding store items - Clothing...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, price) VALUES
  ('Business Suit', 'clothing', 'https://api.dicebear.com/7.x/icons/svg?seed=suit', 'store/suit.svg', 'Professional business suit', 50),
  ('Casual T-Shirt', 'clothing', 'https://api.dicebear.com/7.x/icons/svg?seed=tshirt', 'store/tshirt.svg', 'Comfortable casual t-shirt', 20),
  ('Leather Jacket', 'clothing', 'https://api.dicebear.com/7.x/icons/svg?seed=jacket', 'store/jacket.svg', 'Stylish leather jacket', 80),
  ('Summer Dress', 'clothing', 'https://api.dicebear.com/7.x/icons/svg?seed=dress', 'store/dress.svg', 'Light summer dress', 60),
  ('Hoodie', 'clothing', 'https://api.dicebear.com/7.x/icons/svg?seed=hoodie', 'store/hoodie.svg', 'Comfortable hoodie', 40)
  ON DUPLICATE KEY UPDATE name=name
`);

// Seed store items - Hair
console.log("Seeding store items - Hair...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, price) VALUES
  ('Long Wavy Hair', 'hair', 'https://api.dicebear.com/7.x/icons/svg?seed=hair1', 'store/hair1.svg', 'Long wavy hairstyle', 30),
  ('Short Pixie Cut', 'hair', 'https://api.dicebear.com/7.x/icons/svg?seed=hair2', 'store/hair2.svg', 'Short pixie cut', 25),
  ('Curly Afro', 'hair', 'https://api.dicebear.com/7.x/icons/svg?seed=hair3', 'store/hair3.svg', 'Natural curly afro', 35),
  ('Sleek Bob', 'hair', 'https://api.dicebear.com/7.x/icons/svg?seed=hair4', 'store/hair4.svg', 'Sleek bob hairstyle', 28),
  ('Ponytail', 'hair', 'https://api.dicebear.com/7.x/icons/svg?seed=hair5', 'store/hair5.svg', 'Classic ponytail', 22)
  ON DUPLICATE KEY UPDATE name=name
`);

// Seed store items - Face
console.log("Seeding store items - Face...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, price) VALUES
  ('Realistic Skin Tone 1', 'face', 'https://api.dicebear.com/7.x/icons/svg?seed=face1', 'store/face1.svg', 'Natural skin tone option', 15),
  ('Realistic Skin Tone 2', 'face', 'https://api.dicebear.com/7.x/icons/svg?seed=face2', 'store/face2.svg', 'Natural skin tone option', 15),
  ('Freckles', 'face', 'https://api.dicebear.com/7.x/icons/svg?seed=freckles', 'store/freckles.svg', 'Natural freckles overlay', 10),
  ('Makeup Style 1', 'face', 'https://api.dicebear.com/7.x/icons/svg?seed=makeup1', 'store/makeup1.svg', 'Professional makeup style', 25),
  ('Beard Style', 'face', 'https://api.dicebear.com/7.x/icons/svg?seed=beard', 'store/beard.svg', 'Various beard styles', 20)
  ON DUPLICATE KEY UPDATE name=name
`);

// Seed store items - Accessories
console.log("Seeding store items - Accessories...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, price) VALUES
  ('Sunglasses', 'accessories', 'https://api.dicebear.com/7.x/icons/svg?seed=sunglasses', 'store/sunglasses.svg', 'Stylish sunglasses', 15),
  ('Baseball Cap', 'accessories', 'https://api.dicebear.com/7.x/icons/svg?seed=cap', 'store/cap.svg', 'Casual baseball cap', 18),
  ('Earrings', 'accessories', 'https://api.dicebear.com/7.x/icons/svg?seed=earrings', 'store/earrings.svg', 'Elegant earrings', 12),
  ('Necklace', 'accessories', 'https://api.dicebear.com/7.x/icons/svg?seed=necklace', 'store/necklace.svg', 'Beautiful necklace', 20),
  ('Watch', 'accessories', 'https://api.dicebear.com/7.x/icons/svg?seed=watch', 'store/watch.svg', 'Luxury watch', 35)
  ON DUPLICATE KEY UPDATE name=name
`);

// Seed store items - Animations
console.log("Seeding store items - Animations...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, price) VALUES
  ('Walking Animation', 'animations', 'https://api.dicebear.com/7.x/icons/svg?seed=walk', 'store/walk.svg', 'Natural walking animation', 40),
  ('Running Animation', 'animations', 'https://api.dicebear.com/7.x/icons/svg?seed=run', 'store/run.svg', 'Dynamic running animation', 45),
  ('Dancing Animation', 'animations', 'https://api.dicebear.com/7.x/icons/svg?seed=dance', 'store/dance.svg', 'Fun dancing animation', 50),
  ('Waving Animation', 'animations', 'https://api.dicebear.com/7.x/icons/svg?seed=wave', 'store/wave.svg', 'Friendly waving gesture', 30),
  ('Sitting Animation', 'animations', 'https://api.dicebear.com/7.x/icons/svg?seed=sit', 'store/sit.svg', 'Sitting pose animation', 35)
  ON DUPLICATE KEY UPDATE name=name
`);

console.log("Database seeding completed successfully!");

await connection.end();
process.exit(0);
