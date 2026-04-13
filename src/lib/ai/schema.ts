import { z } from "zod";

export const roastAnalysisSchema = z.object({
	score: z.number().min(0).max(10),
	verdict: z.string(),
	title: z.string(),
	summary: z.string(),
	issues: z.array(
		z.object({
			severity: z.enum(["critical", "warning", "good"]),
			type: z.enum([
				"naming",
				"logic",
				"security",
				"performance",
				"style",
				"architecture",
				"tech_debt",
				"best_practice",
				"other",
			]),
			title: z.string(),
			description: z.string(),
			// Optional: mapping to specific lines for future diff highlighting
			lineStart: z.number().optional(),
			lineEnd: z.number().optional(),
			codeBefore: z.string().optional(),
			codeAfter: z.string().optional(),
		}),
	),
	// A high-level improved version of the code if applicable
	improvedCode: z.string().optional(),
});

export type RoastAnalysis = z.infer<typeof roastAnalysisSchema>;
