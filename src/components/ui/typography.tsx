import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const typographyVariants = tv({
	base: "font-mono",
	variants: {
		variant: {
			h1: "text-4xl font-bold tracking-tight text-foreground",
			h2: "text-xl font-bold text-accent-green",
			h3: "text-lg font-bold text-foreground",
			body: "text-sm text-foreground/80 leading-relaxed",
			subtitle: "text-sm text-foreground/40",
			code: "text-xs text-foreground/60",
		},
	},
	defaultVariants: {
		variant: "body",
	},
});

export interface TypographyProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof typographyVariants> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export const Typography = ({
	variant,
	as: Component = "p",
	className,
	children,
	...props
}: TypographyProps) => {
	const isH2 = variant === "h2";
	return (
		<Component className={typographyVariants({ variant, className })} {...props}>
			{isH2 && <span className="mr-2 text-accent-green">{"//"}</span>}
			{children}
		</Component>
	);
};

Typography.displayName = "Typography";
