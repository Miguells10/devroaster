import { sql } from "drizzle-orm";
import { db } from "@/db";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";
import { cacheLife } from "next/cache";

export const metricsRouter = createTRPCRouter({
	getOverview: baseProcedure.query(async () => {
		"use cache";
		cacheLife("hours");

		try {
			const [stats] = await db
				.select({
					totalRoasts: sql<number>`count(*)`.mapWith(Number),
					avgScore: sql<string | null>`avg(${roasts.score})`.mapWith(String),
				})
				.from(roasts);

			return {
				totalRoasts: stats?.totalRoasts ?? 0,
				avgScore: stats?.avgScore
					? Number.parseFloat(stats.avgScore).toFixed(1)
					: "0.0",
			};
		} catch (error) {
			console.error("Failed to fetch metrics overview:", error);
			return {
				totalRoasts: 0,
				avgScore: "0.0",
			};
		}
	}),
});
