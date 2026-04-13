CREATE TYPE "public"."issue_severity" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
CREATE TYPE "public"."issue_type" AS ENUM('naming', 'logic', 'security', 'performance', 'style', 'architecture', 'tech_debt', 'best_practice', 'other');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('javascript', 'typescript', 'jsx', 'tsx', 'python', 'rust', 'go', 'java', 'kotlin', 'swift', 'css', 'html', 'json', 'sql', 'bash', 'php', 'ruby', 'csharp', 'cpp', 'markdown', 'dockerfile', 'yaml', 'toml', 'plaintext');--> statement-breakpoint
CREATE TYPE "public"."roast_mode" AS ENUM('honest', 'sarcastic');--> statement-breakpoint
CREATE TABLE "roast_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roast_id" uuid NOT NULL,
	"severity" "issue_severity" NOT NULL,
	"type" "issue_type" NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"code_before" text,
	"code_after" text,
	"line_start" integer,
	"line_end" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(10000) NOT NULL,
	"language" "language" DEFAULT 'plaintext' NOT NULL,
	"roast_mode" "roast_mode" DEFAULT 'honest' NOT NULL,
	"score" numeric(4, 2) NOT NULL,
	"summary" text,
	"code_preview" varchar(120),
	"char_count" integer,
	"line_count" integer,
	"session_id" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roast_issues" ADD CONSTRAINT "roast_issues_roast_id_roasts_id_fk" FOREIGN KEY ("roast_id") REFERENCES "public"."roasts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "roasts_score_idx" ON "roasts" USING btree ("score");