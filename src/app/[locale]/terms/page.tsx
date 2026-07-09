import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { renderLegalPage } from '@/components/legal/renderLegalPage'
import { TERMS_DOC } from '@/content/legal/terms'

export const metadata: Metadata = { title: 'Terms of Service' }

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return renderLegalPage({ doc: TERMS_DOC, locale })
}
