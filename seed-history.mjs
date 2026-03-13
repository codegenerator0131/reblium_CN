import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log("Starting download history seed...");

// Get the first user to associate downloads with
const users = await db.execute('SELECT id FROM users LIMIT 1');
const userId = users[0]?.[0]?.id || 1;

console.log(`Seeding download history for user ${userId}...`);

// Seed asset downloads with various formats
await db.execute(`
  INSERT INTO assetDownloads (userId, avatarProjectId, assetUrl, assetKey, creditCost, format, createdAt) VALUES
  (${userId}, 1, 'https://storage.example.com/exports/hulk.fbx', 'exports/hulk.fbx', 100, 'fbx', DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (${userId}, 2, 'https://storage.example.com/exports/wonderwoman.glb', 'exports/wonderwoman.glb', 100, 'glb', DATE_SUB(NOW(), INTERVAL 5 DAY)),
  (${userId}, 3, 'https://storage.example.com/exports/superhuman.fbx', 'exports/superhuman.fbx', 100, 'fbx', DATE_SUB(NOW(), INTERVAL 7 DAY)),
  (${userId}, 4, 'https://storage.example.com/exports/professional.glb', 'exports/professional.glb', 100, 'glb', DATE_SUB(NOW(), INTERVAL 10 DAY)),
  (${userId}, 5, 'https://storage.example.com/exports/casual.fbx', 'exports/casual.fbx', 100, 'fbx', DATE_SUB(NOW(), INTERVAL 15 DAY)),
  (${userId}, 1, 'https://storage.example.com/exports/business.glb', 'exports/business.glb', 100, 'glb', DATE_SUB(NOW(), INTERVAL 20 DAY))
  ON DUPLICATE KEY UPDATE assetUrl=assetUrl
`);

// Seed credit transactions
console.log("Seeding credit transactions...");
await db.execute(`
  INSERT INTO creditTransactions (userId, type, amount, balanceAfter, description, createdAt) VALUES
  (${userId}, 'purchase', 100, 100, 'Purchased 100 credits pack', DATE_SUB(NOW(), INTERVAL 25 DAY)),
  (${userId}, 'usage', -100, 0, 'Exported Avatar_Business', DATE_SUB(NOW(), INTERVAL 20 DAY)),
  (${userId}, 'purchase', 500, 500, 'Purchased 500 credits pack', DATE_SUB(NOW(), INTERVAL 18 DAY)),
  (${userId}, 'usage', -100, 400, 'Exported Avatar_Casual', DATE_SUB(NOW(), INTERVAL 15 DAY)),
  (${userId}, 'usage', -100, 300, 'Exported Avatar_Professional', DATE_SUB(NOW(), INTERVAL 10 DAY)),
  (${userId}, 'usage', -100, 200, 'Exported Avatar_SuperHuman', DATE_SUB(NOW(), INTERVAL 7 DAY)),
  (${userId}, 'usage', -100, 100, 'Exported Avatar_WonderWoman', DATE_SUB(NOW(), INTERVAL 5 DAY)),
  (${userId}, 'usage', -100, 0, 'Exported Avatar_Hulk', DATE_SUB(NOW(), INTERVAL 2 DAY))
  ON DUPLICATE KEY UPDATE description=description
`);

// Seed credit purchases for invoices
console.log("Seeding credit purchases...");
await db.execute(`
  INSERT INTO creditPurchases (userId, creditPackId, credits, amountUSD, paymentMethod, paymentStatus, transactionId, createdAt) VALUES
  (${userId}, 3, 100, 7990, 'Credit Card', 'completed', 'TXN-2024-001', DATE_SUB(NOW(), INTERVAL 25 DAY)),
  (${userId}, 4, 500, 34990, 'PayPal', 'completed', 'TXN-2024-002', DATE_SUB(NOW(), INTERVAL 18 DAY))
  ON DUPLICATE KEY UPDATE transactionId=transactionId
`);

console.log("Download history and transactions seeding completed successfully!");

await connection.end();
process.exit(0);
