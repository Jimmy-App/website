import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getNavigation, getFooter } from '../../../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FeatureHero } from '@/components/features/FeatureHero'
import { FeatureCapabilities } from '@/components/features/FeatureCapabilities'
import { FeatureRelated } from '@/components/features/FeatureRelated'
import { FeatureCta } from '@/components/features/FeatureCta'
import {
  getFeature,
  relatedFeatures,
  allCoachSlugs,
} from '@/lib/features'

export async function generateStaticParams() {
  const slugs = allCoachSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const feature = getFeature(slug)
  if (!feature) return { title: 'Features' }
  return {
    title: feature.name,
    description: feature.lead,
    openGraph: {
      title: `${feature.name} — Jimmy`,
      description: feature.lead,
    },
  }
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const feature = getFeature(slug)
  if (!feature) notFound()

  const related = relatedFeatures(slug)

  const [navigation, footer, t] = await Promise.all([
    getNavigation(locale),
    getFooter(locale),
    getTranslations({ locale, namespace: 'features' }),
  ])

  if (!navigation || !footer) notFound()

  return (
    <>
      <Navbar data={navigation} />

      <main>
        <FeatureHero
          feature={feature}
          t={{
            breadcrumbHome: t('breadcrumbHome'),
            breadcrumbFeatures: t('breadcrumbFeatures'),
            forCoaches: t('forCoaches'),
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
          moreForCoaches={t('moreForCoaches')}
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
