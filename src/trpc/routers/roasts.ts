import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { roasts, roastIssues, languageEnum, roastModeEnum } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";
import { cacheLife } from "next/cache";
import { z } from "zod";
import { generateObject } from "ai";
import { model } from "@/lib/ai/google";
import { HONEST_SYSTEM_PROMPT, SARCASTIC_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { roastAnalysisSchema } from "@/lib/ai/schema";

export const roastsRouter = createTRPCRouter({
	create: baseProcedure
		.input(
			z.object({
				code: z.string().max(10000),
				language: z.enum(languageEnum.enumValues),
				mode: z.enum(roastModeEnum.enumValues),
				sessionId: z.string().max(64),
			}),
		)
		.mutation(async ({ input }) => {
			const systemPrompt =
				input.mode === "sarcastic"
					? SARCASTIC_SYSTEM_PROMPT
					: HONEST_SYSTEM_PROMPT;

			try {
				const { object: analysis } = await generateObject({
					model,
					schema: roastAnalysisSchema,
					system: systemPrompt,
					prompt: `Roast this ${input.language} code:\n\n${input.code}`,
				});

				// Save to DB in transaction
				const result = await db.transaction(async (tx) => {
					const [roast] = await tx
						.insert(roasts)
						.values({
							code: input.code,
							language: input.language,
							roastMode: input.mode,
							score: analysis.score.toString(),
							summary: analysis.summary,
							title: analysis.title,
							codePreview: input.code.slice(0, 120),
							charCount: input.code.length,
							lineCount: input.code.split("\n").length,
							sessionId: input.sessionId,
							improvedCode: analysis.improvedCode,
						})
						.returning();

					if (analysis.issues.length > 0) {
						await tx.insert(roastIssues).values(
							analysis.issues.map((issue, idx) => ({
								roastId: roast.id,
								severity: issue.severity,
								type: issue.type,
								title: issue.title,
								description: issue.description,
								codeBefore: issue.codeBefore,
								codeAfter: issue.codeAfter,
								lineStart: issue.lineStart,
								lineEnd: issue.lineEnd,
								sortOrder: idx,
							})),
						);
					}

					return roast;
				});

				return { id: result.id };
			} catch (error) {
				console.error("Failed to create roast:", error);
				throw new Error("Failed to analyze code. The AI might be tired of your bugs.");
			}
		}),
	getById: baseProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ input }) => {
			try {
				const roast = await db.query.roasts.findFirst({
					where: eq(roasts.id, input.id),
				});

				if (!roast) return null;

				const issues = await db.query.roastIssues.findMany({
					where: eq(roastIssues.roastId, input.id),
					orderBy: asc(roastIssues.sortOrder),
				});

				return {
					...roast,
					score: Number(roast.score),
					issues,
				};
			} catch (error) {
				console.error("Failed to fetch roast by id:", error);
				return null;
			}
		}),

	getShameLeaderboard: baseProcedure.query(async () => {
		"use cache";
		cacheLife("hours");

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
		"use cache";
		cacheLife("hours");

		try {
			const results = await db
				.select({
					id: roasts.id,
					score: roasts.score,
					code: roasts.code,
					language: roasts.language,
					lineCount: roasts.lineCount,
					title: roasts.title,
					summary: roasts.summary,
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
