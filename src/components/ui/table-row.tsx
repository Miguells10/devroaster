import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const tableRowVariants = tv({
	base: "flex items-center gap-6 px-5 py-4 border-b border-border-primary hover:bg-bg-surface transition-colors font-mono",
});

export interface TableRowProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof tableRowVariants> {}

export const TableRow = ({ className, children, ...props }: TableRowProps) => {
	return (
		<div className={tableRowVariants({ className })} {...props}>
			{children}
		</div>
	);
};

export const TableCell = ({
	className,
	width,
	children,
}: { className?: string; width?: string; children: React.ReactNode }) => {
	return (
		<div className={className} style={{ width }}>
			{children}
		</div>
	);
};
