'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { GuideCategoryKey, Guide } from '@/lib/guides'
import { GUIDE_CATEGORY_META } from '@/components/guides/categories'

type SidebarGroup = {
  key: GuideCategoryKey
  guides: Guide[]
}

type Props = {
  groups: SidebarGroup[]
  searchPlaceholder: string
  browseLabel: string
  noResults: string
}

export function GuidesSidebar({ groups, searchPlaceholder, browseLabel, noResults }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)

  // "/" key focuses search
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (document.activeElement as HTMLElement | null)?.tagName?.toLowerCase()
      if (e.key === '/' && tag !== 'input' && tag !== 'textarea') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const q = query.trim().toLowerCase()

  const filtered = groups
    .map((group) => ({
      ...group,
      guides: q
        ? group.guides.filter((g) => (g.title ?? '').toLowerCase().includes(q))
        : group.guides,
    }))
    .filter((group) => group.guides.length > 0)

  const hasResults = filtered.length > 0

  return (
    <aside
      className="max-lg:mb-6"
      aria-label="Documentation navigation"
    >
      {/* Mobile toggle */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-[14px] font-semibold text-text lg:hidden"
      >
        <span>{browseLabel}</span>
        <ChevronDown
          className={cn(
            'size-4 text-text-faint transition-transform duration-[260ms] [transition-timing-function:var(--ease-out)]',
            open && 'rotate-180 text-purple',
          )}
        />
      </button>

      {/* Sidebar content */}
      <div
        className={cn(
          'mt-3 rounded-xl border border-border bg-surface lg:mt-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:block',
          open ? 'block' : 'hidden',
        )}
      >
        {/* Search */}
        <div className="relative flex items-center px-3 py-2.5 lg:px-0">
          <Search className="pointer-events-none absolute left-6 size-[15px] text-text-faint lg:left-3" strokeWidth={1.75} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            autoComplete="off"
            className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-8 pr-10 text-[13px] text-text placeholder:text-text-faint focus:border-purple-border focus:outline-none focus:ring-2 focus:ring-purple/20"
          />
          <kbd className="pointer-events-none absolute right-6 hidden select-none rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-faint sm:block lg:right-3">
            /
          </kbd>
        </div>

        {/* Groups */}
        <nav className="mt-2 space-y-4 pb-4 lg:mt-3" aria-label="Guide categories">
          {hasResults ? (
            filtered.map((group) => {
              const meta = GUIDE_CATEGORY_META[group.key]
              const Icon = meta.Icon
              return (
                <div key={group.key} className="px-3 lg:px-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className="flex size-[22px] shrink-0 items-center justify-center rounded-md"
                      style={{ background: meta.accent }}
                    >
                      <Icon className="size-[12px]" style={{ color: meta.accentFg }} strokeWidth={2} />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-text-faint">
                      {meta.label}
                    </span>
                  </div>
                  <ul className="space-y-0.5">
                    {group.guides.map((guide) => {
                      const href = `/guides/${guide.slug}`
                      const isActive = guide.slug ? pathname?.includes(guide.slug) : false
                      return (
                        <li key={guide.slug}>
                          <Link
                            href={href}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                              'block rounded-md py-[5px] pl-[30px] pr-2 text-[13.5px] leading-[1.4] transition-colors duration-150',
                              isActive
                                ? 'bg-purple-light font-semibold text-purple'
                                : 'text-text-muted hover:bg-surface-2 hover:text-text',
                            )}
                            style={
                              isActive
                                ? {
                                    boxShadow: 'inset 2px 0 0 var(--color-purple)',
                                  }
                                : {}
                            }
                            onClick={() => setOpen(false)}
                          >
                            {guide.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })
          ) : (
            <p className="px-3 py-2 text-[13px] text-text-faint lg:px-0">{noResults}</p>
          )}
        </nav>
      </div>
    </aside>
  )
}
