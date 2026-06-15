import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import {
  getHomePage,
  getNavigation,
  getFooter,
  getPricingPage,
} from '../../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Pricing } from '@/components/sections/Pricing'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'

export const metadata: Metadata = { title: 'Pricing' }

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [home, navigation, footer, pricingPage] = await Promise.all([
    getHomePage(locale),
    getNavigation(locale),
    getFooter(locale),
    getPricingPage(locale),
  ])

  if (
    !home?.pricing ||
    !navigation ||
    !footer ||
    !pricingPage?.faq ||
    !pricingPage.finalCta
  ) {
    notFound()
  }

  return (
    <>
      <Navbar data={navigation} />
      <main>
        {/* Reused home-page section components, fed page-specific Sanity data */}
        <Pricing data={home.pricing} />
        <Faq data={pricingPage.faq} />
        <FinalCta data={pricingPage.finalCta} />
      </main>
      <Footer data={footer} />
    </>
  )
}
