# Database Patterns (src/db)

This directory contains the database schema, configuration, and migrations using Drizzle ORM.

## Coding Patterns

### Schema Definition
- **Casing**: Use `camelCase` for JavaScript property names and ensure Drizzle is configured for `snake_case` in the database (via `casing: "snake_case"` in `db/index.ts` or `drizzle.config.ts`).
- **IDs**: Use `uuid().defaultRandom().primaryKey()` for all table IDs.
- **Enums**: Define enums globally in `schema.ts` using `pgEnum`.
- **Relationship Naming**: Use the pattern `tableNameId` (e.g., `roastId`).

### Organization
Files should follow this structure:
1. Enums
2. Tables (with indexes in the callback)
3. Inferred Types (`$inferSelect`, `$inferInsert`)

### Type Safety
Always export inferred types for use in Server Actions and Routers:
```typescript
export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
```

## Workflow
- **Migrations**: Use `npm run db:generate` to create migrations and `npm run db:migrate` to apply them.
- **Prototyping**: Use `npm run db:push` if you are iterating on the schema and don't need formal migrations yet.
- **Testing**: Use `npm run db:seed` to repopulate the database with mock data.
