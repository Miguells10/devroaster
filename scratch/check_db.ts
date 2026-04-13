import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function checkDb() {
  try {
    const result = await db.execute(sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`);
    console.log("Tables in DB:", JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error("DB Connection Error:", error);
  } finally {
    process.exit();
  }
}

checkDb();
