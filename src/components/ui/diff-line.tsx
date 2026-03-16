import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLineVariants = tv({
	base: "flex items-start gap-4 px-4 py-2 font-mono text-sm border-l-2",
	variants: {
		type: {
			added: "bg-[#0A1A0F] border-[#10B981] text-foreground",
			removed: "bg-[#1A0A0A] border-[#EF4444] text-foreground/60",
			context: "bg-transparent border-transparent text-foreground/60",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

export interface DiffLineProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof diffLineVariants> {
	code: string;
}

export const DiffLine = ({ type, code, className, ...props }: DiffLineProps) => {
	const prefix = type === "added" ? "+" : type === "removed" ? "-" : " ";
	const prefixColor =
		type === "added"
			? "text-accent-green"
			: type === "removed"
				? "text-accent-red"
				: "text-foreground/20";

	return (
		<div className={diffLineVariants({ type, className })} {...props}>
			<span className={`w-4 shrink-0 font-bold ${prefixColor}`}>{prefix}</span>
			<span className="whitespace-pre-wrap flex-1">{code}</span>
		</div>
	);
};
DiffLine.displayName = "DiffLine";
