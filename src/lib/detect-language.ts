import hljs from "highlight.js";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./languages";

export function detectLanguage(code: string): SupportedLanguage {
	if (!code.trim()) return "plaintext";

	try {
		// Use highlight.js auto detection with our supported subset
		const result = hljs.highlightAuto(
			code,
			Object.values(SUPPORTED_LANGUAGES) as string[],
		);

		const language = result.language;

		// Map some highlight.js specific language codes to our supported list
		if (language === "js") return "javascript";
		if (language === "ts") return "typescript";
		if (language === "sh") return "bash";
		if (language === "cs") return "csharp";
		if (language === "c++") return "cpp";

		if (
			language &&
			SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
		) {
			return language as SupportedLanguage;
		}

		return "plaintext";
	} catch (error) {
		console.error("Language detection failed:", error);
		return "plaintext";
	}
}
