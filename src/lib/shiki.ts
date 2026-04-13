import { createHighlighterCore } from "shiki/core";
import getWasm from "shiki/wasm";

let highlighterPromise: ReturnType<typeof createHighlighterCore> | null = null;

export function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighterCore({
			themes: [import("shiki/themes/vesper.mjs")],
			langs: [
				import("shiki/langs/javascript.mjs"),
				import("shiki/langs/typescript.mjs"),
				import("shiki/langs/jsx.mjs"),
				import("shiki/langs/tsx.mjs"),
				import("shiki/langs/python.mjs"),
				import("shiki/langs/rust.mjs"),
				import("shiki/langs/go.mjs"),
				import("shiki/langs/java.mjs"),
				import("shiki/langs/kotlin.mjs"),
				import("shiki/langs/swift.mjs"),
				import("shiki/langs/css.mjs"),
				import("shiki/langs/html.mjs"),
				import("shiki/langs/json.mjs"),
				import("shiki/langs/sql.mjs"),
				import("shiki/langs/bash.mjs"),
				import("shiki/langs/php.mjs"),
				import("shiki/langs/ruby.mjs"),
				import("shiki/langs/csharp.mjs"),
				import("shiki/langs/cpp.mjs"),
				import("shiki/langs/markdown.mjs"),
				import("shiki/langs/dockerfile.mjs"),
				import("shiki/langs/yaml.mjs"),
				import("shiki/langs/toml.mjs"),
			],
			loadWasm: getWasm,
		});
	}
	return highlighterPromise;
}
