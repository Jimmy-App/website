import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'outline' | 'muted' | 'accent'

const variants: Record<Variant, string> = {
  outline: 'bg-surface border-border text-text-muted shadow-[var(--shadow-xs)]',
  muted: 'bg-surface-2 border-border text-text-muted',
  accent: 'bg-purple-light border-purple-border text-purple',
}

export function Chip({
  children,
  icon = null,
  variant = 'outline',
  className,
  ...rest
}: {
  children: ReactNode
  icon?: ReactNode
  variant?: Variant
  className?: string
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[6px] font-body text-[13px] font-medium leading-none whitespace-nowrap rounded-full border px-[14px] py-[7px]',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </span>
  )
}
