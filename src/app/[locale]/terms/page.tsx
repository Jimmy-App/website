import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { pageMetadata } from '@/lib/seo'
import { renderLegalPage } from '@/components/legal/renderLegalPage'
import { TERMS_DOC } from '@/content/legal/terms'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return pageMetadata({
    locale,
    path: '/terms',
    title: t('terms.title'),
    description: t('terms.description'),
  })
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return renderLegalPage({ doc: TERMS_DOC, locale })
}
