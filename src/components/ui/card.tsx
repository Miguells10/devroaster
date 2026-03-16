import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const cardVariants = tv({
	base: "bg-bg-page border border-border-primary p-5 flex flex-col gap-3",
	variants: {
		width: {
			default: "w-full max-w-[480px]",
			full: "w-full",
		},
	},
	defaultVariants: {
		width: "default",
	},
});

export interface CardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {}

function Card({ className, width, ...props }: CardProps) {
	return <div className={cardVariants({ width, className })} {...props} />;
}

export { Card, cardVariants };
