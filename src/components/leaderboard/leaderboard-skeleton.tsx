export function LeaderboardSkeleton() {
	return (
		<section className="flex flex-col gap-5 w-full animate-pulse">
			{[...Array(5)].map((_, i) => (
				<div
					key={`leaderboard-skeleton-${
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static
						i
					}`}
					className="flex flex-col w-full border border-border-primary bg-bg-page"
				>
					{/* Meta Row Skeleton */}
					<div className="flex items-center justify-between h-12 px-5 border-b border-border-primary">
						<div className="flex items-center gap-4">
							<div className="h-4 w-12 bg-border-primary/50 rounded" />
							<div className="h-4 w-20 bg-border-primary/50 rounded" />
						</div>
						<div className="flex items-center gap-3">
							<div className="h-3 w-16 bg-border-primary/30 rounded" />
							<div className="h-3 w-12 bg-border-primary/30 rounded" />
						</div>
					</div>

					{/* Code Block Skeleton */}
					<div className="flex w-full bg-bg-input min-h-[120px]">
						<div className="w-10 border-r border-border-primary bg-bg-surface p-2.5 space-y-1.5 flex flex-col items-end">
							<div className="h-3 w-3 bg-border-primary/20 rounded" />
							<div className="h-3 w-3 bg-border-primary/20 rounded" />
							<div className="h-3 w-3 bg-border-primary/20 rounded" />
						</div>
						<div className="flex-1 p-4 space-y-2">
							<div className="h-3 w-3/4 bg-border-primary/30 rounded" />
							<div className="h-3 w-1/2 bg-border-primary/30 rounded" />
							<div className="h-3 w-2/3 bg-border-primary/30 rounded" />
						</div>
					</div>
				</div>
			))}
		</section>
	);
}
