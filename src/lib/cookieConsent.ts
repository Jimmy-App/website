/**
 * Cookie-consent storage + helpers (client-side).
 * The consent choice is persisted in the `cookie-consent` cookie documented in
 * the Cookie Policy (1-year lifetime). Category scripts (GA4 / Meta Pixel) are
 * gated on these values — see ConsentScripts.tsx.
 */

export const CONSENT_COOKIE = 'cookie-consent'
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365 // 1 year (seconds)
export const CONSENT_VERSION = 1

export interface ConsentCategories {
  analytics: boolean
  marketing: boolean
}

export interface StoredConsent extends ConsentCategories {
  v: number
  ts: string
}

/** Custom event fired on the window whenever consent changes. */
export const CONSENT_EVENT = 'cookie:consent-change'
/** Custom event that asks the provider to open the preferences dialog. */
export const OPEN_PREFERENCES_EVENT = 'cookie:open-preferences'

export const ACCEPT_ALL: ConsentCategories = { analytics: true, marketing: true }
export const REJECT_ALL: ConsentCategories = { analytics: false, marketing: false }

/** Read the current stored consent, or null if the visitor hasn't decided. */
export function readConsent(): StoredConsent | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`))
  if (!match) return null
  try {
    const raw = decodeURIComponent(match.slice(CONSENT_COOKIE.length + 1))
    const parsed = JSON.parse(raw) as Partial<StoredConsent>
    if (parsed.v !== CONSENT_VERSION) return null
    return {
      v: CONSENT_VERSION,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      ts: typeof parsed.ts === 'string' ? parsed.ts : '',
    }
  } catch {
    return null
  }
}

/** Persist a consent choice and broadcast the change. */
export function writeConsent(categories: ConsentCategories): StoredConsent {
  const value: StoredConsent = {
    v: CONSENT_VERSION,
    analytics: categories.analytics,
    marketing: categories.marketing,
    ts: new Date().toISOString(),
  }
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}` +
    `; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`

  // Best-effort cleanup: if a category was declined, drop its known cookies so
  // withdrawing consent actually removes the trackers.
  if (!categories.analytics) deleteCookies(['_ga', '_gid', '_gat'], /^_ga_/)
  if (!categories.marketing) deleteCookies(['_fbp', '_fbc'])

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
  return value
}

/** Remove cookies by exact name and/or a name pattern, on the base domain. */
function deleteCookies(names: string[], pattern?: RegExp): void {
  if (typeof document === 'undefined') return
  const host = window.location.hostname
  const base = host.replace(/^www\./, '')
  const domains = [undefined, host, `.${base}`]
  const present = document.cookie.split('; ').map((r) => r.split('=')[0])
  const targets = new Set(names)
  if (pattern) present.forEach((n) => pattern.test(n) && targets.add(n))
  targets.forEach((name) => {
    domains.forEach((domain) => {
      document.cookie =
        `${name}=; Max-Age=0; Path=/` + (domain ? `; Domain=${domain}` : '')
    })
  })
}
