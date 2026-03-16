"use client";

import { cn } from "@/lib/utils";

export const CodeEditor = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={cn(
				"w-full max-w-[780px] border border-border-primary rounded-lg overflow-hidden bg-bg-input flex flex-col h-[360px] shadow-2xl",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export const CodeEditorHeader = ({
	filename,
	className,
}: { filename: string; className?: string }) => {
	return (
		<div
			className={cn(
				"h-10 border-b border-border-primary flex items-center px-4 gap-2 shrink-0",
				className,
			)}
		>
			<div className="flex gap-1.5">
				<div className="w-3 h-3 rounded-full bg-accent-red/20" />
				<div className="w-3 h-3 rounded-full bg-accent-amber/20" />
				<div className="w-3 h-3 rounded-full bg-accent-green/20" />
			</div>
			<div className="flex-1 text-center">
				<span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
					{filename} — editor
				</span>
			</div>
		</div>
	);
};

export const CodeEditorBody = ({
	value,
	onChange,
	placeholder = "// paste your garbage code here...",
	className,
}: {
	value: string;
	onChange: (val: string) => void;
	placeholder?: string;
	className?: string;
}) => {
	return (
		<div className={cn("flex-1 flex overflow-hidden", className)}>
			{/* Line Numbers */}
			<div className="w-12 bg-bg-surface border-r border-border-primary flex flex-col py-4 items-end px-3 select-none shrink-0">
				{Array.from({ length: 15 }).map((_, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: Static display
						key={i}
						className="text-[11px] font-mono text-text-tertiary leading-6"
					>
						{i + 1}
					</span>
				))}
			</div>

			{/* Textarea */}
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="flex-1 bg-transparent p-4 font-mono text-sm resize-none focus:outline-none text-text-primary leading-6 placeholder:text-text-tertiary"
				placeholder={placeholder}
				spellCheck={false}
			/>
		</div>
	);
};
