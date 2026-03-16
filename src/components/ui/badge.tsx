import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
	base: "inline-flex items-center px-2 py-0.5 text-[10px] font-bold font-mono tracking-tight uppercase",
	variants: {
		variant: {
			critical: "text-accent-red",
			warning: "text-accent-amber",
			good: "text-accent-green",
			verdict: "text-text-primary bg-bg-surface border border-border-primary",
		},
	},
	defaultVariants: {
		variant: "verdict",
	},
});

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={badgeVariants({ variant, className })} {...props}>
			{variant !== "verdict" && (
				<span className="mr-1.5 h-1 w-1 rounded-full bg-current" />
			)}
			{props.children}
		</div>
	);
}

export { Badge, badgeVariants };
