import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationSchema, websiteSchema, faqSchema } from '@/lib/jsonld'
import { getHomePage, getPricingPlans } from '../../../sanity/getHomePage'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import WhyJimmy from '@/components/sections/WhyJimmy'
import { Steps } from '@/components/sections/Steps'
import { Platform } from '@/components/sections/Platform'
import { Tech } from '@/components/sections/Tech'
import { Comparison } from '@/components/sections/Comparison'
import { Pricing } from '@/components/sections/Pricing'
import { OpenBeta } from '@/components/sections/OpenBeta'
import { Team } from '@/components/sections/Team'
import { Faq } from '@/components/sections/Faq'
import { Manifesto } from '@/components/sections/Manifesto'
import { FinalCta } from '@/components/sections/FinalCta'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  const md = await pageMetadata({
    locale,
    path: '',
    description: t('home.description'),
  })
  // Absolute home title (no "| Jimmy" suffix) targeting the primary keyword.
  return { ...md, title: { absolute: t('home.title') } }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [home, plans] = await Promise.all([
    getHomePage(locale),
    getPricingPlans(),
  ])
  if (
    !plans ||
    !home?.hero ||
    !home.features ||
    !home.why ||
    !home.steps ||
    !home.platform ||
    !home.tech ||
    !home.comparison ||
    !home.pricing ||
    !home.beta ||
    !home.team ||
    !home.faq ||
    !home.manifesto ||
    !home.finalCta
  ) {
    notFound()
  }

  const homeSchemas = [organizationSchema(), websiteSchema(locale)]
  const homeFaq = faqSchema(home.faq.items ?? [])
  if (homeFaq) homeSchemas.push(homeFaq)

  return (
    <>
      <JsonLd data={homeSchemas} />
      <main>
        <Hero data={home.hero} />
        <Features data={home.features} />
        <WhyJimmy data={home.why} />
        <Steps data={home.steps} />
        <Platform data={home.platform} />
        <Tech data={home.tech} />
        <Comparison data={home.comparison} />
        <Pricing data={home.pricing} plans={plans} />
        <OpenBeta data={home.beta} />
        <Team data={home.team} />
        <Faq data={home.faq} />
        <Manifesto data={home.manifesto} />
        <FinalCta data={home.finalCta} />
      </main>
    </>
  )
}
