import Link from "next/link";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const navbarVariants = tv({
	base: "flex h-14 items-center gap-4 border-b border-border-primary bg-bg-page px-6",
});

export const Navbar = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLElement>) => {
	return (
		<nav className={navbarVariants({ className })} aria-label="Main Navigation" {...props}>
			{children}
		</nav>
	);
};

export const NavbarBrand = ({
	href = "/",
	children,
	className,
}: { href?: string; children: React.ReactNode; className?: string }) => {
	return (
		<Link href={href} className={cn("flex items-center gap-2 font-mono group", className)}>
			<span
				className="text-xl font-bold text-accent-green group-hover:translate-x-0.5 transition-transform"
				aria-hidden="true"
			>
				{">"}
			</span>
			<span className="text-lg font-medium text-foreground tracking-tight">
				{children}
			</span>
		</Link>
	);
};

export const NavbarContent = ({
	className,
	children,
}: { className?: string; children: React.ReactNode }) => {
	return (
		<div className={cn("flex items-center gap-6 text-sm font-mono ml-auto", className)}>
			{children}
		</div>
	);
};

export const NavbarLink = ({
	href,
	children,
	className,
}: { href: string; children: React.ReactNode; className?: string }) => {
	return (
		<Link
			href={href}
			className={cn("text-foreground/60 hover:text-foreground transition-colors", className)}
		>
			{children}
		</Link>
	);
};

Navbar.displayName = "Navbar";
