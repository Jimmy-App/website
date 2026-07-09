import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { renderLegalPage } from '@/components/legal/renderLegalPage'
import { PRIVACY_DOC } from '@/content/legal/privacy'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return renderLegalPage({ doc: PRIVACY_DOC, locale })
}
