# Component Patterns (src/components)

This directory follows a brutalist design philosophy and the Composition Pattern for React components.

## Design Philosophy

### Brutalist Aesthetic
- **Borders**: Always use solid borders (`border-primary` or `border-border-primary/50`). Prefer 1px for subtle sections and 2px+ for hero elements.
- **Typography**: 
    - Use `font-mono` (JetBrains Mono) for all technical data, code snippets, numbers, and CTA button labels.
    - Use `font-sans` only for readability in long paragraphs or secondary labels.
- **Corners**: Use `rounded-xl` for cards and major containers. Avoid large rounded values (`rounded-3xl` or `rounded-full`) unless for buttons/badges.
- **Shadows**: Use very subtle shadows or none. Rely on borders for separation.

## Technical Patterns

### Composition Pattern
For complex features (like the Code Editor), use the root/sub-component pattern:
```typescript
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content</Card.Content>
</Card>
```

### Semantic Tokens
DO NOT use hardcoded colors. Always use the semantic tokens defined in Tailwind/CSS:
- `bg-page`: Main background.
- `bg-surface`: Card/Container background.
- `text-primary`: Primary text.
- `text-secondary`: Muted/Subtitle text.
- `accent-green`: Primary branding color for highlights.

### Utility Components
- Use the `Typography` component from `src/components/ui` for all text to ensure consistent variants and scaling.
- Use `Button` and `Badge` variants (`critical`, `warning`, `good`) to communicate severity.
