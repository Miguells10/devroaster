import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { Navbar } from "@/components/ui/navbar";
import { ScoreRing } from "@/components/ui/score-ring";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table-row";
import { Typography } from "@/components/ui/typography";

export default function DemoPage() {
	const sampleCode = `function hello() {
  console.log("hello world");
  return {
    status: "roasted",
    score: 3.5
  };
}`;

	return (
		<div className="min-h-screen bg-bg-page">
			<Navbar />

			<main className="p-12 space-y-16 max-w-6xl mx-auto">
				<section className="space-y-6 text-center py-12 border-b border-border-primary">
					<Typography variant="h1">paste your code. get roasted.</Typography>
					<Typography variant="subtitle">
						The most brutal code review tool in the market.
					</Typography>
				</section>

				<section className="space-y-8">
					<Typography variant="h2">typography</Typography>
					<div className="space-y-4">
						<Typography variant="h1">Heading 1 (36pt Bolt Mono)</Typography>
						<Typography variant="h3">Heading 3 (18pt Medium Mono)</Typography>
						<Typography variant="body">
							Body text (14pt Regular Sans-serif is recommended by user rules,
							but here we use Mono for the tech vibe where appropriate).
						</Typography>
						<Typography variant="subtitle">
							Subtitle / Tertiary text (12pt Regular Mono)
						</Typography>
					</div>
				</section>

				<section className="space-y-8">
					<Typography variant="h2">buttons</Typography>
					<div className="flex items-center gap-4">
						<Button variant="primary">Primary Action</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="link">Link Style</Button>
						<Button variant="primary" size="sm">
							Small Bold
						</Button>
					</div>
				</section>

				<section className="space-y-8">
					<Typography variant="h2">toggle (base-ui)</Typography>
					<div className="flex items-center gap-8">
						<div className="flex items-center gap-2 text-sm font-mono text-foreground/60">
							<Switch defaultChecked />
							<span>On</span>
						</div>
						<div className="flex items-center gap-2 text-sm font-mono text-foreground/60">
							<Switch />
							<span>Off</span>
						</div>
					</div>
				</section>

				<section className="space-y-8">
					<Typography variant="h2">badges</Typography>
					<div className="flex items-center gap-4">
						<Badge variant="critical">Critical</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="good">Good</Badge>
						<Badge variant="verdict">3.5/5.0</Badge>
					</div>
				</section>

				<section className="space-y-8">
					<Typography variant="h2">score_ring</Typography>
					<div className="flex items-center gap-12">
						<ScoreRing score={3.5} maxScore={10} />
						<ScoreRing score={8.2} maxScore={10} size="sm" />
					</div>
				</section>

				<section className="space-y-8">
					<Typography variant="h2">diff_line</Typography>
					<div className="max-w-xl border border-border-primary rounded-lg overflow-hidden bg-bg-surface">
						<DiffLine type="removed" code="var total = 0;" />
						<DiffLine type="added" code="const total = 0;" />
						<DiffLine
							type="context"
							code="for (let i = 0; i < items.length; i++) {"
						/>
					</div>
				</section>

				<section className="space-y-8">
					<Typography variant="h2">table_row</Typography>
					<div className="border-t border-border-primary">
						<TableRow>
							<TableCell width="40px">#1</TableCell>
							<TableCell width="60px" className="text-accent-red font-bold">
								2.1
							</TableCell>
							<TableCell className="flex-1 text-foreground/60 truncate">
								function calculateTotal(items) {"{ var total = 0; ... }"}
							</TableCell>
							<TableCell
								width="100px"
								className="text-right text-foreground/40"
							>
								javascript
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width="40px">#2</TableCell>
							<TableCell width="60px" className="text-accent-amber font-bold">
								5.5
							</TableCell>
							<TableCell className="flex-1 text-foreground/60 truncate">
								{"const hello = () => console.log(\"world\");"}
							</TableCell>
							<TableCell
								width="100px"
								className="text-right text-foreground/40"
							>
								typescript
							</TableCell>
						</TableRow>
					</div>
				</section>

				<section className="space-y-8">
					<Typography variant="h2">cards</Typography>
					<Card>
						<div className="space-y-2">
							<Badge variant="critical">Critical</Badge>
							<Typography variant="h3">
								using var instead of const/let
							</Typography>
							<Typography variant="subtitle">
								the var keyword is function-scoped rather than block-scoped,
								which can lead to unexpected behavior and bugs.
							</Typography>
						</div>
					</Card>
				</section>

				<section className="space-y-8">
					<Typography variant="h2">
						code_block (shiki server component)
					</Typography>
					<div className="max-w-2xl">
						<CodeBlock code={sampleCode} lang="javascript" />
					</div>
				</section>
			</main>
		</div>
	);
}
