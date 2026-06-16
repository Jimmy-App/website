import Image from 'next/image'
import { Search, ArrowRight, Clock, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { GuideCategoryKey, Guide } from '@/lib/guides'
import { isGuideCategoryKey } from '@/lib/guides'
import { GUIDE_CATEGORY_META } from '@/components/guides/categories'

/* ── Category card ──────────────────────────────────────────────────── */
function CategoryCard({
  categoryKey,
  guides,
}: {
  categoryKey: GuideCategoryKey
  guides: Guide[]
}) {
  const meta = GUIDE_CATEGORY_META[categoryKey]
  const Icon = meta.Icon
  const firstGuide = guides[0]
  const previewGuides = guides.slice(0, 3)

  return (
    <Link
      href={firstGuide?.slug ? `/guides/${firstGuide.slug}` : '/guides'}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-xs)] transition-[border-color,box-shadow,transform] duration-200 hover:border-purple-border hover:shadow-[var(--shadow-md)] hover:-translate-y-[2px]"
    >
      {/* Icon + label */}
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: meta.accent }}
        >
          <Icon className="size-5" style={{ color: meta.accentFg }} strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-[14px] font-bold text-text">{meta.label}</p>
          <p className="text-[12px] text-text-faint">
            {guides.length} guide{guides.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 flex-1 text-[13.5px] leading-[1.6] text-text-muted">{meta.description}</p>

      {/* Preview guide titles */}
      <ul className="mb-4 space-y-1.5 border-t border-divider pt-4">
        {previewGuides.map((g) => (
          <li key={g.slug} className="flex items-center gap-2 text-[13px] text-text-muted">
            <span className="size-[5px] shrink-0 rounded-full bg-purple-border" />
            {g.title}
          </li>
        ))}
        {guides.length > previewGuides.length && (
          <li className="text-[12px] text-text-faint">
            +{guides.length - previewGuides.length} more
          </li>
        )}
      </ul>

      {/* CTA arrow */}
      <div className="flex items-center gap-1 text-[13px] font-semibold text-purple opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        Browse guides <ArrowRight className="size-3.5" />
      </div>
    </Link>
  )
}

/* ── Popular guide card ─────────────────────────────────────────────── */
function PopularCard({ guide }: { guide: Guide }) {
  const category = isGuideCategoryKey(guide.category) ? guide.category : 'getting-started'
  const meta = GUIDE_CATEGORY_META[category]
  const Icon = meta.Icon
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-4 transition-[border-color,box-shadow] duration-200 hover:border-purple-border hover:shadow-[var(--shadow-sm)]"
    >
      <span
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: meta.accent }}
      >
        <Icon className="size-4" style={{ color: meta.accentFg }} strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[13.5px] font-semibold leading-[1.35] text-text group-hover:text-purple transition-colors">
          {guide.title}
        </p>
        <div className="flex items-center gap-2 text-[12px] text-text-faint">
          <Clock className="size-3" strokeWidth={1.75} />
          {guide.readMin} min
          <span className="text-text-faint/50">·</span>
          <span
            className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
            style={{ background: meta.accent, color: meta.accentFg }}
          >
            {guide.level}
          </span>
        </div>
      </div>
      <ChevronRight className="mt-0.5 size-4 shrink-0 text-text-faint transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-purple" />
    </Link>
  )
}

/* ── Landing ──────────────────────────────────────────────────────────── */
type Props = {
  categories: { key: GuideCategoryKey; guides: Guide[] }[]
  popular: Guide[]
  t: {
    eyebrow: string
    title: string
    subtitle: string
    searchPlaceholder: string
    popularTitle: string
    ctaTitle: string
    ctaBody: string
    ctaBtn: string
  }
}

export function GuidesLanding({ categories, popular, t }: Props) {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-surface-2">
        {/* Purple glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[30%] left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-full opacity-50 blur-[90px]"
          style={{ background: 'radial-gradient(circle, rgba(138,50,224,0.18), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[860px] px-[clamp(20px,5vw,40px)] pb-[clamp(3rem,6vw,5rem)] pt-[calc(var(--navbar-height)+clamp(2.5rem,5vw,4rem))]">
          <p className="eyebrow mb-3">{t.eyebrow}</p>
          <h1 className="mb-4 font-display text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[var(--tracking-display)] text-text text-balance">
            {t.title}
          </h1>
          <p className="mb-8 max-w-[52ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.65] text-text-muted">
            {t.subtitle}
          </p>

          {/* Search bar (static — links to first result on submit for now) */}
          <div className="relative max-w-[440px]">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-faint"
              strokeWidth={1.75}
            />
            <input
              type="search"
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              readOnly
              className="w-full cursor-pointer rounded-full border border-border bg-surface py-3.5 pl-11 pr-4 text-[14px] text-text shadow-[var(--shadow-sm)] placeholder:text-text-faint focus:border-purple-border focus:outline-none focus:ring-2 focus:ring-purple/20"
            />
            <kbd className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 hidden select-none rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-text-faint sm:block">
              /
            </kbd>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-[clamp(20px,5vw,40px)] py-[clamp(3rem,5vw,4.5rem)]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ key, guides }) => (
            <CategoryCard key={key} categoryKey={key} guides={guides} />
          ))}
        </div>
      </section>

      {/* ── Popular guides ────────────────────────────────────────── */}
      {popular.length > 0 && (
        <section className="border-t border-border bg-surface-2">
          <div className="mx-auto max-w-[1120px] px-[clamp(20px,5vw,40px)] py-[clamp(2.5rem,5vw,4rem)]">
            <h2 className="mb-5 font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-extrabold tracking-[var(--tracking-tight)] text-text">
              {t.popularTitle}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((g) => (
                <PopularCard key={g.slug} guide={g} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="px-[clamp(20px,5vw,40px)] py-[clamp(3rem,6vw,5rem)]">
        <div
          className="relative mx-auto max-w-[760px] overflow-hidden rounded-[24px] border border-white/10 px-[clamp(24px,4vw,52px)] py-[clamp(32px,5vw,48px)] text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.55)]"
          style={{ background: 'linear-gradient(165deg, #221C2E 0%, #1A1620 100%)' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[40%] left-1/2 h-[320px] w-[560px] -translate-x-1/2 rounded-full blur-[80px]"
            style={{ background: 'radial-gradient(circle, rgba(138,50,224,0.45), transparent 70%)' }}
          />
          <div className="relative">
            <Image
              src="/assets/logo/logo.svg"
              alt=""
              width={56}
              height={56}
              aria-hidden
              className="mx-auto mb-5 size-[52px] rounded-[14px] shadow-[0_8px_24px_rgba(138,50,224,0.34)]"
            />
            <h2 className="mx-auto max-w-[24ch] font-display text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold leading-[1.15] tracking-[var(--tracking-tight)] text-white text-balance">
              {t.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-[48ch] text-[14.5px] leading-[1.6] text-white/60">
              {t.ctaBody}
            </p>
            <Link
              href="/pricing"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-purple px-8 py-[14px] text-[15px] font-semibold text-white transition-[background,transform] duration-200 hover:bg-purple-hover active:scale-[0.97]"
            >
              {t.ctaBtn}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
