# Padrões de Criação de Componentes UI

Este documento define as diretrizes para a criação de novos componentes na pasta `src/components/ui`. Siga estes padrões para manter a consistência e performance do design system.

## 1. Tecnologias Core
- **Tailwind CSS v4:** Para estilização.
- **Tailwind Variants (tv):** Para gerenciamento de variantes e estados.
- **Tailwind Merge:** Já integrado nativamente no `tv`.

## 2. Padrões de Implementação

### 2.1. Uso do Tailwind Variants
Não utilize a função utilitária `cn` ou `twMerge` manualmente ao renderizar o componente se estiver usando `tailwind-variants`. O `tv` já lida com a mesclagem de classes de forma eficiente. Passe o `className` externo diretamente como uma propriedade para a função de variantes.

**Correto:**
```tsx
const variants = tv({ ... })

export const MyComponent = ({ className, variant, ...props }) => (
  <div className={variants({ variant, className })} {...props} />
)
```

**Incorreto:**
```tsx
// Evite o merge manual redundante
<div className={cn(variants({ variant }), className)} />
```

### 2.2. Tipagem e Propriedades
- Sempre estenda as propriedades nativas do HTML (ex: `React.ButtonHTMLAttributes`).
- Utilize `React.forwardRef` para permitir a manipulação do nó DOM via ref.
- Utilize `VariantProps` do `tv` para tipar as variantes do componente.

### 2.3. Exports
- Utilize sempre **Named Exports**.
- **Nunca** utilize `default export`.

```tsx
export const MyComponent = ...
```

## 3. Integração com o Design (Pencil)
- Mapeie rigorosamente as cores e paddings definidos no design system (Pencil).
- Use as variáveis definidas em `globals.css` (ex: `bg-accent-green`, `font-jetbrains`).
