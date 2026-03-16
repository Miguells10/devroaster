"use client";

import { useState } from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	CodeEditor,
	CodeEditorHeader,
	CodeEditorBody,
} from "@/components/ui/code-editor";
import { TableRow, TableCell } from "@/components/ui/table-row";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
	const [code, setCode] = useState("");

	return (
		<main className="py-20 flex flex-col items-center space-y-16">
			{/* Hero Section */}
			<section className="text-center space-y-4 max-w-2xl">
				<div className="flex items-center justify-center gap-3">
					<span className="text-4xl font-bold text-accent-green font-mono">
						$
					</span>
					<Typography variant="h1" className="text-5xl">
						paste your code. get roasted.
					</Typography>
				</div>
				<Typography variant="body" className="text-base text-text-secondary">
					{"// drop your code below and we'll rate it — brutally honest or full roast mode"}
				</Typography>
			</section>

			{/* Editor Section */}
			<section className="w-full flex flex-col items-center gap-6">
				<CodeEditor>
					<CodeEditorHeader filename="new_roast.js" />
					<CodeEditorBody value={code} onChange={setCode} />
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

			{/* Stats / Footer Hint */}
			<section className="flex items-center gap-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
				<span>2,847 codes roasted</span>
				<span className="w-1 h-1 rounded-full bg-text-tertiary" />
				<span>avg score: 4.2/10</span>
			</section>

			{/* Leaderboard Preview */}
			<section className="w-full max-w-[960px] space-y-8 pt-12">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Typography variant="h2">leaderboard_preview</Typography>
						<Typography variant="subtitle">
							{"// the worst code on the internet, ranked by shame"}
						</Typography>
					</div>
					<Button variant="secondary" size="sm">
						view_all_roasts
					</Button>
				</div>

				<div className="border border-border-primary rounded-xl overflow-hidden bg-bg-page shadow-sm">
					{/* Header */}
					<div className="flex items-center gap-6 px-5 py-3 border-b border-border-primary bg-bg-surface text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
						<div className="w-10">rank</div>
						<div className="w-16">score</div>
						<div className="flex-1">code_preview</div>
						<div className="w-24 text-right">lang</div>
					</div>

					<TableRow className="border-b border-border-primary/50">
						<TableCell width="40px" className="text-text-tertiary">
							#1
						</TableCell>
						<TableCell width="60px">
							<Badge variant="critical">2.1</Badge>
						</TableCell>
						<TableCell className="flex-1 truncate text-text-secondary pr-10">
							{"function calculateTotal(items) { var total = 0; ... }"}
						</TableCell>
						<TableCell width="100px" className="text-right text-text-tertiary">
							javascript
						</TableCell>
					</TableRow>

					<TableRow className="border-b border-border-primary/50">
						<TableCell width="40px" className="text-text-tertiary">
							#2
						</TableCell>
						<TableCell width="60px">
							<Badge variant="warning">4.5</Badge>
						</TableCell>
						<TableCell className="flex-1 truncate text-text-secondary pr-10">
							{"const getData = () => { return fetch('/api').then(...) }"}
						</TableCell>
						<TableCell width="100px" className="text-right text-text-tertiary">
							typescript
						</TableCell>
					</TableRow>

					<TableRow className="border-none">
						<TableCell width="40px" className="text-text-tertiary">
							#3
						</TableCell>
						<TableCell width="60px">
							<Badge variant="good">7.8</Badge>
						</TableCell>
						<TableCell className="flex-1 truncate text-text-secondary pr-10">
							{"class User { constructor(name) { this.name = name; } }"}
						</TableCell>
						<TableCell width="100px" className="text-right text-text-tertiary">
							python
						</TableCell>
					</TableRow>
				</div>

				<div className="text-center py-4">
					<Typography variant="subtitle" className="hover:text-text-secondary cursor-pointer transition-colors">
						{"showing top 3 of 2,847 · view full leaderboard >>"}
					</Typography>
				</div>
			</section>
		</main>
	);
}
