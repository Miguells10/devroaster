import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { CodeWindow } from "@/components/ui/code-window";
import { ScoreRing } from "@/components/ui/score-ring";
import { Typography } from "@/components/ui/typography";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
	title: "Roast Result - DevRoaster",
	description: "Check the brutal analysis of this code submission.",
};

export default async function RoastResultPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const roast = await api.roasts.getById({ id });

	if (!roast) {
		return notFound();
	}

	return (
		<main className="py-20 flex flex-col items-center">
			<div className="w-full max-w-[960px] flex flex-col gap-12">
				{/* Score Hero Section */}
				<section className="flex items-center gap-12 w-full">
					<div className="shrink-0 scale-110">
						<ScoreRing score={roast.score} maxScore={10} />
					</div>
					<div className="flex-1 flex flex-col gap-5">
						<div className="flex items-center gap-2">
							<div className="w-2.5 h-2.5 rounded-full bg-accent-red animate-pulse" />
							<span className="text-accent-red font-mono text-sm font-bold uppercase tracking-tight">
								verdict: {roast.roastMode === "sarcastic" ? "completely_shamed" : "inspected"}
							</span>
						</div>
						<Typography variant="h2" className="text-3xl leading-snug font-bold">
							{roast.title || "Untitled Roast"}
						</Typography>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
								<span>lang: {roast.language}</span>
								<span>&middot;</span>
								<span>{roast.lineCount} lines</span>
							</div>
							<div className="flex-1" />
							<Button variant="secondary" size="sm" className="gap-2">
								<span className="opacity-50">$</span>
								share_roast
							</Button>
						</div>
					</div>
				</section>

				<div className="w-full h-px bg-border-primary/50" />

				{/* Summary Section */}
				{roast.summary && (
					<section className="flex flex-col gap-5 w-full">
						<div className="flex items-center gap-2">
							<span className="text-accent-amber font-mono text-sm font-bold">
								{"//"}
							</span>
							<h3 className="text-text-primary font-mono text-sm font-bold">
								ai_summary
							</h3>
						</div>
						<div className="p-6 border-l-4 border-accent-amber bg-bg-surface/30">
							<p className="font-mono text-sm text-text-secondary leading-relaxed">
								{roast.summary}
							</p>
						</div>
					</section>
				)}

				<div className="w-full h-px bg-border-primary/50" />

				{/* Submitted Code Section */}
				<section className="flex flex-col gap-5 w-full">
					<div className="flex items-center gap-2">
						<span className="text-accent-green font-mono text-sm font-bold">
							{"//"}
						</span>
						<h3 className="text-text-primary font-mono text-sm font-bold">
							your_submission
						</h3>
					</div>
					<CodeWindow title={`submission.${roast.language === "python" ? "py" : roast.language === "typescript" ? "ts" : "js"}`}>
						<CodeBlock
							code={roast.code}
							lang={roast.language}
						/>
					</CodeWindow>
				</section>

				<div className="w-full h-px bg-border-primary/50" />

				{/* Detailed Analysis Section */}
				<section className="flex flex-col gap-8 w-full">
					<div className="flex items-center gap-2">
						<span className="text-accent-red font-mono text-sm font-bold">
							{"//"}
						</span>
						<h3 className="text-text-primary font-mono text-sm font-bold">
							detailed_analysis
						</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{roast.issues?.map((issue) => (
							<div
								key={issue.id}
								className={`flex flex-col gap-4 p-6 border bg-bg-page hover:bg-bg-surface/30 transition-colors ${
									issue.severity === "critical" ? "border-accent-red/30" : "border-border-primary"
								}`}
							>
								<div className="flex items-center gap-2">
									<div
										className={`w-2 h-2 rounded-full ${
											issue.severity === "critical"
												? "bg-accent-red"
												: issue.severity === "warning"
												? "bg-accent-amber"
												: "bg-accent-green"
										}`}
									/>
									<span
										className={`font-mono text-xs font-bold uppercase tracking-tight ${
											issue.severity === "critical"
												? "text-accent-red"
												: issue.severity === "warning"
												? "text-accent-amber"
												: "text-accent-green"
										}`}
									>
										{issue.severity}
									</span>
								</div>
								<h4 className="text-text-primary font-mono text-[13px] font-bold">
									{issue.title}
								</h4>
								<p className="text-text-secondary font-mono text-xs leading-relaxed">
									{issue.description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Suggested Fix Section */}
				{roast.improvedCode && (
					<>
						<div className="w-full h-px bg-border-primary/50" />
						<section className="flex flex-col gap-8 w-full pb-20">
							<div className="flex items-center gap-2">
								<span className="text-accent-green font-mono text-sm font-bold">
									{"//"}
								</span>
								<h3 className="text-text-primary font-mono text-sm font-bold">
									suggested_fix
								</h3>
							</div>

							<CodeWindow title="improved_version.js" className="border-accent-green/30">
								<CodeBlock
									code={roast.improvedCode}
									lang={roast.language}
								/>
							</CodeWindow>
						</section>
					</>
				)}
			</div>
		</main>
	);
}

