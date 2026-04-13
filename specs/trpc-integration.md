# Spec: Integração tRPC com Next.js App Router

> **Status:** Draft  
> **Criado em:** 2026-04-12  
> **Autor:** Antigravity (IA)

## 1. Contexto & Objetivo
Implementar o **tRPC v11** como camada de comunicação entre o Frontend (Client/Server Components) e o Backend (Drizzle ORM). O objetivo é garantir **End-to-end Type Safety** sem a necessidade de gerar código, integrando-se nativamente com as capacidades de streaming e prefetching do Next.js App Router.

## 2. Approach & Research
A abordagem escolhida segue as recomendações oficiais do tRPC para `@tanstack/react-query`:
- **tRPC v11**: Utiliza a nova API de `queryOptions` que facilita a integração com TanStack Query.
- **RSC Integration**: Prefetching no servidor via `HydrateClient` para evitar "waterfalls" no client.
- **Server-side Callers**: Uso de calls diretas no servidor quando não houver necessidade de hydrate no client.

## 3. Dependencies
Novas dependências necessárias:
- `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`
- `@tanstack/react-query`
- `zod`
- `client-only`, `server-only`
- `superjson` (opcional, para serialização de tipos complexos como Date)

## 4. Functional Spec
- **API Endpoint**: Centralizado em `/api/trpc/[trpc]`.
- **Pre-fetching**: Páginas devem ser capazes de iniciar buscas no servidor e entregar o estado hidratado para componentes client.
- **Loading UI**: Integração com React Suspense para estados de carregamento brutalistas.
- **Error Handling**: Captura de erros do tRPC integrada com Error Boundaries do Next.js.

## 5. Technical Spec

### Estrutura de Pastas
```
src/
├── app/
│   └── api/trpc/[trpc]/route.ts   ← Handler fetch adapter
├── trpc/
│   ├── init.ts                    ← tRPC Instance + Context
│   ├── client.tsx                 ← Provider + Hooks (Client only)
│   ├── server.ts                  ← Prefetch helpers + Caller (Server only)
│   ├── query-client.ts            ← Factory do React Query
│   └── routers/                   ← Definições de Procedures
│       ├── _app.ts                ← Root Router
│       └── example.ts             ← Feature Routers
```

### Exemplo de Prefetching (RSC)
```tsx
// app/page.tsx
export default async function Page() {
  prefetch(trpc.hello.queryOptions({ text: 'DevRoaster' }));

  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
```

## 6. Open Questions
1. **Superjson**: Vamos utilizar superjson para lidar com instâncias de `Date` e `Set` automaticamente ou manter JSON puro por performance?
2. **Contexto**: Além da conexão com o banco (Drizzle), o contexto deve incluir informações de autenticação (ex: Clerk/NextAuth) já nesta fase?

## 7. References
- [tRPC Server Components Guide](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [tRPC Next.js App Router Setup](https://trpc.io/docs/client/nextjs/app-router-setup)
- [TanStack Query Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
