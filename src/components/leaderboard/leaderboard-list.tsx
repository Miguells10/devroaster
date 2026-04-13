import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { Typography } from "@/components/ui/typography";
import { api } from "@/trpc/server";

export async function LeaderboardList() {
	const leaderboard = await api.roasts.getLeaderboard();

	return (
		<section className="flex flex-col gap-8 w-full">
			{leaderboard.map((entry, index) => (
				<article
					key={entry.id}
					className="flex flex-col w-full border border-border-primary bg-bg-page hover:border-accent-green transition-all group"
				>
					{/* Header Meta Row */}
					<div className="flex items-center justify-between h-10 px-4 border-b border-border-primary bg-bg-surface/50">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-1.5 font-mono text-[11px]">
								<span className="text-text-tertiary">rank</span>
								<span className="text-accent-amber font-bold">
									#{index + 1}
								</span>
							</div>
							<div className="flex items-center gap-1.5 font-mono text-[11px]">
								<span className="text-text-tertiary">score</span>
								<span
									className={`font-bold ${
										entry.score < 4
											? "text-accent-red"
											: entry.score < 7
												? "text-accent-amber"
												: "text-accent-green"
									}`}
								>
									{entry.score.toFixed(1)}/10
								</span>
							</div>
						</div>
						<div className="flex items-center gap-3 font-mono text-[11px]">
							<span className="text-text-secondary">{entry.language}</span>
							<span className="text-text-tertiary">
								{entry.lineCount} lines
							</span>
						</div>
					</div>

					{/* Roast Content Section */}
					<div className="flex flex-col p-6 gap-6 bg-bg-page relative overflow-hidden">
						{/* Background Accent */}
						<div className="absolute top-0 right-0 p-2 opacity-[0.03] select-none pointer-events-none translate-x-4 -translate-y-4">
							<Typography variant="h1" className="text-8xl italic">
								#{index + 1}
							</Typography>
						</div>

						{/* Roast Header */}
						<div className="flex flex-col gap-2 relative z-10">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
								<span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-red">
									ai_verdict
								</span>
							</div>
							<Typography variant="h3" className="text-xl leading-tight">
								{entry.title || "the code was so bad we forgot the title"}
							</Typography>
						</div>

						{/* Summary Box */}
						<div className="p-4 border-l-2 border-accent-amber bg-bg-surface/30 relative z-10">
							<p className="text-text-secondary font-mono text-xs leading-relaxed italic">
								"
								{entry.summary ||
									"no summary available. just look at the code and cry."}
								"
							</p>
						</div>

						{/* Code Preview */}
						<div className="flex flex-col gap-3 relative z-10">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span className="text-accent-green font-mono text-[11px]">
										{"//"}
									</span>
									<span className="text-text-primary font-mono text-[11px] font-bold">
										shameful_snippet.js
									</span>
								</div>
							</div>
							<div className="border border-border-primary bg-bg-input overflow-hidden max-h-[300px] relative group-hover:max-h-[500px] transition-all duration-500">
								<CodeBlock
									code={entry.code}
									lang={entry.language}
									className="p-4 text-[11px] leading-relaxed"
								/>
								<div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-bg-input to-transparent pointer-events-none" />
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-end mt-2">
							<Link
								href={`/roast/${entry.id}`}
								className="flex items-center gap-2 px-4 h-9 border border-border-primary bg-bg-surface hover:bg-bg-page hover:border-accent-green transition-all group/link"
							>
								<span className="text-[11px] font-mono font-bold text-text-primary">
									view_full_report
								</span>
								<span className="text-text-tertiary group-hover/link:translate-x-1 transition-transform">
									&rarr;
								</span>
							</Link>
						</div>
					</div>
				</article>
			))}

			{leaderboard.length === 0 && (
				<div className="py-20 text-center border border-dashed border-border-primary/50">
					<p className="font-mono text-text-tertiary">
						{"// no roasts found. wait for the shame to arrive."}
					</p>
				</div>
			)}
		</section>
	);
}
