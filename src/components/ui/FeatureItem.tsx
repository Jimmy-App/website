import NextLink from 'next/link'
import type { ReactNode } from 'react'
import { Link as IntlLink } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

/**
 * Mega-menu / list row: square icon tile + title + one-line subtitle.
 * Hovering tints the icon tile purple (pure CSS via `group`).
 * The subtitle never wraps — keep it to ~5 words.
 *
 * Internal app routes (href starting with "/") are routed through the
 * locale-aware Link so the current language prefix is preserved; everything
 * else (hash placeholders, external URLs) uses a plain link.
 */
export function FeatureItem({
  icon = null,
  title,
  subtitle,
  href = '#',
  className,
  badge,
  disabled = false,
}: {
  icon?: ReactNode
  title: ReactNode
  subtitle: ReactNode
  href?: string
  className?: string
  /** Small pill after the title, e.g. "Soon". */
  badge?: string
  /** Render as a non-navigable, dimmed row (no link). */
  disabled?: boolean
}) {
  const cls = cn(
    'group grid grid-cols-[34px_1fr] items-center gap-x-[11px] rounded-lg px-[10px] py-[9px] transition-[background-color,transform] duration-150 [transition-timing-function:var(--ease-out)]',
    disabled
      ? 'cursor-default opacity-60'
      : 'hover:bg-surface-2 active:scale-[0.985]',
    className,
  )
  const inner = (
    <>
      <span
        className={cn(
          'row-span-2 flex size-[34px] items-center justify-center rounded-[9px] border border-border bg-surface-2 text-text-muted transition-colors duration-150',
          !disabled &&
            'group-hover:border-purple-border group-hover:bg-purple-light group-hover:text-purple',
        )}
      >
        {icon}
      </span>
      <span className="flex items-center gap-[6px] font-body text-[13.5px] font-semibold leading-snug tracking-[-0.01em] whitespace-nowrap text-text">
        {title}
        {badge && (
          <span className="rounded-full border border-border bg-surface-offset px-[6px] py-[2px] text-[9px] font-bold uppercase leading-none tracking-[0.07em] text-text-faint">
            {badge}
          </span>
        )}
      </span>
      <span className="mt-px font-body text-[11.5px] font-normal leading-[1.3] whitespace-nowrap text-text-faint">
        {subtitle}
      </span>
    </>
  )

  if (disabled) {
    return (
      <div className={cls} aria-disabled="true">
        {inner}
      </div>
    )
  }
  if (href.startsWith('/')) {
    return (
      <IntlLink href={href} className={cls}>
        {inner}
      </IntlLink>
    )
  }
  const external = href.startsWith('http')
  return (
    <NextLink
      href={href}
      className={cls}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </NextLink>
  )
}
