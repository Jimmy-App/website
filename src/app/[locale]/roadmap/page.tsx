import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getNavigation, getFooter, getChangelog, getRoadmap } from '../../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RoadmapBoard } from '@/components/roadmap/RoadmapBoard'
import { RecentlyShipped, type ShippedItem } from '@/components/roadmap/RecentlyShipped'
import { RoadmapCta } from '@/components/roadmap/RoadmapCta'
import { groupRoadmap } from '@/lib/roadmap'

export const metadata: Metadata = {
  title: 'Roadmap',
  description:
    "What we're building next for modern fitness coaches. Now, Next and Later — shaped by the coaches who use Jimmy every day.",
}

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [navigation, footer, changelog, roadmap, t] = await Promise.all([
    getNavigation(locale),
    getFooter(locale),
    getChangelog(locale),
    getRoadmap(locale),
    getTranslations({ locale, namespace: 'roadmap' }),
  ])
  if (!navigation || !footer) notFound()

  const columns = groupRoadmap(roadmap)

  // Recently shipped = latest changelog releases (DRY with /changelog).
  const shipped: ShippedItem[] = changelog.slice(0, 4).map((r) => ({
    version: r.version ?? '',
    title: r.title ?? '',
    when: new Date(r.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }))

  return (
    <>
      <Navbar data={navigation} />
      <main>
        <RoadmapBoard
          columns={columns}
          t={{
            eyebrow: t('eyebrow'),
            titlePrefix: t('titlePrefix'),
            titleAccent: t('titleAccent'),
            subtitle: t('subtitle'),
            note: t('note'),
            votes: t('votes'),
            upvote: t('upvote'),
            columns: {
              now: { title: t('colNow'), sub: t('colNowSub') },
              next: { title: t('colNext'), sub: t('colNextSub') },
              later: { title: t('colLater'), sub: t('colLaterSub') },
            },
          }}
        />
        <RecentlyShipped
          items={shipped}
          t={{ title: t('shippedTitle'), all: t('shippedAll') }}
        />
        <RoadmapCta
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
