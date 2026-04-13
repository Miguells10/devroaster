import { codeToHtml } from "shiki";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
	code: string;
	lang?: string;
	className?: string;
}

/**
 * A "naked" code highlighter component.
 * Just the code, no borders or extra padding by default.
 */
export async function CodeBlock({
	code,
	lang = "javascript",
	className,
}: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang,
		theme: "vesper",
	});

	return (
		<div
			className={cn(
				"font-mono text-sm [&>pre]:!bg-transparent [&>pre]:p-0 [&>pre]:overflow-x-auto",
				className,
			)}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
