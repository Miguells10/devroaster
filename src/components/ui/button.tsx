import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green disabled:pointer-events-none disabled:opacity-50 font-mono",
	variants: {
		variant: {
			primary: "bg-accent-green text-bg-page hover:bg-accent-green/90 font-bold",
			secondary:
				"bg-transparent text-foreground border border-border-primary hover:bg-bg-surface",
			link: "text-foreground underline-offset-4 hover:underline border border-border-primary",
		},
		size: {
			default: "h-10 px-6 py-2.5",
			sm: "h-8 px-4 text-xs font-bold",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "default",
	},
});

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
	return (
		<button
			className={buttonVariants({ variant, size, className })}
			{...props}
		/>
	);
};
Button.displayName = "Button";

export { Button, buttonVariants };
