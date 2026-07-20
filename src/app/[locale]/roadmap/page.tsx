import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/seo'
import { getChangelog, getRoadmap } from '../../../../sanity/getHomePage'
import { RoadmapBoard } from '@/components/roadmap/RoadmapBoard'
import { RecentlyShipped, type ShippedItem } from '@/components/roadmap/RecentlyShipped'
import { RoadmapCta } from '@/components/roadmap/RoadmapCta'
import { groupRoadmap } from '@/lib/roadmap'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return pageMetadata({
    locale,
    path: '/roadmap',
    title: t('roadmap.title'),
    description: t('roadmap.description'),
  })
}

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [changelog, roadmap, t] = await Promise.all([
    getChangelog(locale),
    getRoadmap(locale),
    getTranslations({ locale, namespace: 'roadmap' }),
  ])

  const columns = groupRoadmap(roadmap)

  // Recently shipped = latest changelog releases (DRY with /changelog).
  const shipped: ShippedItem[] = changelog.slice(0, 4).map((r) => ({
    version: r.version ?? '',
    title: r.title ?? '',
    when: new Date(r.date ?? '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }))

  return (
    <>
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
    </>
  )
}
