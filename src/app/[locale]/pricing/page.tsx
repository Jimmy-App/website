import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
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
  getNavigation,
  getFooter,
  getPricingPage,
  getPricingPlans,
} from '../../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Pricing } from '@/components/sections/Pricing'
import { Faq } from '@/components/sections/Faq'
import { PricingCta } from '@/components/sections/PricingCta'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata({
    locale,
    path: '/pricing',
    title: 'Pricing — Coaching Software Plans',
    description:
      'Simple, transparent pricing for the Jimmy coaching software. Start free with up to 3 clients — no card required — then scale with Club plans as your coaching business grows.',
  })
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [home, navigation, footer, pricingPage, plans] = await Promise.all([
    getHomePage(locale),
    getNavigation(locale),
    getFooter(locale),
    getPricingPage(locale),
    getPricingPlans(),
  ])

  if (
    !home?.pricing ||
    !navigation ||
    !footer ||
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
      <Navbar data={navigation} />
      <main>
        {/* Reused home Pricing section + FAQ; page-specific centered CTA */}
        <Pricing data={home.pricing} plans={plans} page />
        <Faq data={pricingPage.faq} />
        <PricingCta data={pricingPage.finalCta} />
      </main>
      <Footer data={footer} />
    </>
  )
}
