import { sql } from "drizzle-orm";
import { db } from "@/db";
import { roasts } from "@/db/schema";

export type Stats = {
	totalRoasts: number;
	avgScore: string;
};

export async function getStats(): Promise<Stats> {
	const result = await db
		.select({
			totalRoasts: sql<number>`COUNT(*)::int`,
			avgScore: sql<string>`ROUND(AVG(${roasts.score})::numeric, 1)::text`,
		})
		.from(roasts);

	return result[0] ?? { totalRoasts: 0, avgScore: "0.0" };
}
