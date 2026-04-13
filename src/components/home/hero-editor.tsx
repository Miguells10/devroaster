"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	CodeEditor,
	CodeEditorBody,
	CodeEditorHeader,
} from "@/components/ui/code-editor";
import { Switch } from "@/components/ui/switch";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";

export function HeroEditor() {
	const [code, setCode] = useState("");
	const highlighted = useHighlightedCode({ code });

	return (
		<section className="w-full flex flex-col items-center gap-6">
			<CodeEditor>
				<CodeEditorHeader
					filename="new_roast.js"
					activeLanguage={highlighted.activeLanguage}
					isAutoDetecting={highlighted.isAutoDetecting}
					manualLanguage={highlighted.manualLanguage}
					onLanguageChange={highlighted.setManualLanguage}
				/>
				<CodeEditorBody
					value={code}
					onChange={setCode}
					html={highlighted.html}
				/>
			</CodeEditor>

			{/* Actions Bar */}
			<div className="w-full max-w-[780px] flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-border-primary bg-bg-surface">
						<Switch />
						<span className="text-xs font-mono text-text-tertiary uppercase tracking-tighter">
							{"// maximum sarcasm enabled"}
						</span>
					</div>
				</div>

				<Button variant="primary" className="gap-2">
					<span className="opacity-50">$</span>
					roast_my_code
				</Button>
			</div>
		</section>
	);
}
