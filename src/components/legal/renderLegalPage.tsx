import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getNavigation, getFooter } from '../../../sanity/getHomePage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LegalPage, type LegalCrossLink } from '@/components/legal/LegalPage'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/jsonld'
import { localizedUrl } from '@/lib/seo'
import {
  LEGAL_SLUGS,
  formatLegalDate,
  tocFromDoc,
  type LegalDoc,
  type LegalSlug,
} from '@/lib/legal'

const TITLE_KEY: Record<LegalSlug, 'privacyTitle' | 'termsTitle' | 'cookieTitle'> =
  {
    privacy: 'privacyTitle',
    terms: 'termsTitle',
    'cookie-policy': 'cookieTitle',
  }

const LEGAL_CONTACT = 'mailto:legal@jimmycoach.com'

export async function renderLegalPage({
  doc,
  locale,
}: {
  doc: LegalDoc
  locale: string
}) {
  const [navigation, footer, t] = await Promise.all([
    getNavigation(locale),
    getFooter(locale),
    getTranslations({ locale, namespace: 'legal' }),
  ])

  if (!navigation || !footer) notFound()

  const crossLinks: LegalCrossLink[] = LEGAL_SLUGS.filter(
    (s) => s !== doc.slug,
  ).map((s) => ({
    slug: s,
    title: t(TITLE_KEY[s]),
    href: `/${locale}/${s}`,
  }))

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: localizedUrl(locale) },
    { name: doc.title, url: localizedUrl(locale, `/${doc.slug}`) },
  ])

  return (
    <>
      <JsonLd data={breadcrumb} />
      <Navbar data={navigation} />
      <LegalPage
        doc={doc}
        toc={tocFromDoc(doc)}
        formattedDate={formatLegalDate(doc.lastUpdated, locale)}
        labels={{
          eyebrow: t('eyebrow'),
          onThisPage: t('onThisPage'),
          lastUpdated: t('lastUpdated'),
          backToTop: t('backToTop'),
          more: t('more'),
          questions: t('questions'),
          contactCta: t('contactCta'),
        }}
        crossLinks={crossLinks}
        contactHref={LEGAL_CONTACT}
      />
      <Footer data={footer} />
    </>
  )
}
