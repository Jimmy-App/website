import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/seo'
import {
  getNavigation,
  getFooter,
  getFeature,
  getFeatures,
  getFeatureSlugs,
} from '../../../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FeatureHero } from '@/components/features/FeatureHero'
import { FeatureCapabilities } from '@/components/features/FeatureCapabilities'
import { FeatureRelated } from '@/components/features/FeatureRelated'
import { FeatureCta } from '@/components/features/FeatureCta'
import { toFeature, toFeatureCard } from '@/lib/features'

export async function generateStaticParams() {
  const slugs = await getFeatureSlugs()
  return slugs
    .map((s) => s.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const doc = await getFeature(locale, slug)
  if (!doc) return pageMetadata({ locale, path: `/features/${slug}`, title: 'Features' })
  const feature = toFeature(doc)
  return pageMetadata({
    locale,
    path: `/features/${slug}`,
    title: feature.name,
    description: feature.lead,
  })
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [doc, allCards, navigation, footer, t] = await Promise.all([
    getFeature(locale, slug),
    getFeatures(locale),
    getNavigation(locale),
    getFooter(locale),
    getTranslations({ locale, namespace: 'features' }),
  ])

  if (!doc) notFound()
  if (!navigation || !footer) notFound()

  const feature = toFeature(doc)

  // Related = same audience, excluding the current feature.
  const related = allCards
    .filter((c) => c.audience === feature.audience && c.slug !== feature.slug)
    .map(toFeatureCard)

  const audienceLabel =
    feature.audience === 'For Members' ? t('forMembers') : t('forCoaches')
  const moreForAudience =
    feature.audience === 'For Members'
      ? t('moreForMembers')
      : t('moreForCoaches')

  return (
    <>
      <Navbar data={navigation} />

      <main>
        <FeatureHero
          feature={feature}
          t={{
            breadcrumbHome: t('breadcrumbHome'),
            breadcrumbFeatures: t('breadcrumbFeatures'),
            forCoaches: audienceLabel,
            startFree: t('startFree'),
            bookDemo: t('bookDemo'),
          }}
        />

        <FeatureCapabilities
          feature={feature}
          whatsInside={t('whatsInside')}
        />

        <FeatureRelated
          features={related}
          platform={t('platform')}
          moreForCoaches={moreForAudience}
        />

        <FeatureCta
          t={{
            ctaEyebrow: t('ctaEyebrow'),
            ctaTitlePrefix: t('ctaTitlePrefix'),
            ctaTitleAccent: t('ctaTitleAccent'),
            ctaTitleSuffix: t('ctaTitleSuffix'),
            ctaBody: t('ctaBody'),
            startFree: t('startFree'),
            bookDemo: t('bookDemo'),
          }}
        />
      </main>

      <Footer data={footer} />
    </>
  )
}
