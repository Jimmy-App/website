# Marketing Website Scaffold (Next.js + Sanity)

Production-ready scaffold for a SaaS marketing/corporate site using Next.js App Router, TypeScript, and an embedded Sanity Studio at `/studio`.

## Stack

- Next.js (App Router)
- TypeScript
- Sanity Studio v3 (embedded)
- next-sanity + GROQ

## Locale Routing

Supported locales: `en` (default), `fr`, `es`.

- English has no prefix: `/`, `/blog`, `/docs/...`
- French is prefixed: `/fr`, `/fr/blog`, `/fr/docs/...`
- Spanish is prefixed: `/es`, `/es/blog`, `/es/docs/...`

Proxy behavior:

- `/studio`, `/_next`, `/api`, and public files are untouched.
- `/fr` and `/es` are untouched.
- `/en/...` redirects to the same path without `/en`.
- All other paths rewrite to `/en/...` internally.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment variables:

```bash
cp .env.example .env.local
```

Fill in:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SITE_URL`

3. Run the app:

```bash
npm run dev
```

4. Open:

- Marketing site: `http://localhost:3000`
- Studio: `http://localhost:3000/studio`

## Content Model

Document-level translation is enabled via the Sanity Document Internationalization plugin. Each localized document includes a `language` field managed by the plugin.

Content types:

- `siteSettings`: site name, domain, social links, default SEO, supported locales, default locale
- `page`: slug, title, seo, blocks[] (structured objects)
- `post`: slug, title, excerpt, body, publish date, author, categories
- `docPage`: hierarchical slug/path, title, body, order, optional parent
- `navigation` + `footer`: localized labels and links

## Creating Initial Content (EN/FR/ES)

1. Create `siteSettings` documents for `en`, `fr`, and `es`.
2. Create `navigation` and `footer` documents for each locale.
3. Create `page` documents:
   - `home` (for `/`)
   - `privacy` (for `/privacy`)
   - `terms` (for `/terms`)
4. Create `post` documents per locale for `/blog`.
5. Create `docPage` documents per locale for `/docs`.
   - Use nested slugs like `getting-started/intro` for deeper routes.
6. Use the translation menu in Sanity to create localized variants.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run lint` - lint
- `npm run typecheck` - TypeScript checks
- `npm run format` - Prettier check

## Deploy to Vercel

```bash
vercel
```

For production:

```bash
vercel --prod
```

Set the same environment variables in Vercel as in `.env.local`.
