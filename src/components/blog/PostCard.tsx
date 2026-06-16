import { Fragment, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { CategoryKey } from '@/lib/blog'
import { CATEGORY_META } from './categories'
import { BlogCover } from './BlogCover'

/** Wrap occurrences of a (lowercased) query inside text with a subtle mark. */
export function highlight(text: string, q?: string): ReactNode {
  if (!q) return text
  const lower = text.toLowerCase()
  const out: ReactNode[] = []
  let i = 0
  let k = 0
  while (i < text.length) {
    const idx = lower.indexOf(q, i)
    if (idx === -1) {
      out.push(<Fragment key={k++}>{text.slice(i)}</Fragment>)
      break
    }
    if (idx > i) out.push(<Fragment key={k++}>{text.slice(i, idx)}</Fragment>)
    out.push(
      <mark key={k++} className="rounded-[3px] bg-purple-light px-0.5 text-purple">
        {text.slice(idx, idx + q.length)}
      </mark>,
    )
    i = idx + q.length
  }
  return out
}

export type CardPost = {
  slug: string
  category: CategoryKey
  title: string
  excerpt: string
  shortDate: string
  readMin: number
  coverUrl?: string | null
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-[26px] flex-none place-items-center rounded-full bg-purple-light text-[10px] font-bold text-purple ring-1 ring-purple-border',
        className,
      )}
    >
      {initials}
    </span>
  )
}

function CatPill({ category, label }: { category: CategoryKey; label: string }) {
  const { pill } = CATEGORY_META[category]
  return (
    <span
      className="inline-flex items-center rounded-full px-[9px] py-[3px] text-[11px] font-bold tracking-[0.01em]"
      style={{ background: pill.bg, color: pill.fg }}
    >
      {label}
    </span>
  )
}

const Dot = () => <span className="size-[3px] rounded-full bg-text-faint" />

/** Standard article card (grid + related). Presentational; labels passed in. */
export function PostCard({
  post,
  catLabel,
  minLabel,
  query,
}: {
  post: CardPost
  catLabel: string
  minLabel: string
  query?: string
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-[18px] border border-border bg-surface',
        'shadow-[var(--shadow-md)] transition-[transform,border-color,box-shadow] duration-300',
        '[transition-timing-function:var(--ease-out)] hover:-translate-y-1 hover:border-purple-border',
        'hover:shadow-[0_22px_60px_-32px_rgba(138,50,224,0.45)]',
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <BlogCover
          category={post.category}
          imageUrl={post.coverUrl}
          className="absolute inset-0 transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-[18px]">
        <div className="mb-2.5 flex items-center gap-2">
          <CatPill category={post.category} label={catLabel} />
          <Dot />
          <span className="text-[12px] font-medium text-text-muted">{minLabel}</span>
        </div>
        <h3 className="mb-2 line-clamp-2 font-display text-[18px] font-bold leading-[1.25] tracking-[-0.01em] text-text">
          {highlight(post.title, query)}
        </h3>
        <p className="mb-4 line-clamp-2 text-[13.5px] leading-[1.55] text-text-muted">
          {highlight(post.excerpt, query)}
        </p>
        <div className="mt-auto flex items-center gap-2 text-[12px] text-text-muted">
          <span>{post.shortDate}</span>
          <ArrowRight className="ml-auto size-4 text-text-faint transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:text-purple" />
        </div>
      </div>
    </Link>
  )
}
