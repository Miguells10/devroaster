export function LeaderboardSkeleton() {
	return (
		<section className="flex flex-col gap-8 w-full animate-pulse">
			{[...Array(3)].map((_, i) => (
				<div
					key={`leaderboard-skeleton-${
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static
						i
					}`}
					className="flex flex-col w-full border border-border-primary bg-bg-page h-[450px]"
				>
					{/* Meta Row Skeleton */}
					<div className="h-10 px-4 border-b border-border-primary bg-bg-surface/50 flex items-center justify-between">
						<div className="flex gap-4">
							<div className="h-3 w-12 bg-border-primary/50 rounded" />
							<div className="h-3 w-16 bg-border-primary/50 rounded" />
						</div>
						<div className="h-3 w-24 bg-border-primary/30 rounded" />
					</div>

					{/* Content Skeleton */}
					<div className="p-6 flex flex-col gap-6">
						<div className="space-y-2">
							<div className="h-2 w-16 bg-accent-red/20 rounded" />
							<div className="h-6 w-3/4 bg-border-primary/50 rounded" />
						</div>
						<div className="h-16 w-full border-l-2 border-accent-amber/30 bg-bg-surface/30 rounded-r" />
						<div className="space-y-3">
							<div className="h-3 w-32 bg-border-primary/30 rounded" />
							<div className="h-40 w-full bg-bg-input border border-border-primary rounded" />
						</div>
						<div className="flex justify-end">
							<div className="h-9 w-32 bg-bg-surface border border-border-primary rounded" />
						</div>
					</div>
				</div>
			))}
		</section>
	);
}
