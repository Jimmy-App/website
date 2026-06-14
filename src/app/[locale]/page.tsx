import { setRequestLocale } from 'next-intl/server'
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

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <WhyJimmy />
        <Steps />
        <Platform />
        <Tech />
        <Comparison />
        <Pricing />
        <OpenBeta />
        <Team />
        <Faq />
        <Manifesto />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
