import { Suspense } from 'react'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getNavigation, getFooter } from '../../../sanity/getHomePage'
import { CookieConsentProvider } from '@/components/cookies/CookieConsentProvider'
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

  const [messages, navigation, footer] = await Promise.all([
    getMessages({ locale }),
    getNavigation(locale),
    getFooter(locale),
  ])

  if (!navigation || !footer) notFound()

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
      <CookieConsentProvider>
        <Suspense>
          <Navbar data={navigation} />
          {children}
          <Footer data={footer} />
        </Suspense>
      </CookieConsentProvider>
      <CalInit />
      <SyncHtmlLang locale={locale} />
    </NextIntlClientProvider>
  )
}
