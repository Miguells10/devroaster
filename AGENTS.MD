# AGENTS.MD

## Project Overview
**DevRoaster** is a brutalist code review platform built with Next.js 15, Tailwind CSS v4, and Biome. It aims to provide sharp, honest, and sarcastic code reviews powered by AI.

## Global Patterns

### Tech Stack
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS v4 + PostCSS. Standardized via `@theme` directive.
- **Database**: Drizzle ORM with `node-postgres`.
- **API**: tRPC v11 for end-to-end type safety.
- **Primitives**: Base UI (Radix-like unstyled components).
- **Syntax Highlighting**: Shiki (Server-side & Client-side).
- **Tooling**: Biome (Lint/Format/Check), TypeScript 5, Zod (Validation).

### Architectural Principles
- **Resilient API**: All tRPC procedures fetching aggregated or external data MUST use `try-catch` blocks and return graceful fallback values (e.g., `[]`, `0`, or default objects) to prevent hydration/prefetching crashes.
- **Type Safety**: Use Drizzle's `$inferSelect` and `$inferInsert` for database types. Use Zod for all form and API input validations.
- **Composition Pattern**: Build complex components using sub-components (e.g., `Card`, `Card.Header`, `Card.Content`) for better reusability.
- **Named Exports Only**: Prefer `export const Name = ...` over default exports, except for Next.js pages/layouts.

### Design System (Brutalist)
- **Typography**: 
  - `font-mono`: JetBrains Mono (Primary for all tech/code context).
  - `font-sans`: System defaults (Secondary).
- **Palette**: Use semantic color tokens defined in `global.css` (e.g., `accent-green`, `bg-page`, `border-primary`).
- **Aesthetics**: Heavy borders (1px to 4px), sharp corners (small `rounded-xl` or none), high contrast, and mono-everything.

## Tooling
- **Linting**: Biome is the source of truth. Run `npm run lint` before committing.
- **Database**: 
  - `npm run db:push` to sync schema.
  - `npm run db:seed` to populate mock data.
