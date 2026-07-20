import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { pageMetadata, localizedUrl } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/jsonld'
import {
  getFeature,
  getFeatures,
  getFeatureSlugs,
} from '../../../../../sanity/getHomePage'
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
  const t = await getTranslations({ locale, namespace: 'seo' })
  const feature = toFeature(doc)
  return pageMetadata({
    locale,
    path: `/features/${slug}`,
    title: `${feature.name} ${t('featureSuffix')}`,
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

  const [doc, allCards, t] = await Promise.all([
    getFeature(locale, slug),
    getFeatures(locale),
    getTranslations({ locale, namespace: 'features' }),
  ])

  if (!doc) notFound()

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

  const featureBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: localizedUrl(locale) },
    { name: 'Features', url: localizedUrl(locale, '/#features') },
    { name: feature.name, url: localizedUrl(locale, `/features/${slug}`) },
  ])

  return (
    <>
      <JsonLd data={featureBreadcrumb} />

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
    </>
  )
}
