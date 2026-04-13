import { Suspense } from "react";
import { Typography } from "@/components/ui/typography";
import { HeroEditor } from "@/components/home/hero-editor";
import { HomeMetrics } from "@/components/home/home-metrics";
import { HomeMetricsSkeleton } from "@/components/home/home-metrics-skeleton";
import { ShameLeaderboard } from "@/components/home/shame-leaderboard";
import { ShameLeaderboardSkeleton } from "@/components/home/shame-leaderboard-skeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function HomePage() {
	// Prefetch metrics and leaderboard in parallel
	void Promise.all([
		prefetch(trpc.metrics.getOverview.queryOptions()),
		prefetch(trpc.roasts.getShameLeaderboard.queryOptions()),
	]);

	return (
		<HydrateClient>
			<main className="py-20 flex flex-col items-center space-y-16 text-center">
				{/* Hero Section */}
				<section className="space-y-4 max-w-2xl px-6">
					<div className="flex items-center justify-center gap-3">
						<span className="text-4xl font-bold text-accent-green font-mono">
							$
						</span>
						<Typography variant="h1" className="text-4xl md:text-5xl">
							paste your code. get roasted.
						</Typography>
					</div>
					<Typography variant="body" className="text-base text-text-secondary">
						{
							"// drop your code below and we'll rate it — brutally honest or full roast mode"
						}
					</Typography>
				</section>

				{/* Editor Section */}
				<HeroEditor />

				{/* Stats Section */}
				<Suspense fallback={<HomeMetricsSkeleton />}>
					<HomeMetrics />
				</Suspense>

				{/* Leaderboard Preview */}
				<Suspense fallback={<ShameLeaderboardSkeleton />}>
					<ShameLeaderboard />
				</Suspense>
			</main>
		</HydrateClient>
	);
}
