import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table-row";
import { Typography } from "@/components/ui/typography";
import { api } from "@/trpc/server";

export async function ShameLeaderboard() {
	// Fetch both worst roasts and total count via server caller
	const [leaderboard, metrics] = await Promise.all([
		api.roasts.getShameLeaderboard(),
		api.metrics.getOverview(),
	]);

	return (
		<section className="w-full max-w-[960px] space-y-8 pt-12">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<Typography variant="h2">leaderboard_preview</Typography>
					<Typography variant="subtitle">
						{"// the worst code on the internet, ranked by shame"}
					</Typography>
				</div>
				<Link href="/leaderboard">
					<Button variant="secondary" size="sm">
						view_all_roasts
					</Button>
				</Link>
			</div>

			<div className="border border-border-primary rounded-xl overflow-hidden bg-bg-page shadow-sm">
				{/* Header */}
				<div className="flex items-center gap-6 px-5 py-3 border-b border-border-primary bg-bg-surface text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
					<div className="w-10">rank</div>
					<div className="w-16">score</div>
					<div className="flex-1">code_preview</div>
					<div className="w-24 text-right">lang</div>
				</div>

				{leaderboard.map((roast, index) => (
					<TableRow
						key={roast.id}
						className="border-b border-border-primary/50 last:border-0"
					>
						<TableCell width="40px" className="text-text-tertiary">
							#{index + 1}
						</TableCell>
						<TableCell width="60px">
							<Badge
								variant={
									roast.score < 4
										? "critical"
										: roast.score < 7
											? "warning"
											: "good"
								}
							>
								{roast.score.toFixed(1)}
							</Badge>
						</TableCell>
						<TableCell className="flex-1 truncate text-text-secondary pr-10 font-mono text-sm">
							{roast.codePreview || "// no preview available"}
						</TableCell>
						<TableCell width="100px" className="text-right text-text-tertiary">
							{roast.language}
						</TableCell>
					</TableRow>
				))}

				{leaderboard.length === 0 && (
					<div className="py-20 text-center border-t border-border-primary/50">
						<Typography variant="subtitle">
							{"// no shame here yet. stay tuned."}
						</Typography>
					</div>
				)}
			</div>

			<div className="text-center py-4 space-y-2">
				<Typography
					variant="subtitle"
					className="hover:text-text-secondary cursor-pointer transition-colors"
				>
					{`showing top 3 · ${metrics.totalRoasts} total roasts`}
				</Typography>
				<div className="text-[10px] font-mono text-text-tertiary uppercase tracking-[0.2em]">
					{"<< auto_updated_metrics >>"}
				</div>
			</div>
		</section>
	);
}
