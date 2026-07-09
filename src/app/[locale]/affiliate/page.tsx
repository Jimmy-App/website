import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/seo'
import {
  getNavigation,
  getFooter,
  getAffiliatePage,
  getAffiliateSettings,
} from '../../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Faq } from '@/components/sections/Faq'
import { PricingCta } from '@/components/sections/PricingCta'
import { AffiliateHero } from '@/components/affiliate/AffiliateHero'
import { AffiliateHowItWorks } from '@/components/affiliate/AffiliateHowItWorks'
import { AffiliateWhyWho } from '@/components/affiliate/AffiliateWhyWho'
import type { FaqData, FinalCtaContent } from '@/lib/content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  return pageMetadata({
    locale,
    path: '/affiliate',
    title: t('affiliate.title'),
    description: t('affiliate.description'),
  })
}

export default async function AffiliatePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [navigation, footer, page, settings] = await Promise.all([
    getNavigation(locale),
    getFooter(locale),
    getAffiliatePage(locale),
    getAffiliateSettings(),
  ])

  if (
    !navigation ||
    !footer ||
    !settings ||
    !page?.hero ||
    !page.calc ||
    !page.how ||
    !page.why ||
    !page.who ||
    !page.faq ||
    !page.finalCta
  ) {
    notFound()
  }

  return (
    <>
      <Navbar data={navigation} />
      <main>
        <AffiliateHero data={page.hero} settings={settings} calc={page.calc} />
        <AffiliateHowItWorks data={page.how} />
        <AffiliateWhyWho why={page.why} who={page.who} />
        {/* Reuses the shared Faq + PricingCta components (structurally compatible). */}
        <Faq data={page.faq as unknown as FaqData} />
        <PricingCta data={page.finalCta as unknown as FinalCtaContent} />
      </main>
      <Footer data={footer} />
    </>
  )
}
