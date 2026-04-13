# Routing & Prefetching Patterns (src/app)

This directory uses the Next.js App Router and focuses on performance through Server-Side Prefetching.

## Routing
- **Pages**: Defined in `page.tsx` within folders.
- **Layouts**: Use `layout.tsx` for shared UI (Navbar, Footer, Providers).
- **Dynamic Routes**: Use `[id]` for specific roasts or user sessions.

## Data Fetching
- **Server-Side**: Prefer fetching data in Server Components.
- **tRPC Prefetching**: To avoid "waterfalls" and ensure data is ready during hydration, prefetch queries using the server-side tRPC helper.

**Pattern (in `page.tsx`):**
```typescript
import { prefetch, trpc } from "@/trpc/server";

export default async function Page() {
    prefetch(trpc.metrics.getOverview.queryOptions());
    // ...
    return <HydrateClient>...</HydrateClient>;
}
```

## SEO & Metadata
- **Static Metadata**: Define in `layout.tsx` or `page.tsx`.
- **Dynamic Metadata**: Use `generateMetadata` for dynamic routes to ensure proper link previews.
- **Semantic HTML**: Always use `<main>`, `<section>`, and `<header>` tags for better accessibility and SEO.
