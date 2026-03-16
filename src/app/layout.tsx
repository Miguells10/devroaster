import type { Metadata } from 'next'
import { JetBrains_Mono, Geist } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: 'DevRoaster',
  description: 'DevRoaster project',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${jetbrainsMono.variable} ${geist.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
