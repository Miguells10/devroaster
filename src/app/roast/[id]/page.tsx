import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { CodeWindow } from "@/components/ui/code-window";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { Typography } from "@/components/ui/typography";

export const metadata: Metadata = {
	title: "Roast Result - DevRoaster",
	description: "Check the brutal analysis of this code submission.",
};

const MOCK_DATA = {
	score: 1.2,
	verdict: "needs_serious_help",
	title: '"this code looks like it was written during a power outage... in 2005."',
	language: "javascript",
	lineCount: 7,
	originalCode: `var data = [];
setInterval(function() {
  var req = new XMLHttpRequest();
  req.open("GET", "/api/data", false);
  req.send();
  data.push(req.responseText);
}, 1000);`,
	issues: [
		{
			id: "1",
			severity: "critical",
			title: "using var instead of const/let",
			description:
				"var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
		},
		{
			id: "2",
			severity: "warning",
			title: "synchronous xmlhttprequest",
			description:
				"making synchronous requests on the main thread blocks the UI, causing it to freeze. use fetch() with async/await.",
		},
		{
			id: "3",
			severity: "critical",
			title: "unbound setinterval leak",
			description:
				"the interval is never cleared and keeps pushing data into a global array, which will eventually crash the browser.",
		},
		{
			id: "4",
			severity: "warning",
			title: "global data accumulation",
			description:
				"pushing every response to an array without a limit or cleanup strategy is a recipe for a memory leak.",
		},
	],
	diff: [
		{ type: "context" as const, code: "const data = [];" },
		{ type: "removed" as const, code: "setInterval(function() {" },
		{ type: "removed" as const, code: '  var req = new XMLHttpRequest();' },
		{ type: "removed" as const, code: '  req.open("GET", "/api/data", false);' },
		{ type: "added" as const, code: "useEffect(() => {" },
		{ type: "added" as const, code: "  const controller = new AbortController();" },
		{ type: "added" as const, code: "  const fetchData = async () => {" },
		{ type: "added" as const, code: '    const res = await fetch("/api/data", { signal: controller.signal });' },
		{ type: "context" as const, code: "  };" },
	],
};

export default async function RoastResultPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	// biome-ignore lint/correctness/noUnusedVariables: id will be used for data fetching in the actual implementation
	const roastId = id;
	return (
		<main className="py-20 flex flex-col items-center">
			<div className="w-full max-w-[960px] flex flex-col gap-12">
				{/* Score Hero Section */}
				<section className="flex items-center gap-12 w-full">
					<div className="shrink-0 scale-110">
						<ScoreRing score={MOCK_DATA.score} maxScore={10} />
					</div>
					<div className="flex-1 flex flex-col gap-5">
						<div className="flex items-center gap-2">
							<div className="w-2.5 h-2.5 rounded-full bg-accent-red animate-pulse" />
							<span className="text-accent-red font-mono text-sm font-bold uppercase tracking-tight">
								verdict: {MOCK_DATA.verdict}
							</span>
						</div>
						<Typography variant="h2" className="text-3xl leading-snug">
							{MOCK_DATA.title}
						</Typography>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
								<span>lang: {MOCK_DATA.language}</span>
								<span>&middot;</span>
								<span>{MOCK_DATA.lineCount} lines</span>
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
					<CodeWindow title="submission.js">
						<CodeBlock
							code={MOCK_DATA.originalCode}
							lang={MOCK_DATA.language}
						/>
					</CodeWindow>
				</section>

				<div className="w-full h-px bg-border-primary/50" />

				{/* Detailed Analysis Section */}
				<section className="flex flex-col gap-8 w-full">
					<div className="flex items-center gap-2">
						<span className="text-accent-green font-mono text-sm font-bold">
							{"//"}
						</span>
						<h3 className="text-text-primary font-mono text-sm font-bold">
							detailed_analysis
						</h3>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{MOCK_DATA.issues.map((issue) => (
							<div
								key={issue.id}
								className="flex flex-col gap-4 p-6 border border-border-primary bg-bg-page hover:bg-bg-surface/30 transition-colors"
							>
								<div className="flex items-center gap-2">
									<div 
										className={`w-2 h-2 rounded-full ${
											issue.severity === "critical" ? "bg-accent-red" : "bg-accent-amber"
										}`} 
									/>
									<span 
										className={`font-mono text-xs font-bold uppercase tracking-tight ${
											issue.severity === "critical" ? "text-accent-red" : "text-accent-amber"
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

				<div className="w-full h-px bg-border-primary/50" />

				{/* Suggested Fix Section */}
				<section className="flex flex-col gap-8 w-full">
					<div className="flex items-center gap-2">
						<span className="text-accent-green font-mono text-sm font-bold">
							{"//"}
						</span>
						<h3 className="text-text-primary font-mono text-sm font-bold">
							suggested_fix
						</h3>
					</div>
					
					<div className="flex flex-col border border-border-primary bg-bg-input overflow-hidden rounded-lg">
						{/* Diff Header */}
						<div className="h-10 border-b border-border-primary bg-bg-surface/50 flex items-center px-4">
							<span className="text-[10px] font-mono text-text-secondary font-medium">
								your_code.js &rarr; improved_code.js
							</span>
						</div>
						
						{/* Diff Body */}
						<div className="py-2">
							{MOCK_DATA.diff.map((line, idx) => (
								<DiffLine 
									// biome-ignore lint/suspicious/noArrayIndexKey: Diff lines are static
									key={idx} 
									type={line.type} 
									code={line.code} 
								/>
							))}
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
