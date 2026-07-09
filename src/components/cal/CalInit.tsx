'use client'

import { useEffect } from 'react'
import { getCalApi } from '@calcom/embed-react'
import { CAL_NAMESPACE } from '@/lib/cal'

/**
 * Initialises the Cal.com embed once per page: registers the "demo" namespace
 * and themes the modal to the brand purple. Renders nothing — the actual
 * triggers are any elements carrying `calTriggerProps`.
 */
export function CalInit() {
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE })
      if (cancelled) return
      cal('ui', {
        theme: 'light',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#8a32e0' },
          dark: { 'cal-brand': '#fafafa' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return null
}
