import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import mysql from "mysql2/promise";
import { avatarProjects, templateAvatars } from "./drizzle/schema.js";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

console.log("Starting thumbnail assignment...");

// Get all template avatars
const templates = await db.select().from(templateAvatars);

if (!templates || templates.length === 0) {
  console.log("No template thumbnails found");
  await connection.end();
  process.exit(0);
}

console.log(`Found ${templates.length} template thumbnails`);

// Get all avatar projects
const projects = await db.select().from(avatarProjects);

console.log(`Found ${projects.length} projects to update`);

// Randomly assign thumbnails to projects without them
for (const project of projects) {
  if (!project.thumbnailUrl) {
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    await db.update(avatarProjects)
      .set({
        thumbnailUrl: randomTemplate.thumbnailUrl,
        thumbnailKey: randomTemplate.thumbnailKey
      })
      .where(eq(avatarProjects.id, project.id));
    console.log(`Assigned thumbnail to project ${project.id}: ${project.name}`);
  }
}

console.log("Thumbnail assignment completed!");

await connection.end();
process.exit(0);
