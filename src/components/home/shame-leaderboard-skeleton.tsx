import { TableCell, TableRow } from "@/components/ui/table-row";

export function ShameLeaderboardSkeleton() {
	return (
		<div className="w-full max-w-[960px] animate-pulse space-y-8 pt-12">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<div className="h-8 w-48 bg-border-primary/50 rounded-md" />
					<div className="h-4 w-64 bg-border-primary/30 rounded-md" />
				</div>
				<div className="h-9 w-32 bg-border-primary/50 rounded-md" />
			</div>

			<div className="border border-border-primary rounded-xl overflow-hidden bg-bg-page shadow-sm">
				{/* Header */}
				<div className="flex items-center gap-6 px-5 py-3 border-b border-border-primary bg-bg-surface text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
					<div className="w-10">rank</div>
					<div className="w-16">score</div>
					<div className="flex-1">code_preview</div>
					<div className="w-24 text-right">lang</div>
				</div>

				{[...Array(3)].map((_, i) => (
					<TableRow
						key={`skeleton-${
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are static
							i
						}`}
						className="border-b border-border-primary/50"
					>
						<TableCell width="40px">
							<div className="h-4 w-4 bg-border-primary/30 rounded" />
						</TableCell>
						<TableCell width="60px">
							<div className="h-6 w-10 bg-border-primary/50 rounded-md" />
						</TableCell>
						<TableCell className="flex-1 pr-10">
							<div className="h-4 w-full bg-border-primary/20 rounded" />
						</TableCell>
						<TableCell width="100px" className="flex justify-end">
							<div className="h-4 w-16 bg-border-primary/30 rounded" />
						</TableCell>
					</TableRow>
				))}
			</div>

			<div className="flex justify-center py-4">
				<div className="h-4 w-40 bg-border-primary/30 rounded" />
			</div>
		</div>
	);
}
