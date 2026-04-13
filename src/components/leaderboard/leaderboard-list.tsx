import { CodeBlock } from "@/components/ui/code-block";
import { api } from "@/trpc/server";

export async function LeaderboardList() {
	const leaderboard = await api.roasts.getLeaderboard();

	return (
		<section className="flex flex-col gap-5 w-full">
			{leaderboard.map((entry, index) => (
				<article
					key={entry.id}
					className="flex flex-col w-full border border-border-primary bg-bg-page transition-all hover:bg-bg-surface group"
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
								<span className="text-text-tertiary font-mono text-xs tracking-wide uppercase">
									score:
								</span>
								<span
									className={`font-mono font-bold text-[13px] ${
										entry.score < 4
											? "text-accent-red"
											: entry.score < 7
												? "text-accent-amber"
												: "text-accent-green"
									}`}
								>
									{entry.score.toFixed(1)}
								</span>
							</div>
						</div>

						{/* Right Side: Language & Lines */}
						<div className="flex items-center gap-3">
							<span className="text-text-secondary font-mono text-xs lowercase">
								{entry.language}
							</span>
							<span className="text-text-tertiary font-mono text-xs">
								{entry.lineCount} lines
							</span>
						</div>
					</div>

					{/* Code Block Content */}
					<div className="flex w-full bg-bg-input min-h-[120px] group-hover:bg-bg-input/80 transition-colors">
						{/* Line Numbers Container */}
						<div className="flex flex-col items-end gap-1.5 w-10 py-3.5 px-2.5 border-r border-border-primary bg-bg-surface select-none">
							{Array.from({ length: entry.lineCount ?? 1 }).map((_, i) => (
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

			{leaderboard.length === 0 && (
				<div className="py-20 text-center border border-dashed border-border-primary/50">
					<p className="font-mono text-text-tertiary">{"// no roasts found. wait for the shame to arrive."}</p>
				</div>
			)}
		</section>
	);
}
