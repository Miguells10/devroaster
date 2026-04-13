export function HomeMetricsSkeleton() {
	return (
		<section className="flex items-center gap-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest animate-pulse">
			<div className="flex items-center gap-1.5 min-w-[120px]">
				<div className="h-3 w-8 bg-text-tertiary/20 rounded-sm" />
				<span>codes roasted</span>
			</div>
			<span className="w-1 h-1 rounded-full bg-text-tertiary" />
			<div className="flex items-center gap-1.5 min-w-[100px]">
				<span>avg score: </span>
				<div className="h-3 w-6 bg-text-tertiary/20 rounded-sm" />
				<span>/10</span>
			</div>
		</section>
	);
}
