import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
	title: "Leaderboard - DevRoaster",
	description: "The most roasted code on the internet.",
};

const STATS = {
	submissions: "2,847",
	avgScore: "4.2",
};

const LEADERBOARD_ENTRIES = [
	{
		id: "1",
		score: "1.2",
		language: "javascript",
		lines: 3,
		code: `eval(prompt("enter code"))\ndocument.write(response)\n// trust the user lol`,
	},
	{
		id: "2",
		score: "2.4",
		language: "python",
		lines: 5,
		code: `def check_is_even(num):\n    if num == 1:\n        return False\n    elif num == 2:\n        return True\n    return False # TODO`,
	},
	{
		id: "3",
		score: "2.8",
		language: "typescript",
		lines: 4,
		code: `const sum = (a: any, b: any): any => {\n  return a - b; // wait maybe it was +?\n};\nsum("1", 2);`,
	},
	{
		id: "4",
		score: "3.5",
		language: "tsx",
		lines: 6,
		code: `function App() {\n  // force re-render every millisecond to keep it fresh\n  setInterval(() => setDummy(d => d + 1), 1);\n  return <Dashboard />;\n}`,
	},
];

export default function LeaderboardPage() {
	return (
		<main className="py-20 flex flex-col items-center">
			<div className="w-full max-w-[960px] flex flex-col gap-10">
				
				{/* Hero Section */}
				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="text-accent-green font-mono text-[32px] font-bold">
							&gt;
						</span>
						<h1 className="text-text-primary font-mono text-[28px] font-bold">
							shame_leaderboard
						</h1>
					</div>
					<p className="text-text-secondary font-mono text-sm tracking-wide">
						{"// the most roasted code on the internet"}
					</p>
					<div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
						<span>{STATS.submissions} submissions</span>
						<span>&middot;</span>
						<span>avg score: {STATS.avgScore}/10</span>
					</div>
				</section>

				{/* Leaderboard Entries List */}
				<section className="flex flex-col gap-5 w-full">
					{LEADERBOARD_ENTRIES.map((entry, index) => (
						<article
							key={entry.id}
							className="flex flex-col w-full border border-border-primary bg-bg-page"
						>
							{/* Meta Row */}
							<div className="flex items-center justify-between h-12 px-5 border-b border-border-primary">
								{/* Left Side: Rank & Score */}
								<div className="flex items-center gap-4">
									{/* Rank */}
									<div className="flex items-center gap-1.5">
										<span className="text-text-tertiary font-mono text-[13px]">#</span>
										<span className="text-accent-amber font-mono font-bold text-[13px]">
											{index + 1}
										</span>
									</div>
									{/* Score */}
									<div className="flex items-center gap-1.5">
										<span className="text-text-tertiary font-mono text-xs tracking-wide">
											score:
										</span>
										<span className="text-accent-red font-mono font-bold text-[13px]">
											{entry.score}
										</span>
									</div>
								</div>

								{/* Right Side: Language & Lines */}
								<div className="flex items-center gap-3">
									<span className="text-text-secondary font-mono text-xs lowercase">
										{entry.language}
									</span>
									<span className="text-text-tertiary font-mono text-xs">
										{entry.lines} lines
									</span>
								</div>
							</div>

							{/* Code Block Content */}
							<div className="flex w-full bg-bg-input min-h-[120px]">
								{/* Line Numbers Container (Simulated, design has it as 40px width) */}
								<div className="flex flex-col items-end gap-1.5 w-10 py-3.5 px-2.5 border-r border-border-primary bg-bg-surface select-none">
									{Array.from({ length: entry.lines }).map((_, i) => (
										<span
											// biome-ignore lint/suspicious/noArrayIndexKey: Line numbers are static
											key={i}
											className="text-text-tertiary font-mono text-xs leading-[21px]"
										>
											{i + 1}
										</span>
									))}
								</div>

								{/* Actual Code View */}
								<div className="flex-1 overflow-x-auto">
									<CodeBlock
										code={entry.code}
										lang={entry.language}
										className="px-4 py-3.5 leading-[21px] text-xs"
									/>
								</div>
							</div>
						</article>
					))}
				</section>
			</div>
		</main>
	);
}
