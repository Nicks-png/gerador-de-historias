@AGENTS.md

# Design System — gerador-de-historias

## Stack

- **Framework:** Next.js 16 + React 19 + TypeScript (App Router, `src/` dir)
- **Estilização:** Tailwind CSS v4 — configurado via CSS (`@import "tailwindcss"` em `globals.css`), **sem** `tailwind.config.ts`
- **Tipografia:** `@tailwindcss/typography` declarado com `@plugin "@tailwindcss/typography"` no CSS
- **Markdown:** `react-markdown` + `remark-gfm`
- **IA:** `@anthropic-ai/sdk` (claude-sonnet-4-6)

## Paleta de Cores

Usar exclusivamente estas classes Tailwind nos componentes:

| Uso | Classes |
|-----|---------|
| Primária (destaques, CTAs, headings) | `amber-400`, `amber-500`, `amber-600` |
| Fundo da página | `stone-900` |
| Superfícies / cards | `stone-800`, `stone-800/40`, `stone-800/50` |
| Bordas | `stone-600`, `stone-700` |
| Texto principal | `stone-100`, `stone-200` |
| Texto secundário / placeholder | `stone-400`, `stone-500` |
| Erro | `red-300` (texto), `red-700` (borda), `red-900/40` (fundo) |

**Nunca** introduzir cores fora desta paleta (hex inline, outras escalas Tailwind) sem atualizar este doc.

## Tipografia

- **Fonte principal:** Geist Sans (`--font-geist-sans`) — carregada via `next/font/google` em `layout.tsx`
- **Fonte mono:** Geist Mono (`--font-geist-mono`)
- **Fallback body:** Arial, Helvetica, sans-serif (definido em `globals.css`)
- **Prose/Markdown:** usar `prose prose-invert prose-amber prose-sm` com overrides:
  ```
  prose-headings:text-amber-400
  prose-strong:text-stone-200
  prose-blockquote:text-stone-400
  prose-blockquote:border-amber-600
  prose-table:text-sm
  prose-th:text-amber-400
  prose-a:text-amber-500
  ```

## Layout & Espaçamento

- **Containers:** `max-w-4xl` (página), `max-w-3xl` (aventura), `max-w-2xl` (formulários)
- **Padding horizontal:** `px-4`
- **Padding vertical de página:** `py-10`
- **Gaps entre elementos de form:** `space-y-4` ou `space-y-5`
- Responsividade via classes utilitárias Tailwind — mobile-first

## Componentes

| Arquivo | Propósito |
|---------|-----------|
| `src/components/ProgressBar.tsx` | Indicador das 3 fases (Resumo → Perguntas → Aventura) |
| `src/components/PhaseOne.tsx` | Textarea do resumo inicial + exemplos rápidos |
| `src/components/PhaseTwo.tsx` | Formulário dinâmico com perguntas geradas pela IA |
| `src/components/PhaseThree.tsx` | Exibição da aventura em Markdown com streaming |
| `src/hooks/useAdventureState.ts` | Estado global das 3 fases + chamadas à API |
| `src/lib/types.ts` | Tipos: `Phase`, `Question`, `AdventureState` |
| `src/lib/prompts.ts` | System prompts do Claude + `buildUserPrompt()` |
| `src/lib/anthropic.ts` | Singleton do SDK Anthropic |
| `src/app/api/questions/route.ts` | `POST /api/questions` → gera perguntas (JSON) |
| `src/app/api/generate/route.ts` | `POST /api/generate` → streaming da aventura |

## Padrões de Componente

- Todos os componentes de UI têm `'use client'` no topo
- Estado gerenciado via hook `useAdventureState` — não usar context/Redux/Zustand
- Props explicitamente tipadas com interfaces TypeScript inline ou importadas de `@/lib/types`
- Validação de formulários no próprio componente (sem libs externas)
- Erros exibidos em bloco `bg-red-900/40 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm`
- Loading states com `animate-spin` ou `animate-pulse` em `amber-500`

## Ícones

Atualmente apenas emojis Unicode (`⚔`, `✨`, `✓`, `→`, `←`). Se adicionar biblioteca de ícones, usar **Lucide React** e manter consistência com a paleta amber/stone.

## Integração com Figma (MCP)

Ao importar designs do Figma:

1. Mapear cores Figma → classes Tailwind da paleta acima (não usar hex inline)
2. Usar Geist Sans como fonte — disponível no Google Fonts
3. Componentes devem seguir o padrão `'use client'` + props tipadas
4. Prose/Markdown usa classes `prose prose-invert prose-amber` — não criar CSS custom para isso
5. Bordas arredondadas padrão: `rounded-lg` (cards), `rounded-xl` (containers grandes), `rounded-full` (badges/steps)
6. Tokens CSS disponíveis: `--background`, `--foreground`, `--font-geist-sans`, `--font-geist-mono`

