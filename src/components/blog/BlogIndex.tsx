'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { m as motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight, Search, SearchX, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { CategoryKey } from '@/lib/blog'
import { BlogCover } from './BlogCover'
import { PostCard, type CardPost } from './PostCard'

const CATS: ('all' | CategoryKey)[] = ['all', 'stories', 'retention', 'training', 'business', 'product']
const EASE = [0.16, 1, 0.3, 1] as const

export function BlogIndex({
  featured,
  picks,
  posts,
}: {
  featured: CardPost
  picks: CardPost[]
  posts: CardPost[] // non-featured
}) {
  const t = useTranslations('blog')
  const reduce = useReducedMotion() ?? false
  const [active, setActive] = useState<'all' | CategoryKey>('all')
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const q = query.trim().toLowerCase()

  // "/" focuses search from anywhere; Esc clears + blurs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      if (e.key === '/' && !typing) {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === 'Escape' && el === inputRef.current) {
        setQuery('')
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const catLabel = (c: CategoryKey) => t(`cat.${c}`)
  const minLabel = (p: CardPost) => t('min', { n: p.readMin })

  const all = useMemo(() => [featured, ...posts], [featured, posts])
  const matchesQuery = (p: CardPost) =>
    !q ||
    `${p.title} ${p.excerpt} ${p.category} ${catLabel(p.category)}`.toLowerCase().includes(q)
  const base = active === 'all' ? all : all.filter((p) => p.category === active)
  const results = base.filter(matchesQuery)
  const searching = q.length > 0
  const showMagazine = active === 'all' && !searching

  const reveal = (d = 0) => ({
    initial: reduce ? undefined : { opacity: 0, y: 18 },
    whileInView: reduce ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.55, ease: EASE, delay: d },
  })

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border bg-surface-2">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[30%] left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-[90px]"
          style={{ background: 'radial-gradient(circle, rgba(138,50,224,0.18), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[1120px] px-[clamp(20px,5vw,40px)] pb-[clamp(2.5rem,5vw,3.5rem)] pt-[calc(var(--navbar-height)+clamp(1.75rem,5vw,3rem))]">
          <motion.span
            {...reveal(0)}
            className="eyebrow mb-4 inline-flex items-center gap-[6px] text-purple before:size-[5px] before:rounded-full before:bg-purple before:content-['']"
          >
            {t('eyebrow')}
          </motion.span>
          <motion.h1
            {...reveal(0.06)}
            className="max-w-[18ch] font-display text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.04] tracking-[var(--tracking-display)] text-text text-balance"
          >
            {t('titlePrefix')}
            <span className="text-purple">{t('titleAccent')}</span>
            {t('titleSuffix')}
          </motion.h1>
          <motion.p
            {...reveal(0.12)}
            className="mt-5 max-w-[60ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-[1.6] text-text-muted"
          >
            {t('subtitle')}
          </motion.p>

          {/* Search */}
          <motion.div {...reveal(0.18)} className="mt-7 max-w-[460px]">
            <div
              className={cn(
                'group flex h-[52px] items-center gap-2.5 rounded-full border bg-surface pl-[18px] pr-2',
                'transition-[border-color,box-shadow] duration-200 [transition-timing-function:var(--ease-out)]',
                focused
                  ? 'border-purple-border shadow-[0_12px_36px_-16px_rgba(138,50,224,0.5)] ring-4 ring-[rgba(138,50,224,0.10)]'
                  : 'border-border shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-[rgba(138,50,224,0.4)]',
              )}
            >
              <Search
                aria-hidden
                strokeWidth={2}
                className={cn(
                  'size-[19px] shrink-0 transition-colors duration-200',
                  focused || query ? 'text-purple' : 'text-text-faint',
                )}
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
                className="h-full flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-text-faint [&::-webkit-search-cancel-button]:appearance-none"
              />
              <AnimatePresence mode="wait" initial={false}>
                {query ? (
                  <motion.button
                    key="clear"
                    type="button"
                    onClick={() => {
                      setQuery('')
                      inputRef.current?.focus()
                    }}
                    aria-label={t('clearSearch')}
                    initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.14, ease: EASE }}
                    className="grid size-8 shrink-0 place-items-center rounded-full text-text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-text active:scale-90"
                  >
                    <X className="size-[17px]" strokeWidth={2} />
                  </motion.button>
                ) : (
                  <motion.kbd
                    key="hint"
                    aria-hidden
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.14 }}
                    className="mr-1.5 hidden select-none rounded-[7px] border border-border bg-surface-2 px-2 py-[3px] font-body text-[12px] font-semibold leading-none text-text-faint sm:block"
                  >
                    /
                  </motion.kbd>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Filter chips */}
          <motion.div
            {...reveal(0.24)}
            role="group"
            aria-label={t('eyebrow')}
            className="mt-4 flex flex-wrap gap-2"
          >
            {CATS.map((c) => {
              const isActive = c === active
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActive(c)}
                  aria-pressed={isActive}
                  className={cn(
                    'cursor-pointer rounded-full border px-[15px] py-[8px] text-[13px] font-semibold',
                    'transition-[background,border-color,color,transform] duration-200 active:scale-[0.97]',
                    isActive
                      ? 'border-transparent bg-purple text-white shadow-[0_6px_18px_-8px_rgba(138,50,224,0.6)]'
                      : 'border-border bg-surface text-text-muted hover:border-purple-border hover:text-text',
                  )}
                >
                  {c === 'all' ? t('filterAll') : catLabel(c)}
                </button>
              )
            })}
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-[1120px] px-[clamp(20px,5vw,40px)] py-[clamp(2.5rem,5vw,4rem)]">
        {showMagazine ? (
          <>
            {/* Featured + picks */}
            <SectionHeading>{t('featured')}</SectionHeading>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
              <motion.div {...reveal(0)}>
                <FeaturedCard
                  post={featured}
                  catLabel={catLabel(featured.category)}
                  minLabel={minLabel(featured)}
                  readLabel={t('readStory')}
                />
              </motion.div>
              <aside className="flex flex-col gap-2.5" aria-label={t('featured')}>
                {picks.map((p, i) => (
                  <motion.div key={p.slug} {...reveal(0.06 + i * 0.06)}>
                    <PickItem post={p} catLabel={catLabel(p.category)} minLabel={minLabel(p)} />
                  </motion.div>
                ))}
              </aside>
            </div>

            {/* Latest grid */}
            <SectionHeading className="mt-[clamp(2.5rem,5vw,4rem)]">{t('latest')}</SectionHeading>
            <CardGrid posts={posts} catLabel={catLabel} minLabel={minLabel} reveal={reveal} />
          </>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="font-display text-[clamp(1.3rem,2.4vw,1.7rem)] font-extrabold tracking-[var(--tracking-tight)] text-text">
                {searching ? t('results') : active !== 'all' ? catLabel(active) : t('latest')}
              </h2>
              <div className="flex items-center gap-3 text-[13px] text-text-muted">
                <span>
                  {t('resultsCount', { count: results.length })}
                  {searching && (
                    <>
                      {' · '}
                      <span className="text-text">“{query.trim()}”</span>
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setActive('all')
                  }}
                  className="font-semibold text-purple transition-colors duration-150 hover:text-purple-hover"
                >
                  {t('clearAll')}
                </button>
              </div>
            </div>
            {results.length > 0 ? (
              <CardGrid
                posts={results}
                catLabel={catLabel}
                minLabel={minLabel}
                reveal={reveal}
                query={searching ? q : undefined}
              />
            ) : (
              <EmptyState
                title={t('noResultsTitle')}
                body={t('noResultsBody')}
                clearLabel={t('clearAll')}
                reduce={reduce}
                onClear={() => {
                  setQuery('')
                  setActive('all')
                }}
              />
            )}
          </>
        )}
      </main>
    </>
  )
}

function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        'mb-5 font-display text-[clamp(1.3rem,2.4vw,1.7rem)] font-extrabold tracking-[var(--tracking-tight)] text-text',
        className,
      )}
    >
      {children}
    </h2>
  )
}

function CardGrid({
  posts,
  catLabel,
  minLabel,
  reveal,
  query,
}: {
  posts: CardPost[]
  catLabel: (c: CategoryKey) => string
  minLabel: (p: CardPost) => string
  reveal: (d?: number) => object
  query?: string
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <motion.div key={p.slug} {...reveal((i % 3) * 0.06)}>
          <PostCard post={p} catLabel={catLabel(p.category)} minLabel={minLabel(p)} query={query} />
        </motion.div>
      ))}
    </div>
  )
}

function EmptyState({
  title,
  body,
  clearLabel,
  onClear,
  reduce,
}: {
  title: string
  body: string
  clearLabel: string
  onClear: () => void
  reduce: boolean
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="mx-auto flex max-w-[440px] flex-col items-center rounded-[20px] border border-dashed border-border bg-surface/50 px-8 py-[clamp(40px,7vw,64px)] text-center"
    >
      <span className="mb-4 grid size-14 place-items-center rounded-full bg-purple-light text-purple">
        <SearchX className="size-6" strokeWidth={1.8} />
      </span>
      <h3 className="mb-1.5 font-display text-[18px] font-bold tracking-[-0.01em] text-text">{title}</h3>
      <p className="mb-5 max-w-[34ch] text-[14px] leading-[1.55] text-text-muted">{body}</p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center rounded-full bg-purple px-5 py-2.5 text-[13.5px] font-semibold text-white transition-[background,transform] duration-200 hover:bg-purple-hover active:scale-[0.97]"
      >
        {clearLabel}
      </button>
    </motion.div>
  )
}

const Dot = () => <span className="size-[3px] rounded-full bg-text-faint" />

function FeaturedCard({
  post,
  catLabel,
  minLabel,
  readLabel,
}: {
  post: CardPost
  catLabel: string
  minLabel: string
  readLabel: string
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-surface',
        'shadow-[var(--shadow-md)] transition-[transform,border-color,box-shadow] duration-300',
        '[transition-timing-function:var(--ease-out)] hover:-translate-y-1 hover:border-purple-border',
        'hover:shadow-[0_28px_70px_-34px_rgba(138,50,224,0.5)]',
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <BlogCover
          category={post.category}
          imageUrl={post.coverUrl}
          iconScale={1.15}
          className="absolute inset-0 transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-[clamp(20px,2.6vw,28px)]">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-[10px] py-[3px] text-[11px] font-bold"
            style={{ background: 'rgba(138,50,224,0.10)', color: '#7c3aed' }}
          >
            {catLabel}
          </span>
          <Dot />
          <span className="text-[12px] font-medium text-text-muted">{post.shortDate}</span>
          <Dot />
          <span className="text-[12px] font-medium text-text-muted">{minLabel}</span>
        </div>
        <h3 className="mb-2.5 font-display text-[clamp(1.4rem,2.4vw,1.85rem)] font-extrabold leading-[1.16] tracking-[-0.02em] text-text">
          {post.title}
        </h3>
        <p className="mb-5 max-w-[52ch] text-[14.5px] leading-[1.6] text-text-muted">{post.excerpt}</p>
        <div className="mt-auto flex items-center">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-purple">
            {readLabel}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function PickItem({
  post,
  catLabel,
  minLabel,
}: {
  post: CardPost
  catLabel: string
  minLabel: string
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group flex items-center gap-4 rounded-[16px] border border-border bg-surface p-3',
        'transition-[transform,border-color,box-shadow] duration-300 [transition-timing-function:var(--ease-out)]',
        'hover:-translate-y-0.5 hover:border-purple-border hover:shadow-[0_16px_40px_-28px_rgba(138,50,224,0.5)]',
      )}
    >
      <BlogCover category={post.category} imageUrl={post.coverUrl} iconScale={1.4} className="size-[72px] flex-none rounded-[12px]" />
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-text-muted">
          <span style={{ color: '#7c3aed' }}>{catLabel}</span>
          <Dot />
          <span>{minLabel}</span>
        </div>
        <h4 className="line-clamp-2 font-display text-[14.5px] font-bold leading-[1.3] tracking-[-0.01em] text-text transition-colors group-hover:text-purple">
          {post.title}
        </h4>
      </div>
    </Link>
  )
}
