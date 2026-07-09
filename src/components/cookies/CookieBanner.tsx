'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Cookie, Settings2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface Props {
  visible: boolean
  onAcceptAll: () => void
  onRejectAll: () => void
  onCustomize: () => void
}

export function CookieBanner({
  visible,
  onAcceptAll,
  onRejectAll,
  onCustomize,
}: Props) {
  const t = useTranslations('cookies')
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label={t('prefsTitle')}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            reduced
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  y: 12,
                  scale: 0.98,
                  transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
                }
          }
          transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
          className={cn(
            'fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-[392px]',
            'sm:left-5 sm:right-auto sm:bottom-5 sm:mx-0',
            'rounded-[20px] border border-border bg-surface p-[18px]',
            // Layered shadow: tight ambient contact + soft cast for lift.
            'shadow-[0_1px_2px_rgba(26,25,23,0.05),0_20px_48px_-16px_rgba(26,25,23,0.32)]',
          )}
        >
          <div className="flex items-start gap-3">
            {/* Cookie badge — squircle, soft gradient, ring, orange crumb */}
            <span
              className={cn(
                'relative flex size-9 shrink-0 items-center justify-center rounded-[11px]',
                'bg-gradient-to-b from-purple-light to-[#fcf9ff] text-purple',
                'ring-1 ring-inset ring-[rgba(138,50,224,0.16)]',
                'shadow-[0_1px_2px_rgba(138,50,224,0.12)]',
              )}
            >
              <Cookie className="size-[18px]" strokeWidth={1.9} />
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary ring-2 ring-surface" />
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="font-display text-[13.5px] font-bold leading-[1.25] tracking-[-0.01em] text-text">
                {t('bannerHeading')}
              </p>
              <p className="mt-1 text-[12.5px] leading-[1.5] text-text-muted">
                {t('bannerText')}{' '}
                <Link
                  href="/cookie-policy"
                  className="font-semibold text-purple underline decoration-[rgba(138,50,224,0.3)] underline-offset-2 transition-colors duration-150 hover:decoration-purple"
                >
                  {t('readPolicy')}
                </Link>
              </p>
            </div>

            {/* Settings — reopens the full preferences dialog */}
            <button
              type="button"
              onClick={onCustomize}
              aria-label={t('customize')}
              title={t('customize')}
              className={cn(
                'group -mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-text-faint',
                'transition-colors duration-150 hover:bg-surface-2 hover:text-text',
              )}
            >
              <Settings2
                className="size-[16px] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-90"
                strokeWidth={1.9}
              />
            </button>
          </div>

          <div className="mt-[18px] flex items-center gap-2">
            <button
              type="button"
              onClick={onRejectAll}
              className={cn(
                'flex-1 rounded-full border border-[var(--color-ghost-border)] px-4 py-[9px] text-[12.5px] font-semibold text-text',
                'transition-[background,border-color,transform] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
                'hover:bg-[var(--color-ghost-hover)] hover:border-[var(--color-ghost-border-h)] active:scale-[0.97]',
              )}
            >
              {t('rejectAll')}
            </button>
            <button
              type="button"
              onClick={onAcceptAll}
              className={cn(
                'flex-1 rounded-full bg-purple px-4 py-[9px] text-[12.5px] font-semibold text-white',
                'transition-[background,box-shadow,transform] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
                'hover:bg-purple-hover hover:shadow-[var(--glow-purple)] active:scale-[0.97]',
              )}
            >
              {t('acceptAll')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
