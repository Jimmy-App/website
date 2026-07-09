import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { pageMetadata } from '@/lib/seo'
import { renderLegalPage } from '@/components/legal/renderLegalPage'
import { PRIVACY_DOC } from '@/content/legal/privacy'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return pageMetadata({
    locale,
    path: '/privacy',
    title: t('privacy.title'),
    description: t('privacy.description'),
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
