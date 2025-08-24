import "dotenv/config";
import db from "../index";
import { advocates } from "../schema";
import { advocateData } from "./advocates";

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL is not set. Ensure .env.local exists and Next/Node can read it."
    );
    process.exit(1);
  }

  try {
    console.log("Seeding advocates...");
    if (!("insert" in db)) {
      throw new Error(
        "Database client not initialized. Ensure DATABASE_URL is set when running this script (e.g., DATABASE_URL=... npm run seed)."
      );
    }
    const inserted = await db.insert(advocates).values(advocateData).returning();
    console.log(`Inserted ${inserted.length} advocates.`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed:", err);
    process.exit(1);
  }
}

seed();
