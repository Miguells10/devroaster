import {
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const languageEnum = pgEnum("language", [
	"javascript",
	"typescript",
	"jsx",
	"tsx",
	"python",
	"rust",
	"go",
	"java",
	"kotlin",
	"swift",
	"css",
	"html",
	"json",
	"sql",
	"bash",
	"php",
	"ruby",
	"csharp",
	"cpp",
	"markdown",
	"dockerfile",
	"yaml",
	"toml",
	"plaintext",
]);

export const roastModeEnum = pgEnum("roast_mode", [
	"honest", // feedback direto
	"sarcastic", // "maximum sarcasm enabled" (toggle na UI)
]);

export const issueSeverityEnum = pgEnum("issue_severity", [
	"critical", // Badge variant="critical" — vermelho
	"warning", // Badge variant="warning"  — âmbar
	"good", // Badge variant="good"     — verde (ponto positivo)
]);

export const issueTypeEnum = pgEnum("issue_type", [
	"naming",
	"logic",
	"security",
	"performance",
	"style",
	"architecture",
	"tech_debt",
	"best_practice",
	"other",
]);

// ---------------------------------------------------------------------------
// Tables
// camelCase keys → Drizzle maps to snake_case columns via casing config
// ---------------------------------------------------------------------------

export const roasts = pgTable(
	"roasts",
	{
		id: uuid().defaultRandom().primaryKey(),
		// Limitado a 10.000 chars — validado também na camada de aplicação (Zod)
		code: varchar({ length: 10000 }).notNull(),
		language: languageEnum().notNull().default("plaintext"),
		roastMode: roastModeEnum().notNull().default("honest"),
		// Score de 0 a 10, duas casas decimais
		score: numeric({ precision: 4, scale: 2 }).notNull(),
		// Resumo geral gerado pela IA
		summary: text(),
		// Preview truncado (≤120 chars) para o leaderboard
		codePreview: varchar({ length: 120 }),
		charCount: integer(),
		lineCount: integer(),
		// Sessão anônima — gerado via crypto.randomUUID(), persistido em cookie httpOnly
		sessionId: varchar({ length: 64 }).notNull(),
		// Código melhorado sugerido pela IA
		improvedCode: text(),
		createdAt: timestamp().defaultNow().notNull(),
	},
	(table) => [
		// Suporta a query do leaderboard: ORDER BY score ASC
		index("roasts_score_idx").on(table.score),
	],
);

export const roastIssues = pgTable("roast_issues", {
	id: uuid().defaultRandom().primaryKey(),
	roastId: uuid()
		.notNull()
		.references(() => roasts.id, { onDelete: "cascade" }),
	severity: issueSeverityEnum().notNull(),
	type: issueTypeEnum().notNull(),
	title: varchar({ length: 200 }).notNull(),
	description: text().notNull(),
	// Trecho original para DiffLine type="removed"
	codeBefore: text(),
	// Sugestão corrigida para DiffLine type="added"
	codeAfter: text(),
	lineStart: integer(),
	lineEnd: integer(),
	// Ordem de exibição dentro do roast
	sortOrder: integer().notNull().default(0),
	createdAt: timestamp().defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Inferred types — usados nas queries e Server Actions
// ---------------------------------------------------------------------------

export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
export type RoastIssue = typeof roastIssues.$inferSelect;
export type NewRoastIssue = typeof roastIssues.$inferInsert;
