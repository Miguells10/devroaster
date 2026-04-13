"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	CodeEditor,
	CodeEditorBody,
	CodeEditorHeader,
} from "@/components/ui/code-editor";
import { Switch } from "@/components/ui/switch";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { trpc } from "@/trpc/client";
import { getSessionId } from "@/lib/session";
import { Loader2 } from "lucide-react";

export function HeroEditor() {
	const router = useRouter();
	const [code, setCode] = useState("");
	const [isSarcastic, setIsSarcastic] = useState(false);
	const highlighted = useHighlightedCode({ code });

	const createRoast = trpc.roasts.create.useMutation({
		onSuccess: (data) => {
			router.push(`/roast/${data.id}`);
		},
		onError: (error) => {
			alert(error.message);
		},
	});

	const handleRoast = () => {
		if (!code.trim()) return;

		createRoast.mutate({
			code,
			language: highlighted.activeLanguage,
			mode: isSarcastic ? "sarcastic" : "honest",
			sessionId: getSessionId(),
		});
	};

	const isProcessing = createRoast.isPending;

	return (
		<section className="w-full flex flex-col items-center gap-6 relative">
			{isProcessing && (
				<div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-bg-page/80 backdrop-blur-sm border-2 border-dashed border-accent-red animate-pulse">
					<div className="flex flex-col items-center gap-4 p-8 bg-bg-surface border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
						<Loader2 className="w-12 h-12 animate-spin text-accent-red" />
						<div className="flex flex-col items-center gap-1">
							<span className="font-mono text-xl font-bold uppercase tracking-tighter">
								Burning your code...
							</span>
							<span className="font-mono text-xs text-text-tertiary">
								{isSarcastic
									? "consulting the gods of shame"
									: "analyzing technical debt"}
							</span>
						</div>
					</div>
				</div>
			)}

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
						<Switch checked={isSarcastic} onCheckedChange={setIsSarcastic} />
						<span className="text-xs font-mono text-text-tertiary uppercase tracking-tighter">
							{"// maximum sarcasm enabled"}
						</span>
					</div>
				</div>

				<Button
					variant="primary"
					className="gap-2"
					onClick={handleRoast}
					disabled={isProcessing || !code.trim()}
				>
					<span className="opacity-50">$</span>
					{isProcessing ? "roasting..." : "roast_my_code"}
				</Button>
			</div>
		</section>
	);
}

