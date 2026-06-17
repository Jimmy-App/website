/**
 * RecentlyShipped — strip of the latest changelog releases, linking to /changelog.
 * Data comes from the Sanity changelog (kept DRY, always current).
 */

import { ArrowRight, Check } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export type ShippedItem = {
  version: string
  title: string
  /** e.g. "Jun 2026" */
  when: string
}

type Props = {
  items: ShippedItem[]
  t: { title: string; all: string }
}

export function RecentlyShipped({ items, t }: Props) {
  if (items.length === 0) return null

  return (
    <section
      aria-label="Recently shipped"
      className="border-t border-border py-[clamp(2.5rem,5vw,4rem)]"
    >
      <div className="container-content">
        <div className="mb-6 flex items-center gap-4">
          <h2 className="font-display text-[clamp(1.25rem,2.4vw,1.6rem)] font-extrabold [letter-spacing:-0.03em] text-text">
            {t.title}
          </h2>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
          <Link
            href="/changelog"
            className="inline-flex flex-none items-center gap-1.5 text-[13px] font-semibold text-purple transition-colors hover:text-purple-hover"
          >
            {t.all}
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <Link
              key={it.version}
              href="/changelog"
              className="group flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition-[box-shadow,transform,border-color] duration-[var(--dur-fast)] hover:-translate-y-0.5 hover:border-purple-border hover:shadow-[var(--shadow-md)]"
            >
              <span className="grid size-7 flex-none place-items-center rounded-full bg-[#E6F4EC] text-[#15885A]">
                <Check size={15} strokeWidth={2.6} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[14px] font-bold leading-[1.25] [letter-spacing:-0.01em] text-text">
                  {it.title}
                </span>
                <span className="mt-1 block font-mono text-[11.5px] text-text-faint">
                  {it.version} · {it.when}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
