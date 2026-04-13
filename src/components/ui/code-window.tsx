import { cn } from "@/lib/utils";

interface CodeWindowProps {
	children: React.ReactNode;
	title?: string;
	className?: string;
	showDots?: boolean;
}

/**
 * A wrapper component that provides a macOS-style window frame.
 * Includes the traffic light dots and an optional title/filename.
 */
export function CodeWindow({
	children,
	title,
	className,
	showDots = true,
}: CodeWindowProps) {
	return (
		<div
			className={cn(
				"rounded-lg border border-border-primary bg-bg-surface overflow-hidden shadow-sm flex flex-col",
				className,
			)}
		>
			{/* Header */}
			<div className="h-10 border-b border-border-primary flex items-center justify-between px-4 shrink-0 bg-bg-surface/50">
				{showDots && (
					<div className="flex gap-1.5 w-[100px]">
						<div className="w-2.5 h-2.5 rounded-full bg-accent-red/20 border border-accent-red/10" />
						<div className="w-2.5 h-2.5 rounded-full bg-accent-amber/20 border border-accent-amber/10" />
						<div className="w-2.5 h-2.5 rounded-full bg-accent-green/20 border border-accent-green/10" />
					</div>
				)}

				{title && (
					<div className="flex-1 text-center">
						<span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest leading-none">
							{title}
						</span>
					</div>
				)}

				{showDots && <div className="w-[100px]" />}
			</div>

			{/* Content */}
			<div className="p-4 overflow-auto">{children}</div>
		</div>
	);
}
