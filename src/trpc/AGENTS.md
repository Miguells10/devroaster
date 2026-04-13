# API Patterns (src/trpc)

This directory contains the tRPC setup and routers. It provides end-to-end type safety between the server and the client.

## Coding Patterns

### Router Organization
- Specialized routers should be defined in `src/trpc/routers`.
- All routers must be merged into the main application router in `src/trpc/routers/_app.ts`.

### Resilient Query Pattern (Mandatory)
To prevent hydration errors and prefetching crashes during Server-Side Rendering (SSR), all procedures that perform database aggregations (like `avg`, `count`) or complex fetches MUST be wrapped in a `try-catch` block.

**Pattern:**
```typescript
getOverview: baseProcedure.query(async () => {
    try {
        const stats = await db.select(...);
        return { ...data };
    } catch (error) {
        console.error("Failed to fetch metrics:", error);
        return { /* Safe default values */ };
    }
})
```

### Type Safety
- Use `baseProcedure` for standard queries.
- Validate inputs using Zod objects.
- Return consistent types so the client can handle loading/error states without breaking.

## Rendering
- Use `HydrateClient` and `prefetch` in Next.js Server Components to improve perceived performance and SEO.
