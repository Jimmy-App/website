import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ChevronRight, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import {
  getNavigation,
  getFooter,
  getGuides,
  getGuide,
  getGuideSlugs,
} from '../../../../../sanity/getHomePage'
import { Link } from '@/i18n/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ReadingBar } from '@/components/blog/ArticleInteractive'
import { GuidesSidebar } from '@/components/guides/GuidesSidebar'
import { GuideToc } from '@/components/guides/GuideToc'
import { GuidePortableBody } from '@/components/guides/GuidePortableBody'
import { GuideFeedback } from '@/components/guides/GuideFeedback'
import { GUIDE_CATEGORY_META } from '@/components/guides/categories'
import {
  groupByCategory,
  prevNext,
  tocFromBody,
  formatGuideDate,
  isGuideCategoryKey,
  isGuideLevel,
  type GuideCategoryKey,
} from '@/lib/guides'

const CATEGORY_ORDER: GuideCategoryKey[] = [
  'getting-started',
  'branded-app',
  'programming',
  'community',
  'payments',
  'retention',
]

export async function generateStaticParams() {
  const slugs = await getGuideSlugs()
  return slugs
    .filter((s): s is { slug: string } => s.slug !== null)
    .map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const guide = await getGuide(locale, slug)
  if (!guide) return { title: 'Guides' }
  return { title: guide.title ?? 'Guide', description: guide.lead ?? undefined }
}

/* ── Level badge colours ─────────────────────────────────────────────── */
const LEVEL_STYLES = {
  Beginner: { bg: 'rgba(16,185,129,0.10)', fg: '#0f766e' },
  Intermediate: { bg: 'rgba(245,158,11,0.10)', fg: '#b45309' },
  Advanced: { bg: 'rgba(239,68,68,0.10)', fg: '#dc2626' },
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [guide, guides, navigation, footer, t] = await Promise.all([
    getGuide(locale, slug),
    getGuides(locale),
    getNavigation(locale),
    getFooter(locale),
    getTranslations({ locale, namespace: 'guides' }),
  ])

  if (!guide) notFound()
  if (!navigation || !footer) notFound()

  const byCategory = groupByCategory(guides)
  const sidebarGroups = CATEGORY_ORDER.map((key) => ({
    key,
    guides: byCategory[key],
  }))

  const { prev, next } = prevNext(guides, slug)
  const toc = tocFromBody(guide.body)

  const category = isGuideCategoryKey(guide.category) ? guide.category : 'getting-started'
  const catMeta = GUIDE_CATEGORY_META[category]

  const level = isGuideLevel(guide.level) ? guide.level : 'Beginner'
  const levelStyle = LEVEL_STYLES[level]
  const levelLabel = t(`level.${level}`)

  const updatedFormatted = formatGuideDate(guide.updatedAt)

  return (
    <>
      {/* Mobile reading progress bar */}
      <ReadingBar />
      <Navbar data={navigation} />

      {/* ── 3-column docs layout ─────────────────────────────────── */}
      <div
        className="mx-auto grid max-w-[1280px] px-[clamp(20px,3vw,24px)]"
        style={{
          paddingTop: 'calc(var(--navbar-height) + clamp(1.5rem, 3vw, 2rem))',
          paddingBottom: 'clamp(3rem, 6vw, 5rem)',
          gridTemplateColumns: '1fr',
          gap: 'clamp(1.5rem, 3vw, 2rem)',
        }}
      >
        <div className="lg:grid lg:grid-cols-[220px_1fr_200px] lg:gap-8 xl:grid-cols-[240px_1fr_210px] xl:gap-10">
          {/* ── Left sidebar ────────────────────────────────────── */}
          <GuidesSidebar
            groups={sidebarGroups}
            searchPlaceholder={t('searchPlaceholder')}
            browseLabel={t('browseGuides')}
            noResults={t('noResults')}
          />

          {/* ── Centre: article ──────────────────────────────────── */}
          <main id="guide-article" className="min-w-0">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex flex-wrap items-center gap-1 text-[12.5px] text-text-muted"
            >
              <Link href="/guides" className="transition-colors hover:text-purple">
                {t('breadcrumb')}
              </Link>
              <ChevronRight className="size-3 text-text-faint" />
              <span style={{ color: catMeta.accentFg }}>{catMeta.label}</span>
              <ChevronRight className="size-3 text-text-faint" />
              <span className="text-text">{guide.title}</span>
            </nav>

            {/* Article header */}
            <header className="mb-8">
              <p
                className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em]"
                style={{ color: catMeta.accentFg }}
              >
                {catMeta.label}
              </p>
              <h1 className="mb-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-[1.1] tracking-[var(--tracking-display)] text-text text-balance">
                {guide.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-text-muted">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
                  style={{ background: levelStyle.bg, color: levelStyle.fg }}
                >
                  {levelLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-text-faint" strokeWidth={1.75} />
                  {t('minRead', { n: guide.readMin ?? 0 })}
                </span>
                <span className="size-[3px] rounded-full bg-text-faint" />
                <span>{t('updated', { date: updatedFormatted })}</span>
              </div>

              {/* Lead */}
              <p className="mt-5 max-w-[58ch] text-[clamp(1rem,1.5vw,1.075rem)] leading-[1.7] text-text-muted">
                {guide.lead}
              </p>
            </header>

            {/* Body */}
            {guide.body && <GuidePortableBody body={guide.body} />}

            {/* Footer: feedback + prev/next */}
            <div className="mt-10 space-y-8 border-t border-divider pt-8">
              <GuideFeedback
                wasHelpful={t('wasHelpful')}
                yes={t('yes')}
                no={t('no')}
                thanks={t('thanks')}
              />

              <nav
                aria-label="Guide navigation"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {prev ? (
                  <Link
                    href={`/guides/${prev.slug}`}
                    className="group flex flex-col rounded-xl border border-border bg-surface p-4 transition-[border-color,box-shadow] duration-150 hover:border-purple-border hover:shadow-[var(--shadow-sm)]"
                  >
                    <span className="mb-1 flex items-center gap-1 text-[11.5px] font-semibold text-text-faint">
                      <ArrowLeft className="size-3" />
                      {t('previous')}
                    </span>
                    <span className="text-[13.5px] font-semibold text-text transition-colors group-hover:text-purple">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {next ? (
                  <Link
                    href={`/guides/${next.slug}`}
                    className="group flex flex-col items-end rounded-xl border border-border bg-surface p-4 text-right transition-[border-color,box-shadow] duration-150 hover:border-purple-border hover:shadow-[var(--shadow-sm)]"
                  >
                    <span className="mb-1 flex items-center gap-1 text-[11.5px] font-semibold text-text-faint">
                      {t('next')}
                      <ArrowRight className="size-3" />
                    </span>
                    <span className="text-[13.5px] font-semibold text-text transition-colors group-hover:text-purple">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </nav>
            </div>
          </main>

          {/* ── Right TOC ────────────────────────────────────────── */}
          {toc.length > 0 && (
            <GuideToc
              items={toc}
              onThisPage={t('onThisPage')}
              readingLabel={t('reading')}
            />
          )}
        </div>
      </div>

      <Footer data={footer} />
    </>
  )
}
