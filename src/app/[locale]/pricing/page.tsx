import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
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

export const metadata: Metadata = { title: 'Pricing' }

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
        <Pricing data={home.pricing} plans={plans} />
        <Faq data={pricingPage.faq} />
        <PricingCta data={pricingPage.finalCta} />
      </main>
      <Footer data={footer} />
    </>
  )
}
