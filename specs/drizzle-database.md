# Spec: Drizzle ORM + PostgreSQL

> **Status:** ✅ Decisões fechadas · Pronto para implementar
> **Criado em:** 2026-04-12
> **Autor:** Pesquisa técnica (Antigravity)

---

## 1. Contexto

O DevRoaster é uma plataforma de code review brutalista. A partir da análise do layout atual (`page.tsx`), dos componentes de UI e do README, identificamos as seguintes entidades de domínio:

- **Roasts** — submissões de código pelo usuário, com score e feedback gerado por IA
- **Roast Issues** — problemas específicos identificados em cada roast (mapeam para os componentes `Card`, `DiffLine`, `Badge`)
- **Leaderboard** — ranking das piores submissões (já renderizado como mock na homepage)
- **Users** — *(fora do scope — MVP 100% anônimo via `session_id`)*

A homepage já exibe: contagem de roasts (`2,847 codes roasted`), score médio (`avg score: 4.2/10`), e um leaderboard com `rank`, `score`, `code_preview` e `lang`. Esses dados hoje são hardcoded — o banco viabiliza torná-los dinâmicos.

---

## 2. Stack

| Camada | Tecnologia |
|---|---|
| ORM | Drizzle ORM (`drizzle-orm`) |
| Driver | `postgres` (node-postgres) |
| Migrations | `drizzle-kit` |
| Banco | PostgreSQL 16 |
| Infraestrutura local | Docker Compose |
| Schema path | `src/db/schema.ts` |
| Config path | `drizzle.config.ts` |
| Client path | `src/db/index.ts` |

---

## 3. Enums

```ts
// src/db/schema.ts

export const languageEnum = pgEnum("language", [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "python",
  "rust",
  "go",
  "java",
  "kotlin",
  "swift",
  "css",
  "html",
  "json",
  "sql",
  "bash",
  "php",
  "ruby",
  "csharp",
  "cpp",
  "markdown",
  "dockerfile",
  "yaml",
  "toml",
  "plaintext",
]);
// Alinhado com a lista de linguagens da spec do editor (editor-syntax-highlight.md)

export const roastModeEnum = pgEnum("roast_mode", [
  "honest",      // feedback direto
  "sarcastic",   // "maximum sarcasm enabled" (toggle na UI)
]);

export const issueSeverityEnum = pgEnum("issue_severity", [
  "critical",   // Badge variant="critical" — vermelho
  "warning",    // Badge variant="warning"  — âmbar
  "good",       // Badge variant="good"     — verde (ponto positivo)
]);

export const issueTypeEnum = pgEnum("issue_type", [
  "naming",
  "logic",
  "security",
  "performance",
  "style",
  "architecture",
  "tech_debt",
  "best_practice",
  "other",
]);
```

---

## 4. Tabelas

### 4.1 `roasts`

Principal entidade. Cada submissão de código resulta em um roast.

```ts
export const roasts = pgTable("roasts", {
  id:           uuid("id").defaultRandom().primaryKey(),
  // Limitado a 10.000 caracteres — validado também na camada de aplicação
  code:         varchar("code", { length: 10000 }).notNull(),
  language:     languageEnum("language").notNull().default("plaintext"),
  roast_mode:   roastModeEnum("roast_mode").notNull().default("honest"),

  // Score de 0 a 10 (duas casas decimais)
  // Alimenta: ScoreRing, Badge variant="critical/warning/good", leaderboard
  score:        numeric("score", { precision: 4, scale: 2 }).notNull(),

  // Resumo geral gerado pela IA (texto brutalista)
  summary:      text("summary"),

  // Preview truncado para exibição no leaderboard (gerado na camada de serviço)
  // Equivalente ao "code_preview" da coluna da homepage
  code_preview: varchar("code_preview", { length: 120 }),

  // Metadados de execução
  char_count:   integer("char_count"),
  line_count:   integer("line_count"),

  // Identificação anônima por sessão — MVP 100% anônimo, sem auth
  // Gerado no client via crypto.randomUUID() e persistido em cookie httpOnly
  session_id:   varchar("session_id", { length: 64 }).notNull(),

  created_at:   timestamp("created_at").defaultNow().notNull(),
});
```

**Índices:**
```ts
export const roastsIndexes = {
  byScore:     index("roasts_score_idx").on(roasts.score),
  byCreatedAt: index("roasts_created_at_idx").on(roasts.created_at),
  byLanguage:  index("roasts_language_idx").on(roasts.language),
};
```

> Os índices em `score` e `created_at` suportam as queries de leaderboard (`ORDER BY score ASC`) e as estatísticas da homepage (`COUNT`, `AVG`).

---

### 4.2 `roast_issues`

Issues individuais identificados pela IA em cada roast. Mapeiam diretamente para os componentes `Card`, `DiffLine` e `Badge` visíveis na demo page.

```ts
export const roastIssues = pgTable("roast_issues", {
  id:          uuid("id").defaultRandom().primaryKey(),
  roast_id:    uuid("roast_id")
                 .notNull()
                 .references(() => roasts.id, { onDelete: "cascade" }),

  severity:    issueSeverityEnum("severity").notNull(),
  type:        issueTypeEnum("type").notNull(),

  title:       varchar("title", { length: 200 }).notNull(), // CardTitle
  description: text("description").notNull(),               // CardDescription

  // Linhas originais (DiffLine type="removed")
  code_before: text("code_before"),
  // Sugestão de correção (DiffLine type="added")
  code_after:  text("code_after"),

  // Número da linha no código original onde o problema foi encontrado
  line_start:  integer("line_start"),
  line_end:    integer("line_end"),

  // Ordem de exibição dentro do roast
  sort_order:  integer("sort_order").notNull().default(0),

  created_at:  timestamp("created_at").defaultNow().notNull(),
});
```

**Índices:**
```ts
export const roastIssuesIndexes = {
  byRoastId: index("roast_issues_roast_id_idx").on(roastIssues.roast_id),
};
```

---

### ~~4.3 `stats`~~ — Não haverá tabela de stats

✅ **Decisão:** Stats calculados em tempo real via `SELECT COUNT(*), AVG(score) FROM roasts`. Sem tabela dedicada no MVP.

Query a ser usada em `src/db/queries/stats.ts`:

```ts
export async function getStats() {
  const result = await db
    .select({
      total_roasts: sql<number>`COUNT(*)`,
      avg_score:    sql<number>`ROUND(AVG(${roasts.score})::numeric, 1)`,
    })
    .from(roasts);
  return result[0];
}
```

---

## 5. Relações (Drizzle Relations API)

```ts
export const roastsRelations = relations(roasts, ({ many }) => ({
  issues: many(roastIssues),
}));

export const roastIssuesRelations = relations(roastIssues, ({ one }) => ({
  roast: one(roasts, {
    fields: [roastIssues.roast_id],
    references: [roasts.id],
  }),
}));
```

---

## 6. Docker Compose

### `docker-compose.yml` (raiz do projeto)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroaster_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: devroaster
      POSTGRES_USER: devroaster
      POSTGRES_PASSWORD: devroaster_secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroaster -d devroaster"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

> **Nota:** Não é necessário subir o Next.js no Docker Compose para desenvolvimento. Só o Postgres sobe via Docker; o Next.js continua em `npm run dev`.

---

## 7. Variáveis de Ambiente

Criar `.env.local` na raiz (já deve estar no `.gitignore`):

```bash
# .env.local
DATABASE_URL="postgresql://devroaster:devroaster_secret@localhost:5432/devroaster"
```

---

## 8. Configuração do Drizzle Kit

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

---

## 9. Database Client

```ts
// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

---

## 10. Estrutura de Arquivos Final

```
devroaster/
├── docker-compose.yml          ← NOVO
├── drizzle.config.ts           ← NOVO
├── .env.local                  ← NOVO (não commitado)
├── .env.example                ← NOVO (commitado, sem valores reais)
└── src/
    └── db/
        ├── index.ts            ← NOVO: client singleton
        ├── schema.ts           ← NOVO: todas as tabelas e enums
        └── migrations/         ← NOVO: gerado pelo drizzle-kit
            └── 0000_initial.sql
```

---

## 11. To-dos de Implementação

### Infraestrutura

- `[ ]` Criar `docker-compose.yml` na raiz
- `[ ]` Criar `.env.local` com `DATABASE_URL`
- `[ ]` Criar `.env.example` com valores placeholder
- `[ ]` Garantir que `.env.local` está no `.gitignore`

### Dependências

- `[ ]` `npm install drizzle-orm pg`
- `[ ]` `npm install -D drizzle-kit @types/pg`

### Schema

- `[ ]` Criar `src/db/schema.ts` com enums e tabelas conforme seção 3 e 4
- `[ ]` Criar `src/db/index.ts` com o client do Drizzle (seção 9)
- `[ ]` Criar `drizzle.config.ts` na raiz (seção 8)

### Migrations

- `[ ]` Subir o Postgres: `docker compose up -d`
- `[ ]` Gerar a primeira migration: `npx drizzle-kit generate`
- `[ ]` Aplicar a migration: `npx drizzle-kit migrate`
- `[ ]` Adicionar scripts no `package.json`:
  ```json
  "db:generate": "drizzle-kit generate",
  "db:migrate":  "drizzle-kit migrate",
  "db:studio":   "drizzle-kit studio",
  "db:push":     "drizzle-kit push"
  ```

### Integração com Next.js

- `[ ]` Criar Server Action `src/app/actions/create-roast.ts` para inserir um roast após o clique em `roast_my_code`
- `[ ]` Criar query `src/db/queries/leaderboard.ts` que retorna top N roasts ordenados por score ASC
- `[ ]` Criar query `src/db/queries/stats.ts` que retorna `total_roasts` e `avg_score`
- `[ ]` Substituir dados hardcoded da `page.tsx` (leaderboard e stats) por dados reais vindos das queries acima

### Validação

- `[ ]` Testar conexão com `npx drizzle-kit studio` e verificar as tabelas
- `[ ]` Inserir um roast seed manualmente via Drizzle Studio para validar o leaderboard

---

## 12. Decisões Registradas

| # | Pergunta | Decisão |
|---|---|---|
| 1 | Auth/Users | ✅ MVP anônimo — `session_id` em cookie `httpOnly, SameSite=Lax`. Sem tabela `users`. |
| 2 | Tabela `stats` | ✅ Sem tabela — `COUNT/AVG` em tempo real via query SQL. |
| 3 | Contrato da IA | ⚠️ **Ainda não definido** — o schema de `roast_issues` é uma proposta. Revisar ao integrar a IA. |
| 4 | Limite do código | ✅ `varchar(10000)` no banco + validação na camada de aplicação (Zod/Server Action). |
| 5 | Soft delete | ✅ Hard delete — sem `deleted_at`. Remoção direta. |

> ⚠️ **Ponto de atenção:** O schema de `roast_issues` (campos `title`, `description`, `code_before`, `code_after`, `severity`, `type`) precisa ser revisado ao definir o contrato do response da IA. O schema atual é uma proposta razoável baseada nos componentes de UI existentes (`Card`, `DiffLine`, `Badge`), mas pode precisar de ajustes.

---

## 13. Referências

- [Drizzle ORM Docs — PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle Kit — Migrations](https://orm.drizzle.team/docs/kit-overview)
- [PostgreSQL 16 Docker Image](https://hub.docker.com/_/postgres)
- [editor-syntax-highlight.md](./editor-syntax-highlight.md) — lista de linguagens usada no enum `language`
