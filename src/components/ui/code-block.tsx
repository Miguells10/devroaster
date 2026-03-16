import { codeToHtml } from "shiki";

interface CodeBlockProps {
	code: string;
	lang?: string;
}

export async function CodeBlock({ code, lang = "javascript" }: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang,
		theme: "vesper",
	});

	return (
		<div className="relative group">
			<div
				className="rounded-lg border border-border-primary bg-bg-surface [&>pre]:!bg-transparent [&>pre]:p-4 [&>pre]:overflow-x-auto text-sm font-mono"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
