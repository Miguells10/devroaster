import { Button } from '@/components/ui/button'

export default function TestButtonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 bg-bg-page">
      <h1 className="text-2xl font-bold font-jetbrains text-foreground">
        Botões DevRoaster
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button variant="primary" size="primary">
          $ roast_my_code
        </Button>

        <Button variant="secondary" size="secondary">
          $ share_roast
        </Button>

        <Button variant="link" size="link">
          $ view_all &gt;&gt;
        </Button>

        <Button variant="destructive" size="sm">
          Destructive
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium (Default)</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  )
}
