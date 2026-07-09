import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { renderLegalPage } from '@/components/legal/renderLegalPage'
import { COOKIE_DOC } from '@/content/legal/cookie-policy'

export const metadata: Metadata = { title: 'Cookie Policy' }

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return renderLegalPage({ doc: COOKIE_DOC, locale })
}
