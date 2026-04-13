/**
 * Migration runner usando drizzle-orm/migrator diretamente.
 * Alternativa ao `drizzle-kit migrate` que tem issues de conexão no Windows/Docker.
 * Uso: node scripts/migrate.js
 */

require("dotenv").config({ path: ".env.local" });

const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
const { migrate } = require("drizzle-orm/node-postgres/migrator");

async function main() {
	const pool = new Pool({ connectionString: process.env.DATABASE_URL });
	const db = drizzle(pool, { casing: "snake_case" });

	console.log("🚀 Applying migrations...");
	await migrate(db, { migrationsFolder: "./src/db/migrations" });
	console.log("✅ Migrations applied successfully!");

	await pool.end();
}

main().catch((err) => {
	console.error("❌ Migration failed:", err.message);
	process.exit(1);
});
