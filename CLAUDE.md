# 5Sport Client - Frontend

Sports community platform for end users. Built with Next.js 15 (App Router), React 19, TypeScript.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 3 + shadcn/ui (default style, CSS variables) + Radix UI
- **i18n:** next-intl v4 — locales: `vi` (default), `en`
- **API:** Orval (React Query + Axios) — generates hooks from Swagger at `http://localhost:8080/swagger/json`
- **Auth:** next-auth 4.24.10 (Bearer token in localStorage)
- **Font:** Inter (latin + vietnamese)
- **Package Manager:** pnpm

## Project Structure

```
src/
├── app/[locale]/         # Pages (locale-based routing)
│   ├── layout.tsx        # Root layout: i18n + providers + header/footer
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # shadcn components (DO NOT edit manually)
│   ├── layout/           # header, footer, mobile-nav, language-switcher
│   └── home/             # Home page sections
├── lib/
│   ├── api/axiosInstance.ts  # Axios instance + defaultMutator (used by orval)
│   ├── providers.tsx     # React Query + TooltipProvider + Sonner toast
│   └── utils.ts          # cn() helper
├── i18n/
│   ├── routing.ts        # Locales config, exports Link/useRouter/usePathname
│   └── request.ts        # Server-side i18n config
├── messages/             # vi.json, en.json (translation files)
├── hooks/                # Custom hooks
└── middleware.ts          # next-intl locale routing
```

## Key Commands

```bash
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm generate:api     # Generate API hooks from Swagger (orval)
```

## Conventions

### Routing & i18n
- All pages under `src/app/[locale]/` — next-intl handles locale routing
- Use `Link`, `useRouter`, `usePathname` from `@/i18n/routing` (NOT from `next/link` or `next/navigation`)
- Translations in `src/messages/{vi,en}.json` — use `useTranslations("namespace")` hook

### Components
- shadcn components in `src/components/ui/` — install via `pnpm dlx shadcn@latest add <component>`
- Feature components colocated by feature: `src/components/home/`, `src/components/layout/`, etc.
- Use `"use client"` only for interactive components (hooks, events)
- Import path alias: `@/` maps to `src/`

### Styling
- Primary color: `#0000FF` (blue) — `hsl(240 100% 50%)`
- Success/CTA: `green-500` / `green-600`
- Max container width: `1440px` (`max-w-container`)
- Use `cn()` from `@/lib/utils` for conditional classes

### API Layer
- Orval config: `orval.config.ts` — generates to `lib/services/` and `lib/schemas/`
- Custom axios mutator: `src/lib/api/axiosInstance.ts` (`defaultMutator`)
- React Query default: staleTime 60s, no refetchOnWindowFocus
- Backend base URL: `NEXT_PUBLIC_API_URL` env var

### Installed shadcn Components
avatar, badge, button, card, dialog, dropdown-menu, separator, sheet, skeleton, tabs, tooltip

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=http://localhost:3000
```
