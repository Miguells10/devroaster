import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const scoreRingVariants = tv({
	base: "relative flex items-center justify-center h-[180px] w-[180px]",
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
	className,
	...props
}: ScoreRingProps) => {
	const percentage = (score / maxScore) * 100;
	const radius = 80;
	const stroke = 4;
	const normalizedRadius = radius - stroke * 2;
	const circumference = normalizedRadius * 2 * Math.PI;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	return (
		<div className={scoreRingVariants({ className })} {...props}>
			<svg
				height={radius * 2}
				width={radius * 2}
				className="rotate-[-90deg]"
				aria-label={`Score: ${score.toFixed(1)} out of ${maxScore}`}
				role="img"
			>
				<title>{`Score: ${score.toFixed(1)}`}</title>
				<circle
					stroke="var(--color-border-primary)"
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
						<stop offset="0%" stopColor="var(--color-accent-green)" />
						<stop offset="100%" stopColor="var(--color-accent-amber)" />
					</linearGradient>
				</defs>
			</svg>
			<div className="absolute flex flex-col items-center justify-center font-mono text-center">
				<span className="text-5xl font-bold text-text-primary">
					{score.toFixed(1)}
				</span>
				<span className="text-base text-text-tertiary">/{maxScore}</span>
			</div>
		</div>
	);
};
ScoreRing.displayName = "ScoreRing";
