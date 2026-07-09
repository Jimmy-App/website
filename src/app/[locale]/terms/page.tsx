import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { pageMetadata } from '@/lib/seo'
import { renderLegalPage } from '@/components/legal/renderLegalPage'
import { TERMS_DOC } from '@/content/legal/terms'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata({
    locale,
    path: '/terms',
    title: 'Terms of Service',
    description: "The terms governing your use of Jimmy's website, app and coaching services.",
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
