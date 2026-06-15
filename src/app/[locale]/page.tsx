import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getHomePage, getNavigation, getFooter, getPricingPlans } from '../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [home, navigation, footer, plans] = await Promise.all([
    getHomePage(locale),
    getNavigation(locale),
    getFooter(locale),
    getPricingPlans(),
  ])
  if (
    !navigation ||
    !footer ||
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

  return (
    <>
      <Navbar data={navigation} />
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
      <Footer data={footer} />
    </>
  )
}
