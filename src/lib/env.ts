/**
 * Deployment environment flags.
 * `NEXT_PUBLIC_VERCEL_ENV` is injected by Vercel: 'production' on the prod
 * deployment, 'preview' on branch/preview deploys (e.g. `pre`), and undefined
 * locally. Exposed to the client because the nav needs it.
 */
export const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

/**
 * The Guides section isn't content-complete yet, so it's kept off production:
 * live on preview + local, shown as "Soon" (non-navigable) on production and
 * excluded from indexing everywhere until it ships.
 */
export const guidesEnabled = !isProduction
