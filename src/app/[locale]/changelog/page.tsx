import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/seo'
import { getNavigation, getFooter, getChangelog } from '../../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Changelog } from '@/components/changelog/Changelog'
import { ChangelogCta } from '@/components/changelog/ChangelogCta'
import { toRelease } from '@/lib/changelog'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata({
    locale,
    path: '/changelog',
    title: 'Changelog',
    description:
      'Every Jimmy update, in the open. New features, improvements and fixes for modern fitness coaches — shipped continuously.',
  })
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [navigation, footer, docs, t] = await Promise.all([
    getNavigation(locale),
    getFooter(locale),
    getChangelog(locale),
    getTranslations({ locale, namespace: 'changelog' }),
  ])
  if (!navigation || !footer) notFound()

  const releases = docs.map(toRelease)

  return (
    <>
      <Navbar data={navigation} />
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
      <Footer data={footer} />
    </>
  )
}
