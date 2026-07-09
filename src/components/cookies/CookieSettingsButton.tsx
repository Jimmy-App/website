'use client'

import { useTranslations } from 'next-intl'
import { OPEN_PREFERENCES_EVENT } from '@/lib/cookieConsent'

/**
 * Footer entry point that reopens the cookie preferences dialog. Decoupled from
 * the provider via a window event so it can live in the (server) Footer tree.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  const t = useTranslations('cookies')
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}
      className={className}
    >
      {t('footerSettings')}
    </button>
  )
}
