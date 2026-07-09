import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/seo'
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
    title: 'Pricing',
    description:
      'Simple, transparent pricing for fitness coaches. Start free with up to 3 clients — no card required, then scale with Club plans as you grow.',
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

  return (
    <>
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
