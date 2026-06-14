# Jimmy Marketing — Architecture Plan

> **Context**: New standalone marketing website for Jimmy Coach SaaS platform.
> Separate from the existing `jimmy-website/` (which uses Sanity-only i18n + 4 locales).
> This site uses next-intl URL routing + Sanity CMS for 3 locales: en, fr, es.
> Built from scratch — no code copied from jimmy-website.

---

## Stack & Versions

Versions match what's already in production in this monorepo:

| Package | Version | Note |
|---------|---------|------|
| `next` | `^16.1.6` | App Router, PPR via `cacheComponents` |
| `react` / `react-dom` | `^19.2.3` | |
| `typescript` | `^5` | strict mode |
| `tailwindcss` | `^4.1.18` | CSS-first, no config file |
| `@tailwindcss/postcss` | `^4.1.18` | PostCSS integration |
| `sanity` | `^5.8.1` | Studio v3+ API |
| `next-sanity` | `^12.1.0` | Live preview, GROQ client |
| `@sanity/document-internationalization` | `^4.1.1` | Locale variants in Studio |
| `@sanity/image-url` | `^2.0.2` | |
| `@sanity/vision` | `^5.0.1` | GROQ explorer in Studio |
| `@portabletext/react` | `^6.0.0` | Portable Text renderer |
| `next-intl` | `^4.11.2` | URL-based locale routing |
| `framer-motion` | `^12.29.2` | Client animations only |
| `lucide-react` | `^0.562.0` | Icons |
| `clsx` | `^2.1.1` | Conditional classes |
| `tailwind-merge` | `^3.3.1` | Class merging |
| `groq` | `^5.0.1` | GROQ tag literal |

**Dev**: `@types/node ^20`, `@types/react ^19`, `typescript ^5`, `postcss ^8`

---

## Folder Structure

```
jimmy-marketing/
├── messages/
│   ├── en.json              # UI strings (nav, buttons, labels)
│   ├── fr.json
│   └── es.json
├── public/
│   └── (static assets)
├── sanity/
│   ├── client.ts            # createClient + sanityFetch helper
│   ├── env.ts               # validated env vars
│   ├── image.ts             # imageUrlBuilder
│   ├── sanity.config.ts     # defineConfig with plugins
│   ├── structure.ts         # custom desk structure
│   ├── queries/             # all GROQ queries
│   │   └── index.ts         # home, navigation, footer, pricing
│   └── schemas/
│       ├── index.ts         # exports schemaTypes array
│       ├── documents/
│       │   ├── homePage.ts
│       │   ├── pricing.ts
│       │   ├── pricingFeatures.ts
│       │   ├── navigation.ts
│       │   ├── footer.ts
│       │   └── siteSettings.ts
│       └── objects/
│           ├── seo.ts
│           ├── portableTextBlock.ts
│           └── socialLink.ts
├── src/
│   ├── app/
│   │   ├── [locale]/            # locale-prefixed public routes
│   │   │   ├── layout.tsx       # locale layout + next-intl provider
│   │   │   ├── page.tsx         # home ("Work in Progress")
│   │   │   └── not-found.tsx
│   │   ├── studio/
│   │   │   └── [[...tool]]/
│   │   │       └── page.tsx     # Sanity Studio (no locale)
│   │   ├── api/
│   │   │   └── revalidate/
│   │   │       └── route.ts     # webhook revalidation
│   │   ├── layout.tsx           # root layout (html/body only)
│   │   ├── not-found.tsx        # root 404
│   │   └── favicon.ico
│   ├── components/
│   │   └── (empty, added per page)
│   ├── i18n/
│   │   ├── routing.ts           # defineRouting({ locales, defaultLocale })
│   │   └── request.ts           # getRequestConfig with cookie detection
│   ├── lib/
│   │   └── utils.ts             # cn() helper
│   └── styles/
│       └── globals.css          # @import "tailwindcss" + @theme {}
├── .env.example
├── .env.local                   # not committed
├── .gitignore
├── CLAUDE.md
├── PLAN.md                      # this file
├── middleware.ts                 # next-intl locale routing
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Routing Strategy

| URL | Component | Note |
|-----|-----------|------|
| `/` | redirects → `/en` | root redirect via middleware |
| `/en` | `[locale]/page.tsx` | English home |
| `/fr` | `[locale]/page.tsx` | French home |
| `/es` | `[locale]/page.tsx` | Spanish home |
| `/en/pricing` | `[locale]/pricing/page.tsx` | Pricing (add later) |
| `/studio/[[...tool]]` | Sanity Studio page | excluded from next-intl |
| `/api/revalidate` | Route Handler | Sanity webhook trigger |

**Middleware exclusions** (matcher pattern):
```
/((?!studio|api|_next|_vercel|.*\\..*).*)
```

---

## Sanity Schema Plan

All document types use `@sanity/document-internationalization` for language variants.

### Document Types

**`homePage`** — One per locale via document-internationalization
- `title: string` — page title
- `hero: { heading, subheading, ctaText, ctaUrl }`
- `seo: seo (object)`
- `language: string` — managed by intl plugin

**`pricing`** — Pricing tiers
- `name: string`
- `description: text`
- `priceMonthly: number`
- `priceYearly: number`
- `features: reference[] → pricingFeatures`
- `highlighted: boolean`
- `language: string`

**`pricingFeatures`** — Individual feature items
- `title: string`
- `included: boolean`
- `language: string`

**`navigation`** — Site nav (one per locale)
- `items: navItem[]` — label + href
- `language: string`

**`footer`** — Footer content (one per locale)
- `columns: { title, links: navItem[] }[]`
- `socialLinks: socialLink[]`
- `legalText: text`
- `language: string`

**`siteSettings`** — Global settings (one per locale)
- `siteName: string`
- `siteDescription: text`
- `seo: seo (object)`
- `language: string`

### Object Types

**`seo`** — `{ title, description, ogImage: image }`
**`portableTextBlock`** — rich text with basic marks
**`socialLink`** — `{ platform: select, url: url }`
**`navItem`** — `{ label: string, href: string, external: boolean }`

### Localized types (registered with document-internationalization):
```ts
['homePage', 'pricing', 'pricingFeatures', 'navigation', 'footer', 'siteSettings']
```

---

## i18n Strategy

**Two-layer approach:**
1. **next-intl** — handles URL routing (`/en`, `/fr`, `/es`) and UI strings (buttons, nav labels, error messages)
2. **Sanity document-internationalization** — manages translated CMS content (page copy, pricing descriptions, footer text)

**`src/i18n/routing.ts`:**
```ts
export const routing = defineRouting({
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
})
```

**`src/i18n/request.ts`:** Cookie `JIMMY_LOCALE` → Accept-Language → default `en`
(matches pattern from `jimmy-web-app` for consistent UX)

**`messages/` structure** — only UI chrome strings:
```json
{
  "common": { "appName": "Jimmy", "tryFree": "Try for free" },
  "nav": { "pricing": "Pricing", "login": "Log in" },
  "home": { "wip": "Work in Progress" }
}
```

**Sanity locale mapping:** query filters `language == $locale`

---

## Caching & Data Fetching Strategy

Uses Next.js 16 `use cache` directive + Partial Prerendering.

**`next.config.ts`:**
```ts
const nextConfig: NextConfig = {
  cacheComponents: true,
}
```

**Pattern for Sanity data:**
```ts
async function HomePageContent({ locale }: { locale: string }) {
  'use cache'
  cacheLife('hours')
  cacheTag(`homePage-${locale}`)

  const data = await sanityFetch({ query: HOME_QUERY, params: { locale } })
  return <HomeHero data={data} />
}
```

**Revalidation webhook** (`/api/revalidate`):
- POST from Sanity on document publish
- Reads `_type` + `language` from body
- Calls `revalidateTag(`${type}-${language}`)` 
- Validates via `SANITY_WEBHOOK_SECRET`

**Tag convention:** `{documentType}-{locale}` — e.g., `homePage-en`, `pricing-fr`

**Static shell:** layout chrome (nav skeleton, footer) is always static (no async in shell).

---

## Component Architecture

| Layer | Type | Note |
|-------|------|------|
| `app/[locale]/layout.tsx` | Server | NextIntlClientProvider, body classes |
| `app/[locale]/page.tsx` | Server | Suspense boundaries around cached sections |
| `components/sections/*` | Server | `use cache` data fetching |
| `components/ui/*` | Server | Pure presentational |
| `components/animations/*` | Client | `use client` + framer-motion only here |
| `components/nav/MobileMenu.tsx` | Client | Toggle state |

**Rule:** `use client` only at the leaf where interactivity is required.
Never put framer-motion in a Server Component file.

---

## Environment Variables

```bash
# Sanity (public)
NEXT_PUBLIC_SANITY_PROJECT_ID=REPLACE_ME
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity (server)
SANITY_API_VERSION=2024-02-01
SANITY_API_TOKEN=            # read token for SSR fetches (add later)
SANITY_WEBHOOK_SECRET=       # validates revalidation webhook

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Implementation Checklist

### Phase A — Project scaffolding
- [ ] Create `jimmy-marketing/` directory
- [ ] Write `package.json` (all deps from stack table)
- [ ] Write `tsconfig.json` (strict, path alias `@/*` → `src/*`)
- [ ] Write `next.config.ts` (cacheComponents, Sanity image remotePatterns)
- [ ] Write `postcss.config.mjs`
- [ ] Write `src/styles/globals.css` (Tailwind v4 CSS-first)
- [ ] Write `src/lib/utils.ts` (`cn()` helper)
- [ ] Write `.env.example` and `.env.local`
- [ ] Write `.gitignore`
- [ ] Write `CLAUDE.md`

### Phase B — i18n
- [ ] Write `src/i18n/routing.ts`
- [ ] Write `src/i18n/request.ts`
- [ ] Write `middleware.ts`
- [ ] Create `messages/en.json`, `messages/fr.json`, `messages/es.json`

### Phase C — App Router shell
- [ ] Write `src/app/layout.tsx` (root, html/body)
- [ ] Write `src/app/[locale]/layout.tsx` (NextIntlClientProvider)
- [ ] Write `src/app/[locale]/page.tsx` ("Work in Progress" placeholder)
- [ ] Write `src/app/[locale]/not-found.tsx`
- [ ] Write `src/app/not-found.tsx`

### Phase D — Sanity setup
- [ ] Write `sanity/env.ts`
- [ ] Write `sanity/client.ts` (createClient + sanityFetch with use cache)
- [ ] Write `sanity/image.ts`
- [ ] Write `sanity/schemas/objects/` (seo, portableTextBlock, socialLink, navItem)
- [ ] Write `sanity/schemas/documents/` (all 6 document types)
- [ ] Write `sanity/schemas/index.ts`
- [ ] Write `sanity/structure.ts`
- [ ] Write `sanity/sanity.config.ts`
- [ ] Write `sanity/queries/index.ts` (initial GROQ queries)

### Phase E — Studio route
- [ ] Write `src/app/studio/[[...tool]]/page.tsx`

### Phase F — Revalidation API
- [ ] Write `src/app/api/revalidate/route.ts`

### Phase G — Verification
- [ ] `npm install`
- [ ] `npm run type-check` → 0 errors
- [ ] `npm run build` → success
- [ ] `/en`, `/fr`, `/es` open in browser
- [ ] `/studio` opens Sanity Studio

---

## Verification

```bash
cd jimmy-marketing
npm install
npm run type-check   # must be 0 errors
npm run build        # must succeed
npm run dev          # then open:
#   http://localhost:3000/en    → "Work in Progress"
#   http://localhost:3000/fr    → "Work in Progress" (French locale active)
#   http://localhost:3000/es    → "Work in Progress" (Spanish locale active)
#   http://localhost:3000/studio → Sanity Studio (needs valid project ID for full functionality)
```

Sanity Studio will show a "project not found" banner until `NEXT_PUBLIC_SANITY_PROJECT_ID` is set — this is expected at this stage.
