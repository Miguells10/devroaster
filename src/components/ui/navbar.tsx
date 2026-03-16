import Link from "next/link";
import { tv } from "tailwind-variants";

const navbarVariants = tv({
	base: "flex h-14 items-center gap-4 border-b border-border-primary bg-bg-page px-6",
});

export const Navbar = ({ className }: { className?: string }) => {
	return (
		<nav className={navbarVariants({ className })} aria-label="Main Navigation">
			<Link href="/" className="flex items-center gap-2 font-mono group">
				<span
					className="text-xl font-bold text-accent-green group-hover:translate-x-0.5 transition-transform"
					aria-hidden="true"
				>
					{">"}
				</span>
				<span className="text-lg font-medium text-foreground tracking-tight">
					devroast
				</span>
			</Link>

			<div className="flex-1" />

			<div className="flex items-center gap-6 text-sm font-mono">
				<Link
					href="/leaderboard"
					className="text-foreground/60 hover:text-foreground transition-colors"
				>
					leaderboard
				</Link>
			</div>
		</nav>
	);
};
Navbar.displayName = "Navbar";
