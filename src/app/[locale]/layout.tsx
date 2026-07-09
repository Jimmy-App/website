import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { CookieConsentProvider } from '@/components/cookies/CookieConsentProvider'
import { CalInit } from '@/components/cal/CalInit'
import { SyncHtmlLang } from '@/components/i18n/SyncHtmlLang'

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

  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CookieConsentProvider>{children}</CookieConsentProvider>
      <CalInit />
      <SyncHtmlLang locale={locale} />
    </NextIntlClientProvider>
  )
}
