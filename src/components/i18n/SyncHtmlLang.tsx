'use client'

import { useEffect } from 'react'

/**
 * Corrects `<html lang>` at runtime for localized routes. The shared root layout
 * renders a static `lang="en"` (it can't read the locale under Cache Components
 * without breaking /_not-found), so this fixes the attribute for screen readers
 * on /fr and /es. SEO language targeting relies on hreflang, not this.
 */
export function SyncHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])
  return null
}
