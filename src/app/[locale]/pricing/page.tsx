import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { pageMetadata, localizedUrl } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  faqSchema,
  softwareApplicationSchema,
  breadcrumbSchema,
} from '@/lib/jsonld'
import {
  getHomePage,
  getPricingPage,
  getPricingPlans,
} from '../../../../sanity/getHomePage'
import { Pricing } from '@/components/sections/Pricing'
import { Faq } from '@/components/sections/Faq'
import { PricingCta } from '@/components/sections/PricingCta'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return pageMetadata({
    locale,
    path: '/pricing',
    title: t('pricing.title'),
    description: t('pricing.description'),
  })
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [home, pricingPage, plans] = await Promise.all([
    getHomePage(locale),
    getPricingPage(locale),
    getPricingPlans(),
  ])

  if (
    !home?.pricing ||
    !plans ||
    !pricingPage?.faq ||
    !pricingPage.finalCta
  ) {
    notFound()
  }

  const tierPrices = (plans.tiers ?? [])
    .map((t) => t.priceEur ?? 0)
    .filter((p) => p > 0)
  const schemas = [
    softwareApplicationSchema({
      lowPrice: 0,
      highPrice: tierPrices.length ? Math.max(...tierPrices) : undefined,
      currency: 'EUR',
    }),
    breadcrumbSchema([
      { name: 'Home', url: localizedUrl(locale) },
      { name: 'Pricing', url: localizedUrl(locale, '/pricing') },
    ]),
  ]
  const pricingFaq = faqSchema(pricingPage.faq.items ?? [])
  if (pricingFaq) schemas.push(pricingFaq)

  return (
    <>
      <JsonLd data={schemas} />
      <main>
        {/* Reused home Pricing section + FAQ; page-specific centered CTA */}
        <Pricing data={home.pricing} plans={plans} page />
        <Faq data={pricingPage.faq} variant="pricing" />
        <PricingCta data={pricingPage.finalCta} />
      </main>
    </>
  )
}
