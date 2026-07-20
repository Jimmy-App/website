import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/seo'
import { getChangelog } from '../../../../sanity/getHomePage'
import { Changelog } from '@/components/changelog/Changelog'
import { ChangelogCta } from '@/components/changelog/ChangelogCta'
import { toRelease } from '@/lib/changelog'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return pageMetadata({
    locale,
    path: '/changelog',
    title: t('changelog.title'),
    description: t('changelog.description'),
  })
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [docs, t] = await Promise.all([
    getChangelog(locale),
    getTranslations({ locale, namespace: 'changelog' }),
  ])

  const releases = docs.map(toRelease)

  return (
    <>
      <main>
        <Changelog
          releases={releases}
          t={{
            eyebrow: t('eyebrow'),
            titlePrefix: t('titlePrefix'),
            titleAccent: t('titleAccent'),
            subtitle: t('subtitle'),
            latest: t('latest'),
            showMore: t('showMore'),
            new: t('tagNew'),
            improved: t('tagImproved'),
            fixed: t('tagFixed'),
          }}
        />
        <ChangelogCta
          t={{
            titlePrefix: t('ctaTitlePrefix'),
            titleAccent: t('ctaTitleAccent'),
            body: t('ctaBody'),
            primary: t('ctaPrimary'),
            secondary: t('ctaSecondary'),
          }}
        />
      </main>
    </>
  )
}
