'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ACCEPT_ALL,
  OPEN_PREFERENCES_EVENT,
  REJECT_ALL,
  readConsent,
  writeConsent,
  type ConsentCategories,
  type StoredConsent,
} from '@/lib/cookieConsent'
import { CookieBanner } from './CookieBanner'
import { CookiePreferences } from './CookiePreferences'
import { ConsentScripts } from './ConsentScripts'

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [consent, setConsent] = useState<StoredConsent | null>(null)
  // Start "decided" to avoid a banner flash for returning visitors; corrected
  // on mount once we've read the cookie.
  const [decided, setDecided] = useState(true)
  const [prefsOpen, setPrefsOpen] = useState(false)

  useEffect(() => {
    const stored = readConsent()
    setConsent(stored)
    if (stored !== null) {
      setDecided(true)
      return
    }
    // No decision yet: hold the banner back until the hero intro animation has
    // settled (its last reveal lands ~1.6s in), so it doesn't fight for
    // attention on load. Reduced-motion users get it near-immediately.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = window.setTimeout(() => setDecided(false), reduced ? 250 : 1900)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const open = () => setPrefsOpen(true)
    window.addEventListener(OPEN_PREFERENCES_EVENT, open)
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open)
  }, [])

  const commit = useCallback((c: ConsentCategories) => {
    setConsent(writeConsent(c))
    setDecided(true)
    setPrefsOpen(false)
  }, [])

  return (
    <>
      {children}
      <ConsentScripts consent={consent} />
      <CookieBanner
        visible={!decided && !prefsOpen}
        onAcceptAll={() => commit(ACCEPT_ALL)}
        onRejectAll={() => commit(REJECT_ALL)}
        onCustomize={() => setPrefsOpen(true)}
      />
      <CookiePreferences
        open={prefsOpen}
        initial={consent}
        onClose={() => setPrefsOpen(false)}
        onSave={commit}
        onAcceptAll={() => commit(ACCEPT_ALL)}
        onRejectAll={() => commit(REJECT_ALL)}
      />
    </>
  )
}
