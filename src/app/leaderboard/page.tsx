import type { Metadata } from "next";
import { Suspense } from "react";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { LeaderboardSkeleton } from "@/components/leaderboard/leaderboard-skeleton";
import { api, HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
	title: "Leaderboard - DevRoaster",
	description: "The most roasted code on the internet.",
};

export default async function LeaderboardPage() {
	// Parallel prefetching for hydration (using options proxy)
	void Promise.all([
		prefetch(trpc.metrics.getOverview.queryOptions()),
		prefetch(trpc.roasts.getLeaderboard.queryOptions()),
	]);

	// Fetch metrics for the hero section (using server caller)
	const metrics = await api.metrics.getOverview();

	return (
		<HydrateClient>
			<main className="py-20 flex flex-col items-center">
				<div className="w-full max-w-[960px] flex flex-col gap-10 px-6 md:px-0">
					{/* Hero Section */}
					<section className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<span className="text-accent-green font-mono text-3xl font-bold">
								&gt;
							</span>
							<h1 className="text-text-primary font-mono text-3xl font-bold">
								shame_leaderboard
							</h1>
						</div>
						<p className="text-text-secondary font-mono text-sm tracking-wide">
							{"// the most roasted code on the internet"}
						</p>
						<div className="flex items-center gap-4 font-mono text-[10px] text-text-tertiary uppercase tracking-widest">
							<div className="flex items-center gap-1.5">
								<span className="text-text-secondary">
									{metrics.totalRoasts}
								</span>
								<span>submissions</span>
							</div>
							<span className="w-1 h-1 rounded-full bg-text-tertiary" />
							<div className="flex items-center gap-1.5">
								<span>avg score:</span>
								<span className="text-text-secondary">
									{metrics.avgScore}/10
								</span>
							</div>
						</div>
					</section>

					{/* Leaderboard Entries List */}
					<Suspense fallback={<LeaderboardSkeleton />}>
						<LeaderboardList />
					</Suspense>
				</div>
			</main>
		</HydrateClient>
	);
}
