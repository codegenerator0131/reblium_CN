import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log("Seeding store items with local images...");

// Delete all existing store items
await db.execute(`DELETE FROM storeItems`);

// Seed store items - Clothing (using clothing-*.png)
console.log("Seeding Clothing items...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, personalPriceUSD, commercialPriceUSD, personalPriceCNY, commercialPriceCNY) VALUES
  ('Business Suit', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/oUpNzfPcbhUHbRye.png', 'store/clothing-1', 'Professional business suit', 15.00, 75.00, 108.00, 540.00),
  ('Casual T-Shirt', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/ZinvulEMVxpNIGyJ.png', 'store/clothing-2', 'Comfortable casual t-shirt', 8.00, 40.00, 58.00, 288.00),
  ('Leather Jacket', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/QSAqfQCNmbZsfxBo.png', 'store/clothing-3', 'Stylish leather jacket', 25.00, 125.00, 180.00, 900.00),
  ('Summer Dress', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/jAWiYlvJMtCFAuLP.png', 'store/clothing-4', 'Light summer dress', 18.00, 90.00, 130.00, 648.00),
  ('Hoodie', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/fVafAPEKiAMmWCsj.png', 'store/clothing-5', 'Warm and cozy hoodie', 12.00, 60.00, 86.00, 432.00),
  ('Cyber Jacket', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/WyqajVmemgHTbDsJ.png', 'store/clothing-6', 'Futuristic cyber jacket', 25.00, 125.00, 180.00, 900.00),
  ('Urban Streetwear', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/UAucBQSsYsMVxNWI.png', 'store/clothing-7', 'Modern urban streetwear', 20.00, 100.00, 144.00, 720.00),
  ('Futuristic Suit', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/DWVExffDwhSTVioN.png', 'store/clothing-8', 'Premium futuristic suit', 30.00, 150.00, 216.00, 1080.00),
  ('Casual Wear', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/QpkLPVQnkLGsDRll.png', 'store/clothing-9', 'Comfortable casual wear', 15.00, 75.00, 108.00, 540.00),
  ('Evening Dress', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/vurGBookwoQMNDZI.png', 'store/clothing-10', 'Elegant evening dress', 28.00, 140.00, 202.00, 1008.00),
  ('Party Outfit', 'clothing', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/MNVKJZeUpfexfynK.png', 'store/clothing-11', 'Fun party outfit', 22.00, 110.00, 158.00, 792.00)
`);

// Seed store items - Hair (using hair-*.png)
console.log("Seeding Hair items...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, personalPriceUSD, commercialPriceUSD, personalPriceCNY, commercialPriceCNY) VALUES
  ('Long Wavy Hair', 'hair', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/zINkLWrJClXSvLaZ.png', 'store/hair-1', 'Beautiful long wavy hair', 10.00, 50.00, 72.00, 360.00),
  ('Short Pixie Cut', 'hair', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/oaePHoNmNErTpspk.png', 'store/hair-2', 'Trendy short pixie cut', 8.00, 40.00, 58.00, 288.00),
  ('Curly Afro', 'hair', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/pijdNELiKHXVAZoi.png', 'store/hair-3', 'Natural curly afro', 12.00, 60.00, 86.00, 432.00),
  ('Braided Style', 'hair', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/vCZvTBIRkxVAZBaB.png', 'store/hair-4', 'Elegant braided hairstyle', 14.00, 70.00, 101.00, 504.00),
  ('Sleek Ponytail', 'hair', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/igqtUKRgAyKkCIrY.png', 'store/hair-5', 'Sleek and polished ponytail', 9.00, 45.00, 65.00, 324.00)
`);

// Seed store items - Face (using face-*.png)
console.log("Seeding Face items...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, personalPriceUSD, commercialPriceUSD, personalPriceCNY, commercialPriceCNY) VALUES
  ('Realistic Skin Tone 1', 'face', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/dONsdXprKDmwjpxE.png', 'store/face-1', 'Natural skin tone option', 5.00, 25.00, 36.00, 180.00),
  ('Realistic Skin Tone 2', 'face', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/fYJaCqnWtOMXweQt.png', 'store/face-2', 'Natural skin tone option', 5.00, 25.00, 36.00, 180.00),
  ('Freckles', 'face', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/PLZbNXgzVopQugeZ.png', 'store/face-3', 'Natural freckles overlay', 3.00, 15.00, 22.00, 108.00),
  ('Makeup Style 1', 'face', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/KQwzdOHoNNaAwKKE.png', 'store/face-4', 'Professional makeup style', 8.00, 40.00, 58.00, 288.00),
  ('Beard Style', 'face', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/rlAJdkliJyzdDdHW.png', 'store/face-5', 'Various beard styles', 6.00, 30.00, 43.00, 216.00)
`);

// Seed store items - Accessories (using accessories-*.png)
console.log("Seeding Accessories items...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, personalPriceUSD, commercialPriceUSD, personalPriceCNY, commercialPriceCNY) VALUES
  ('Sunglasses', 'accessories', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/SJfgimulDwFrabVd.png', 'store/accessories-1', 'Stylish sunglasses', 5.00, 25.00, 36.00, 180.00),
  ('Baseball Cap', 'accessories', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/kMnKjQCKicjqPnhu.png', 'store/accessories-2', 'Casual baseball cap', 6.00, 30.00, 43.00, 216.00),
  ('Earrings', 'accessories', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/ISuzPPkABiEVLkHD.png', 'store/accessories-3', 'Elegant earrings', 4.00, 20.00, 29.00, 144.00),
  ('Necklace', 'accessories', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/DhfOMDCNJjHolrpq.png', 'store/accessories-4', 'Beautiful necklace', 7.00, 35.00, 50.00, 252.00),
  ('Watch', 'accessories', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/DXSTjBSeSElktKZy.png', 'store/accessories-5', 'Luxury watch', 12.00, 60.00, 86.00, 432.00)
`);

// Seed store items - Animations (using avatar templates as placeholders)
console.log("Seeding Animations items...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, personalPriceUSD, commercialPriceUSD, personalPriceCNY, commercialPriceCNY) VALUES
  ('Walking Animation', 'animations', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/NyAfzOEwWRUShOjZ.png', 'store/walk', 'Natural walking animation', 10.00, 50.00, 72.00, 360.00),
  ('Running Animation', 'animations', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/stRdvuQAshXzMcsq.png', 'store/run', 'Dynamic running animation', 12.00, 60.00, 86.00, 432.00),
  ('Dancing Animation', 'animations', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/rrXfQANzrYJjROfT.png', 'store/dance', 'Fun dancing animation', 15.00, 75.00, 108.00, 540.00),
  ('Waving Animation', 'animations', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/yFHdiYIfyIfTRzIj.png', 'store/wave', 'Friendly waving gesture', 8.00, 40.00, 58.00, 288.00),
  ('Sitting Animation', 'animations', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/cZGeOhQAzcTIlDgk.png', 'store/sit', 'Sitting pose animation', 9.00, 45.00, 65.00, 324.00)
`);

// Seed store items - Packs (using pack images)
console.log("Seeding Packs items...");
await db.execute(`
  INSERT INTO storeItems (name, category, thumbnailUrl, thumbnailKey, description, personalPriceUSD, commercialPriceUSD, personalPriceCNY, commercialPriceCNY) VALUES
  ('Starter Pack', 'packs', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/KpRsFfJIzTmaDjij.png', 'store/starter', 'Perfect starter pack with essentials', 25.00, 125.00, 180.00, 900.00),
  ('Fantasy Pack', 'packs', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/CPAUlZiQbRjrTRUs.png', 'store/fantasy', 'Complete fantasy collection', 35.00, 175.00, 252.00, 1260.00),
  ('Sci-Fi Pack', 'packs', 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/DjoBrKZsfQaLtKNz.png', 'store/scifi', 'Futuristic sci-fi bundle', 40.00, 200.00, 288.00, 1440.00)
`);

console.log("Store items seeding completed successfully!");
await connection.end();
process.exit(0);
