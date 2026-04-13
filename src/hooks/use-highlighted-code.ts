import { useCallback, useEffect, useRef, useState } from "react";
import { detectLanguage } from "@/lib/detect-language";
import type { SupportedLanguage } from "@/lib/languages";
import { getHighlighter } from "@/lib/shiki";

interface UseHighlightedCodeProps {
	code: string;
	defaultLanguage?: SupportedLanguage | "auto";
	debounceMs?: number;
}

export function useHighlightedCode({
	code,
	defaultLanguage = "auto",
	debounceMs = 300,
}: UseHighlightedCodeProps) {
	const [html, setHtml] = useState<string>("");
	const [activeLanguage, setActiveLanguage] =
		useState<SupportedLanguage>("plaintext");
	const [isAutoDetecting, setIsAutoDetecting] = useState(
		defaultLanguage === "auto",
	);
	const [manualLanguage, setManualLanguage] = useState<
		SupportedLanguage | "auto"
	>(defaultLanguage);
	const [isHighlighting, setIsHighlighting] = useState(false);

	const timeoutRef = useRef<NodeJS.Timeout>(null);

	// Function to perform the actual highlight
	const performHighlight = useCallback(
		async (codeToHighlight: string, lang: SupportedLanguage) => {
			if (!codeToHighlight.trim()) {
				setHtml("");
				setIsHighlighting(false);
				return;
			}

			try {
				const highlighter = await getHighlighter();
				const resultHtml = highlighter.codeToHtml(codeToHighlight, {
					lang: lang === "plaintext" ? "text" : lang,
					theme: "vesper",
				});
				setHtml(resultHtml);
			} catch (error) {
				console.error("Syntax highlighting failed:", error);
				// Fallback to safe plain text rendering
				setHtml(
					`<pre><code>${codeToHighlight
						.replace(/&/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;")}</code></pre>`,
				);
			} finally {
				setIsHighlighting(false);
			}
		},
		[],
	);

	useEffect(() => {
		setIsHighlighting(true);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(async () => {
			let targetLang: SupportedLanguage;

			if (manualLanguage === "auto") {
				setIsAutoDetecting(true);
				targetLang = detectLanguage(code);
			} else {
				setIsAutoDetecting(false);
				targetLang = manualLanguage;
			}

			setActiveLanguage(targetLang);
			await performHighlight(code, targetLang);
		}, debounceMs);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [code, manualLanguage, debounceMs, performHighlight]);

	return {
		html,
		activeLanguage,
		isAutoDetecting,
		isHighlighting,
		manualLanguage,
		setManualLanguage,
	};
}
