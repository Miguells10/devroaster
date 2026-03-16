import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const scoreRingVariants = tv({
	base: "relative flex items-center justify-center",
	variants: {
		size: {
			default: "h-[180px] w-[180px]",
			sm: "h-[120px] w-[120px]",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

export interface ScoreRingProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof scoreRingVariants> {
	score: number;
	maxScore?: number;
}

export const ScoreRing = ({
	score,
	maxScore = 10,
	size,
	className,
	...props
}: ScoreRingProps) => {
	const percentage = (score / maxScore) * 100;
	const radius = size === "sm" ? 50 : 80;
	const stroke = 4;
	const normalizedRadius = radius - stroke * 2;
	const circumference = normalizedRadius * 2 * Math.PI;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	return (
		<div className={scoreRingVariants({ size, className })} {...props}>
			<svg
				height={radius * 2}
				width={radius * 2}
				className="rotate-[-90deg]"
				aria-label={`Score: ${score.toFixed(1)} out of ${maxScore}`}
				role="img"
			>
				<title>{`Score: ${score.toFixed(1)}`}</title>
				<circle
					stroke="var(--border-primary)"
					fill="transparent"
					strokeWidth={stroke}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
				/>
				<circle
					stroke="url(#scoreGradient)"
					fill="transparent"
					strokeWidth={stroke}
					strokeDasharray={`${circumference} ${circumference}`}
					style={{ strokeDashoffset }}
					strokeLinecap="round"
					r={normalizedRadius}
					cx={radius}
					cy={radius}
					className="transition-all duration-1000 ease-out"
				/>
				<defs>
					<linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="var(--accent-green)" />
						<stop offset="100%" stopColor="var(--accent-amber)" />
					</linearGradient>
				</defs>
			</svg>
			<div className="absolute flex flex-col items-center justify-center font-mono">
				<span
					className={
						size === "sm"
							? "text-3xl font-bold"
							: "text-5xl font-bold text-foreground"
					}
				>
					{score.toFixed(1)}
				</span>
				<span
					className={
						size === "sm"
							? "text-xs text-foreground/40"
							: "text-base text-foreground/40"
					}
				>
					/{maxScore}
				</span>
			</div>
		</div>
	);
};
ScoreRing.displayName = "ScoreRing";
