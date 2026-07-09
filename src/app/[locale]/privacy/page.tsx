import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { pageMetadata } from '@/lib/seo'
import { renderLegalPage } from '@/components/legal/renderLegalPage'
import { PRIVACY_DOC } from '@/content/legal/privacy'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata({
    locale,
    path: '/privacy',
    title: 'Privacy Policy',
    description: 'How Jimmy collects, uses and protects your personal data.',
  })
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return renderLegalPage({ doc: PRIVACY_DOC, locale })
}
