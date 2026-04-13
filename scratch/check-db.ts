import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { db } from "./src/db";

dotenv.config();

async function checkDb() {
	try {
		const tables = await db.execute(
			sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
		);
		console.log("Tables in public schema:", tables.rows);

		if (tables.rows.some((r) => r.table_name === "roasts")) {
			const columns = await db.execute(
				sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'roasts'`,
			);
			console.log("Columns in 'roasts':", columns.rows);

			const count = await db.execute(sql`SELECT count(*) FROM "roasts"`);
			console.log("Count in 'roasts':", count.rows);
		} else {
			console.log("Table 'roasts' does NOT exist!");
		}
	} catch (error) {
		console.error("Database check failed:", error);
	} finally {
		process.exit();
	}
}

checkDb();
