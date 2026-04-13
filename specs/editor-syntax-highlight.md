# Spec: Code Editor com Syntax Highlight

> **Status:** Draft · Pendente de aprovação  
> **Criado em:** 2026-04-06  
> **Autor:** Pesquisa técnica (Antigravity)

---

## 1. Contexto & Objetivo

O DevRoaster precisa que o `CodeEditorBody` deixe de ser uma `<textarea>` simples e passe a exibir **syntax highlighting em tempo real** enquanto o usuário digita/cola código. A linguagem deve ser **detectada automaticamente**, com opção de seleção manual na UI.

---

## 2. Pesquisa: Abordagens para o Editor

### 2.1 A Abordagem do ray-so (Recomendada ✅)

Após vasculhar o código-fonte do [ray-so](https://github.com/raycast/ray-so), a arquitetura do editor é:

**Detecção de linguagem → `highlight.js` (`hljs.highlightAuto`)**

```ts
// store/code.ts do ray-so
import hljs from "highlight.js";

const detectLanguage = async (input: string): Promise<string> => {
  const result = hljs.highlightAuto(input, Object.keys(LANGUAGES));
  return result.language ?? "plaintext";
};
```

`hljs.highlightAuto()` recebe o código bruto e uma lista de candidatos. Retorna a linguagem com maior confiança. É leve (pode ser usado apenas para detecção, sem renderizar HTML do hljs).

**Renderização → `Shiki` (já está no projeto!)**

O ray-so usa `getHighlighterCore` do Shiki para:
1. Receber o código + linguagem detectada/selecionada
2. Gerar tokens com cores
3. Exibir o HTML resultante atrás de uma `<textarea>` transparente

**Padrão textarea + overlay:**

```
┌────────────────────────────────┐
│  div (position: relative)      │
│  ┌──────────────────────────┐  │
│  │ pre > code (Shiki HTML)  │  │  ← z-index: 1 (cores visíveis)
│  │  position: absolute       │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ <textarea>               │  │  ← z-index: 2 (recebe input)
│  │  color: transparent      │  │
│  │  caret-color: white      │  │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

O `<textarea>` fica por cima com texto **transparente** e caret visível. O `<pre>` com o HTML do Shiki fica atrás. O scroll de ambas é sincronizado via `ref`.

---

### 2.2 Alternativas Avaliadas

| Opção | Prós | Contras | Veredicto |
|---|---|---|---|
| **CodeMirror 6** (`@codemirror/view`) | Editor completo, extensível, bom suporte | Bundle pesado (~200KB), abstração diferente do padrão React | ❌ Overkill para o caso |
| **Monaco Editor** (`@monaco-editor/react`) | Editor do VS Code, feature-rich | Bundle enorme (~3MB), heavy, não combina com o design brutalist | ❌ Pesado demais |
| **Prism.js + textarea overlay** | Leve, pattern bem conhecido | Temas limitados, menos performático que Shiki para tokenização | ⚠️ Funciona, mas Shiki é superior |
| **Shiki + textarea overlay** ← *ray-so* | Shiki já está no projeto, temas premium, tokens precisos | Requer sincronização de scroll | ✅ **Escolhido** |
| **react-simple-code-editor** | Wrapper pronto para o pattern overlay | Não mantido ativamente, usa Prism internamente | ⚠️ Possível atalho, mas cria dependência |

**Conclusão:** A abordagem do ray-so — `highlight.js` para detecção + `Shiki` para renderização + `<textarea>` transparente sobreposta — é exatamente o que queremos. É performática, usa dependências que já existem ou são mínimas, e nos dá controle total sobre o design.

---

## 3. Dependências Necessárias

| Lib | Motivo | Status |
|---|---|---|
| `shiki` | Tokenização/rendering | ✅ Já no projeto (`^4.0.2`) |
| `highlight.js` | Auto-detecção de linguagem (`hljs.highlightAuto`) | ❌ Precisa adicionar |

> **Nota:** `highlight.js` será usado **apenas** para a detecção (não para renderizar HTML). Pode-se importar somente o core sem todos os grammars para manter o bundle menor.

---

## 4. Especificação Funcional

### 4.1 Comportamento do Editor

1. **Paste/Digitação:** Quando o usuário cola ou digita código, a detecção de linguagem é ativada com debounce de ~300ms.
2. **Auto-detect:** `hljs.highlightAuto(code, supportedLanguages)` é chamado. O resultado alimenta o Shiki para re-highlight.
3. **Seleção manual:** Um dropdown no `CodeEditorHeader` permite ao usuário sobrescrever a linguagem detectada. Quando uma linguagem é selecionada manualmente, a auto-detecção é desabilitada até que o campo seja limpo.
4. **Estado da linguagem:** Exibir a linguagem ativa (detectada ou manual) como badge no header do editor.
5. **Fallback:** Se a detecção não for conclusiva (baixa confiança), usar `plaintext` sem aplicar cores aggressivas.

### 4.2 UX/UI

- **Header do Editor:** Adicionar à direita do `filename` um `<select>` ou combobox com a lista de linguagens suportadas + opção "auto-detect".
- **Indicador de linguagem detectada:** Badge pequeno com o nome da linguagem aparecer no header, com indicador visual "(auto)" quando detectada automaticamente.
- **Tema:** Usar o tema `vesper` do Shiki (já referenciado em outros componentes do projeto) para manter consistência estética.
- **Performance:** Shiki deve ser instanciado uma única vez (singleton) e carregado lazy via `useEffect`. Linguagens são carregadas sob demanda (dynamic import, igual ao ray-so).

### 4.3 Linguagens a Suportar (MVP)

Baseado no ray-so e nas linguagens mais comuns para code review:

`javascript`, `typescript`, `jsx`, `tsx`, `python`, `rust`, `go`, `java`, `kotlin`, `swift`, `css`, `html`, `json`, `sql`, `bash`, `php`, `ruby`, `csharp`, `cpp`, `markdown`, `dockerfile`, `yaml`, `toml`, `plaintext`

---

## 5. Especificação Técnica (Arquitetura de Implementação)

### 5.1 Componentes a Modificar/Criar

```
src/
├── components/
│   └── ui/
│       └── code-editor.tsx          ← MODIFICAR: CodeEditorBody + CodeEditorHeader
├── lib/
│   ├── shiki.ts                     ← NOVO: singleton do highlighter
│   ├── languages.ts                 ← NOVO: mapa de linguagens suportadas  
│   └── detect-language.ts           ← NOVO: wrapper hljs.highlightAuto
└── hooks/
    └── use-highlighted-code.ts      ← NOVO: hook que une detecção + highlight
```

### 5.2 `lib/shiki.ts` — Singleton do Highlighter

```ts
// Instância única, carregada lazy
import { createHighlighterCore } from 'shiki/core'

let highlighterPromise: ReturnType<typeof createHighlighterCore> | null = null

export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [import('shiki/themes/vesper.mjs')],
      langs: [], // carregadas sob demanda
      loadWasm: import('shiki/wasm'),
    })
  }
  return highlighterPromise
}
```

### 5.3 `lib/detect-language.ts` — Detecção com hljs

```ts
import hljs from 'highlight.js/lib/core'
// Importar somente as linguagens suportadas (tree-shakeable)

export function detectLanguage(code: string, candidates: string[]): string {
  const result = hljs.highlightAuto(code, candidates)
  return result.language ?? 'plaintext'
}
```

### 5.4 `hooks/use-highlighted-code.ts` — Hook Principal

```ts
// Estado: code → detect (debounced) → load lang → highlight → html
// Expõe: { html, language, isDetecting, setLanguage (override manual) }
```

### 5.5 `CodeEditorBody` — Pattern Textarea + Overlay

```
div.relative (container)
  pre.absolute (Shiki HTML — pointer-events: none)
  textarea (color: transparent, caret-color: --text-primary)
```

Sincronização de scroll:
```ts
const onScroll = (e) => {
  preRef.current.scrollTop = e.target.scrollTop
  preRef.current.scrollLeft = e.target.scrollLeft
}
```

### 5.6 `CodeEditorHeader` — Seletor de Linguagem

Adicionar ao header existente um combobox (usando `Base UI` que já está no projeto):
- Item "Auto-detect" (padrão)
- Lista filtrada das linguagens suportadas
- Badge com linguagem ativa

---

## 6. Perguntas em Aberto (Para Você Responder)

Antes de implementar, preciso de clareza sobre:

1. **Escopo de linguagens:** A lista de 24 linguagens do MVP é suficiente ou você quer suportar mais (ex.: Elixir, Clojure, Gleam como no ray-so)? Isso afeta o bundle.

2. **Tema Shiki:** Confirma o uso do `vesper` theme? Ou quer usar um tema customizado alinhado às cores do `globals.css` (ex.: `--color-accent-green` como cor de string)?

3. **Seletor de linguagem no header:** Deve ser um `<select>` nativo (simples, sem deps extras) ou um combobox com busca (como no ray-so, usando `Base UI`)? O segundo é mais premium mas mais trabalho.

4. **Line numbers dinâmicos:** O `CodeEditorBody` atual renderiza sempre 15 números fixos. Eles devem acompanhar o número real de linhas do código colado?

5. **Detecção em tempo real vs. on paste:** A detecção deve rodar a cada keystroke (com debounce) ou apenas quando o usuário **cola** (`onPaste` event)? Detect on paste é mais performático e menos "nervoso" na UI.

---

## 7. Referências

- [ray-so — `store/code.ts`](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/store/code.ts) — Auto-detect com hljs
- [ray-so — `util/languages.ts`](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/util/languages.ts) — Mapa de linguagens
- [ray-so — `LanguageControl.tsx`](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/components/LanguageControl.tsx) — Combobox de seleção
- [Shiki Docs — `createHighlighterCore`](https://shiki.style/guide/install#fine-grained-bundle)
- [highlight.js — `highlightAuto`](https://highlightjs.readthedocs.io/en/latest/api.html#highlightauto-value-languagesubset)
- [CSS Tricks — Textarea Syntax Highlight Trick](https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/)
