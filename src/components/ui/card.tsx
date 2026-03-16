import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const cardVariants = tv({
	base: "bg-bg-page border border-border-primary flex flex-col gap-3",
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

export function Card({ className, width, ...props }: CardProps) {
	return <div className={cardVariants({ width, className })} {...props} />;
}

export function CardHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("flex flex-col space-y-1.5 p-6 pb-0", className)}
			{...props}
		/>
	);
}

export function CardTitle({
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={cn("text-lg font-bold font-mono tracking-tight", className)}
			{...props}
		/>
	);
}

export function CardDescription({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			className={cn("text-sm text-text-tertiary font-mono", className)}
			{...props}
		/>
	);
}

export function CardContent({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex items-center p-6 pt-0", className)} {...props} />
	);
}
