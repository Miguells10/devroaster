"use client";

import NumberFlow from "@number-flow/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function HomeMetrics() {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.metrics.getOverview.queryOptions());

	return (
		<section className="flex items-center gap-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
			<div className="flex items-center gap-1.5">
				<NumberFlow
					value={data.totalRoasts}
					format={{ useGrouping: true }}
					suffix=" codes roasted"
				/>
			</div>
			<span className="w-1 h-1 rounded-full bg-text-tertiary" />
			<div className="flex items-center gap-1.5">
				<span>avg score: </span>
				<NumberFlow
					value={Number(data.avgScore)}
					format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
					suffix="/10"
				/>
			</div>
		</section>
	);
}
