import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getNavigation, getFooter, getGuides } from '../../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { GuidesLanding } from '@/components/guides/GuidesLanding'
import { groupByCategory, type GuideCategoryKey } from '@/lib/guides'
import { isProduction } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Guides',
  description:
    'Step-by-step guides for setting up Jimmy, programming workouts, growing your community and getting paid.',
  // Work-in-progress: keep out of search indexes until the section ships.
  robots: { index: false, follow: false },
}

const CATEGORY_ORDER: GuideCategoryKey[] = [
  'getting-started',
  'branded-app',
  'programming',
  'community',
  'payments',
  'retention',
]

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  // Guides isn't content-complete yet — accessible on preview/local only.
  if (isProduction) notFound()

  const [navigation, footer, guides, t] = await Promise.all([
    getNavigation(locale),
    getFooter(locale),
    getGuides(locale),
    getTranslations({ locale, namespace: 'guides' }),
  ])
  if (!navigation || !footer) notFound()

  const byCategory = groupByCategory(guides)
  const categories = CATEGORY_ORDER.map((key) => ({
    key,
    guides: byCategory[key],
  }))

  const popular = guides.filter((g) => g.popular === true)

  return (
    <>
      <Navbar data={navigation} />
      <GuidesLanding
        categories={categories}
        popular={popular}
        t={{
          eyebrow: t('eyebrow'),
          title: t('title'),
          subtitle: t('subtitle'),
          searchPlaceholder: t('searchPlaceholder'),
          popularTitle: t('popularTitle'),
          ctaTitle: t('ctaTitle'),
          ctaBody: t('ctaBody'),
          ctaBtn: t('ctaBtn'),
        }}
      />
      <Footer data={footer} />
    </>
  )
}
