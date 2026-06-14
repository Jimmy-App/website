import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'solid' | 'cta' | 'ghost' | 'secondary'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-[7px] font-body font-semibold leading-none tracking-[-0.01em] rounded-full border border-transparent whitespace-nowrap cursor-pointer transition-[background,box-shadow,border-color,transform] duration-[var(--dur-fast)] [transition-timing-function:var(--ease-out)] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

const sizes: Record<Size, string> = {
  sm: 'text-sm px-[18px] py-[9px]',
  md: 'text-sm px-[22px] py-3',
  lg: 'text-[15px] px-7 py-[14px]',
}

const variants: Record<Variant, string> = {
  solid:
    'bg-purple text-white hover:bg-purple-hover hover:shadow-[var(--glow-purple)] active:bg-purple-active',
  cta: 'bg-primary text-white hover:bg-primary-hover hover:-translate-y-px active:bg-primary-active',
  ghost:
    'bg-transparent text-text border-[var(--color-ghost-border)] hover:bg-[var(--color-ghost-hover)] hover:border-[var(--color-ghost-border-h)]',
  secondary:
    'bg-surface text-text border-border hover:bg-surface-2',
}

type CommonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  icon?: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps> & { href?: undefined }

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({
  children,
  variant = 'solid',
  size = 'md',
  icon = null,
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(base, sizes[size], variants[variant], className)

  if ('href' in rest && rest.href !== undefined) {
    return (
      <Link className={classes} {...(rest as ButtonAsLink)}>
        {children}
        {icon}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonAsButton)}>
      {children}
      {icon}
    </button>
  )
}
