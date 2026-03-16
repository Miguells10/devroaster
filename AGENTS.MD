# AGENTS.MD

## Project Overview
**DevRoaster** is a brutalist code review platform built with Next.js 15, Tailwind CSS v4, and Biome.

## Global Patterns
- **Tech Stack**: Next.js (App Router), Tailwind v4, Biome (Lint/Format), Base UI (Primitives), Shiki (Syntax highlighting).
- **Styling**: Standardized Tailwind v4 `@theme` directive. Always use semantic color tokens (e.g., `accent-green`, `bg-page`).
- **Typography**: 
  - `font-mono`: JetBrains Mono (Primary for all tech/code context).
  - `font-sans`: System defaults (Secondary).
- **Component Pattern**: Composition Pattern (Root, Header, Content, etc.).
- **Standards**: Named exports, functional components, TypeScript for all files.
- **Linting**: Biome is the source of truth. Run `npm run lint` before committing.
