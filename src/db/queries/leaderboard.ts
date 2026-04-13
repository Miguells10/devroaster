import { asc } from "drizzle-orm";
import { db } from "@/db";
import { type Roast, roasts } from "@/db/schema";

export type LeaderboardEntry = Pick<
	Roast,
	"id" | "codePreview" | "language" | "score" | "createdAt"
>;

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
	return db
		.select({
			id: roasts.id,
			codePreview: roasts.codePreview,
			language: roasts.language,
			score: roasts.score,
			createdAt: roasts.createdAt,
		})
		.from(roasts)
		.orderBy(asc(roasts.score))
		.limit(limit);
}
