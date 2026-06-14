import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'purple' | 'neutral'

const variants: Record<Variant, string> = {
  purple: 'text-purple bg-purple-light border-purple-border',
  neutral: 'text-text-muted bg-surface-offset border-border',
}

export function Badge({
  children,
  variant = 'purple',
  className,
  ...rest
}: {
  children: ReactNode
  variant?: Variant
  className?: string
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>) {
  return (
    <span
      className={cn(
        'inline-block font-body text-[9px] font-bold uppercase leading-none tracking-[0.07em] align-middle rounded-full border px-[6px] py-[2px]',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
