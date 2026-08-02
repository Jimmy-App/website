import { Suspense } from 'react'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getNavigation, getFooter, getFeatures } from '../../../sanity/getHomePage'
import type { FeatureStatusValue } from '@/components/features/FeatureStatus'
import { CookieConsentProvider } from '@/components/cookies/CookieConsentProvider'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { CalInit } from '@/components/cal/CalInit'
import { SyncHtmlLang } from '@/components/i18n/SyncHtmlLang'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const [messages, navigation, footer, featureCards, tStatus] = await Promise.all([
    getMessages({ locale }),
    getNavigation(locale),
    getFooter(locale),
    // Feature statuses drive the mega-menu badges — read from the feature
    // documents so the menu cannot disagree with the feature pages.
    getFeatures(locale),
    getTranslations({ locale, namespace: 'featureStatus' }),
  ])

  if (!navigation || !footer) notFound()

  const featureStatuses: Record<string, FeatureStatusValue> = Object.fromEntries(
    (featureCards ?? []).map((f) => [f.slug ?? '', (f.status ?? 'live') as FeatureStatusValue]),
  )

  // Navbar + Footer live in the layout (not per-page) so they persist across
  // navigations. `template.tsx` only wraps `{children}`, so the page body fades
  // on each transition while the fixed Navbar and the Footer stay put.
  //
  // The Suspense boundary is required by Cache Components (PPR): the Navbar's
  // next-intl <Link>s read the locale as request-scoped (uncached) data. On
  // fully-static routes this resolves at build; on the dynamic `[...rest]`
  // localized-404 route it must sit inside a Suspense boundary to stay PPR-safe.
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <MotionProvider>
        <CookieConsentProvider>
          <Suspense>
            <Navbar
              data={navigation}
              featureStatuses={featureStatuses}
              statusLabels={{ beta: tStatus('beta'), soon: tStatus('soon') }}
            />
            {children}
            <Footer data={footer} />
          </Suspense>
        </CookieConsentProvider>
      </MotionProvider>
      <CalInit />
      <SyncHtmlLang locale={locale} />
    </NextIntlClientProvider>
  )
}
