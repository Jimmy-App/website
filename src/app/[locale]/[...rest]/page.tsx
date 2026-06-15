import { Suspense } from 'react'
import { getNavigation, getFooter, getSiteSettings } from '../../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { NotFoundContent } from '@/components/layout/NotFoundContent'

export const metadata = { title: 'Page not found', robots: { index: false } }

// Localized 404 for any unmatched path under /[locale]/…. The `rest` segment is
// unknowable, so `params` is dynamic and must be read inside <Suspense> to stay
// PPR-safe under Cache Components. Renders our Navbar + 404 stage + Footer.
export default function CatchAll({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return (
    <Suspense fallback={<div className="min-h-[78dvh]" />}>
      <NotFoundView params={params} />
    </Suspense>
  )
}

async function NotFoundView({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [navigation, footer, settings] = await Promise.all([
    getNavigation(locale),
    getFooter(locale),
    getSiteSettings(locale),
  ])

  return (
    <>
      {navigation && <Navbar data={navigation} />}
      <NotFoundContent data={settings?.notFound ?? null} locale={locale} />
      {footer && <Footer data={footer} />}
    </>
  )
}
