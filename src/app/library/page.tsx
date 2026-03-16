import { Button } from "@/components/ui/button";

export default function LibraryPage() {
	return (
		<div className="min-h-screen bg-bg-page text-foreground p-8 font-geist">
			<div className="max-w-5xl mx-auto space-y-12">
				<header className="space-y-4 border-b border-border-primary pb-8">
					<div className="flex items-center gap-2 text-accent-green font-jetbrains text-2xl font-bold">
						<span>{"//"}</span>
						<h1 className="text-foreground">component_library</h1>
					</div>
					<p className="text-muted-foreground text-sm">
						Guia de estilos e catálogo de componentes para o projeto DevRoaster.
					</p>
				</header>

				<section className="space-y-6">
					<div className="flex items-center gap-2 text-accent-green font-jetbrains text-sm font-bold">
						<span>{"//"}</span>
						<h2 className="text-foreground uppercase tracking-wider">buttons</h2>
					</div>

					<div className="grid gap-8">
						<div className="space-y-4">
							<h3 className="text-xs font-jetbrains text-muted-foreground uppercase">
								Variantes
							</h3>
							<div className="flex flex-wrap items-center gap-4 p-6 rounded-xl border border-border-primary bg-bg-surface">
								<div className="flex flex-col items-center gap-2">
									<Button variant="primary">Primary</Button>
									<span className="text-[10px] text-muted-foreground font-jetbrains">
										Primary
									</span>
								</div>

								<div className="flex flex-col items-center gap-2">
									<Button variant="secondary">Secondary</Button>
									<span className="text-[10px] text-muted-foreground font-jetbrains">
										Secondary
									</span>
								</div>

								<div className="flex flex-col items-center gap-2">
									<Button variant="link">Link</Button>
									<span className="text-[10px] text-muted-foreground font-jetbrains">
										Link
									</span>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-xs font-jetbrains text-muted-foreground uppercase">
								Tamanhos
							</h3>
							<div className="flex flex-wrap items-end gap-6 p-6 rounded-xl border border-border-primary bg-bg-surface">
								<div className="flex flex-col items-center gap-2">
									<Button size="sm">Small</Button>
									<span className="text-[10px] text-muted-foreground font-jetbrains">
										sm
									</span>
								</div>
								<div className="flex flex-col items-center gap-2">
									<Button size="default">Medium</Button>
									<span className="text-[10px] text-muted-foreground font-jetbrains">
										default
									</span>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-xs font-jetbrains text-muted-foreground uppercase">
								Estados
							</h3>
							<div className="flex flex-wrap items-center gap-4 p-6 rounded-xl border border-border-primary bg-bg-surface">
								<div className="flex flex-col items-center gap-2">
									<Button disabled>Disabled Button</Button>
									<span className="text-[10px] text-muted-foreground font-jetbrains">
										Disabled
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="space-y-6 opacity-40">
					<div className="flex items-center gap-2 text-accent-green font-jetbrains text-sm font-bold">
						<span>{"//"}</span>
						<h2 className="text-foreground uppercase tracking-wider">
							Typography (Em breve)
						</h2>
					</div>
					<div className="p-6 rounded-xl border border-dashed border-border-primary bg-bg-surface/50 italic text-sm text-muted-foreground">
						Aguardando implementação dos componentes de texto...
					</div>
				</section>
			</div>
		</div>
	);
}
