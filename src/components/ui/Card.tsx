import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Elevation = 'sm' | 'md' | 'lg'
type Tone = 'light' | 'dark'

const shadows: Record<Elevation, string> = {
  sm: 'shadow-[var(--shadow-sm)]',
  md: 'shadow-[var(--shadow-md)]',
  lg: 'shadow-[var(--shadow-lg)]',
}

const tones: Record<Tone, string> = {
  light: 'bg-surface border-border text-text',
  dark: 'bg-[image:var(--gradient-dark-cta)] border-white/[0.06] text-on-dark shadow-[var(--shadow-dark)]',
}

export function Card({
  children,
  elevation = 'md',
  tone = 'light',
  className,
  ...rest
}: {
  children: ReactNode
  elevation?: Elevation
  tone?: Tone
  className?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-6',
        tone === 'light' && shadows[elevation],
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
