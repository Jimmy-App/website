import { Suspense } from 'react'
import { getSiteSettings } from '../../../../sanity/getHomePage'
import { NotFoundContent } from '@/components/layout/NotFoundContent'

export const metadata = { title: 'Page not found', robots: { index: false } }

// Localized 404 for any unmatched path under /[locale]/…. The `rest` segment is
// unknowable, so `params` is dynamic and must be read inside <Suspense> to stay
// PPR-safe under Cache Components. Renders the 404 stage.
//
// NOTE: this responds HTTP 200 (a "soft 404"), not 404. Under Cache Components
// the shared [locale] layout prerenders a static shell that flushes a 200 before
// this page could call notFound(), so a hard 404 status isn't reachable here.
// The page is noindex + clearly "not found", which Google detects and treats as
// a 404 — acceptable given PPR. See git history for the notFound() experiment.
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
  const [settings] = await Promise.all([getSiteSettings(locale)])

  return (
    <>
      <NotFoundContent data={settings?.notFound ?? null} locale={locale} />
    </>
  )
}
