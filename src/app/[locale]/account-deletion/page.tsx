import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { pageMetadata } from '@/lib/seo'
import { renderLegalPage } from '@/components/legal/renderLegalPage'
import { ACCOUNT_DELETION_DOC } from '@/content/legal/account-deletion'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return pageMetadata({
    locale,
    path: '/account-deletion',
    title: t('accountDeletion.title'),
    description: t('accountDeletion.description'),
  })
}

export default async function AccountDeletionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return renderLegalPage({ doc: ACCOUNT_DELETION_DOC, locale })
}
