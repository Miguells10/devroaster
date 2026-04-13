import { db } from "@/db";
import { roasts } from "@/db/schema";
import { asc } from "drizzle-orm";
import { baseProcedure, createTRPCRouter } from "../init";

export const roastsRouter = createTRPCRouter({
	getShameLeaderboard: baseProcedure.query(async () => {
		try {
			const results = await db
				.select({
					id: roasts.id,
					score: roasts.score,
					codePreview: roasts.codePreview,
					language: roasts.language,
				})
				.from(roasts)
				.orderBy(asc(roasts.score))
				.limit(3);

			return results.map((roast) => ({
				...roast,
				score: Number(roast.score),
			}));
		} catch (error) {
			console.error("Failed to fetch shame leaderboard:", error);
			return [];
		}
	}),

	getLeaderboard: baseProcedure.query(async () => {
		try {
			const results = await db
				.select({
					id: roasts.id,
					score: roasts.score,
					code: roasts.code,
					language: roasts.language,
					lineCount: roasts.lineCount,
				})
				.from(roasts)
				.orderBy(asc(roasts.score))
				.limit(20);

			return results.map((roast) => ({
				...roast,
				score: Number(roast.score),
			}));
		} catch (error) {
			console.error("Failed to fetch full leaderboard:", error);
			return [];
		}
	}),
});
