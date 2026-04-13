"use client";

import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/languages";
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
	activeLanguage,
	isAutoDetecting,
	manualLanguage,
	onLanguageChange,
	className,
}: {
	filename: string;
	activeLanguage?: string;
	isAutoDetecting?: boolean;
	manualLanguage?: SupportedLanguage | "auto";
	onLanguageChange?: (lang: SupportedLanguage | "auto") => void;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				"h-10 border-b border-border-primary flex items-center justify-between px-4 shrink-0 bg-bg-surface/50",
				className,
			)}
		>
			<div className="flex gap-1.5 w-[140px]">
				<div className="w-3 h-3 rounded-full bg-accent-red/20" />
				<div className="w-3 h-3 rounded-full bg-accent-amber/20" />
				<div className="w-3 h-3 rounded-full bg-accent-green/20" />
			</div>

			<div className="flex-1 text-center">
				<span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
					{filename} — editor
				</span>
			</div>

			<div className="flex justify-end w-[140px]">
				{onLanguageChange && (
					<div className="relative group flex items-center">
						<select
							value={manualLanguage}
							onChange={(e) =>
								onLanguageChange(e.target.value as SupportedLanguage | "auto")
							}
							className="appearance-none bg-transparent hover:bg-bg-page/50 border border-transparent hover:border-border-primary text-[10px] font-mono text-text-tertiary uppercase tracking-widest py-1 pl-2 pr-6 rounded cursor-pointer outline-none transition-colors"
						>
							<option value="auto">auto-detect</option>
							<option disabled>──────────</option>
							{SUPPORTED_LANGUAGES.map((lang) => (
								<option key={lang} value={lang}>
									{lang}
								</option>
							))}
						</select>
						<ChevronDown className="w-3 h-3 text-text-tertiary absolute right-1.5 pointer-events-none group-hover:text-text-secondary transition-colors" />
						{isAutoDetecting &&
							activeLanguage &&
							activeLanguage !== "plaintext" && (
								<span className="absolute -left-20 top-1/2 -translate-y-1/2 text-[9px] font-mono text-accent-green/80 uppercase tracking-tighter pointer-events-none">
									({activeLanguage})
								</span>
							)}
					</div>
				)}
			</div>
		</div>
	);
};

export const CodeEditorBody = ({
	value,
	onChange,
	html,
	placeholder = "// paste your garbage code here...",
	className,
}: {
	value: string;
	onChange: (val: string) => void;
	html?: string;
	placeholder?: string;
	className?: string;
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const preRef = useRef<HTMLPreElement>(null);

	const handleScroll = () => {
		if (textareaRef.current && preRef.current) {
			preRef.current.scrollTop = textareaRef.current.scrollTop;
			preRef.current.scrollLeft = textareaRef.current.scrollLeft;
		}
	};

	const lineCount = Math.max(15, value.split("\n").length);

	return (
		<div className={cn("flex-1 flex overflow-hidden relative", className)}>
			{/* Line Numbers */}
			<div
				className="w-12 bg-bg-surface border-r border-border-primary flex flex-col py-4 items-end px-3 select-none shrink-0 overflow-hidden"
				style={{
					transform: textareaRef.current
						? `translateY(-${textareaRef.current.scrollTop}px)`
						: "none",
				}}
			>
				{Array.from({ length: lineCount }).map((_, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: Static line numbers
						key={i}
						className="text-[11px] font-mono text-text-tertiary leading-6 h-6 flex items-center justify-end"
					>
						{i + 1}
					</span>
				))}
			</div>

			{/* Editor Area */}
			<div className="flex-1 relative overflow-hidden bg-bg-page">
				{/* Highlighted HTML (Background) */}
				{html && (
					<pre
						ref={preRef}
						className="absolute inset-0 p-4 font-mono text-sm leading-6 pointer-events-none overflow-hidden m-0 [&>code]:!bg-transparent text-left"
						aria-hidden="true"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is safe
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				)}

				{/* Textarea (Foreground) */}
				<textarea
					ref={textareaRef}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onScroll={handleScroll}
					className={cn(
						"absolute inset-0 p-4 font-mono text-sm resize-none focus:outline-none leading-6 whitespace-pre",
						html
							? "text-transparent caret-white"
							: "text-text-primary placeholder:text-text-tertiary",
						"bg-transparent",
					)}
					placeholder={placeholder}
					spellCheck={false}
				/>
			</div>
		</div>
	);
};
