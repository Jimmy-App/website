'use client'

import { useEffect, useState } from 'react'
import { m as motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ShieldCheck, BarChart3, Megaphone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { ConsentCategories } from '@/lib/cookieConsent'

interface Props {
  open: boolean
  initial: ConsentCategories | null
  onClose: () => void
  onSave: (c: ConsentCategories) => void
  onAcceptAll: () => void
  onRejectAll: () => void
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean
  disabled?: boolean
  onChange?: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-200',
        checked ? 'bg-purple' : 'bg-surface-offset',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        className={cn(
          'size-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  )
}

// ─── Category row ─────────────────────────────────────────────────────────────
function Category({
  icon,
  title,
  desc,
  checked,
  disabled,
  badge,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  checked: boolean
  disabled?: boolean
  badge?: string
  onChange?: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface-2/50 p-4">
      <div className="flex gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface text-purple">
          {icon}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-[14px] font-bold text-text">{title}</h4>
            {badge && (
              <span className="rounded-full bg-purple-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-purple">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-[12.5px] leading-[1.5] text-text-muted">
            {desc}
          </p>
        </div>
      </div>
      <Toggle
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        label={title}
      />
    </div>
  )
}

export function CookiePreferences({
  open,
  initial,
  onClose,
  onSave,
  onAcceptAll,
  onRejectAll,
}: Props) {
  const t = useTranslations('cookies')
  const reduced = useReducedMotion()
  const [analytics, setAnalytics] = useState(initial?.analytics ?? false)
  const [marketing, setMarketing] = useState(initial?.marketing ?? false)

  // Sync local toggles whenever the dialog (re)opens.
  useEffect(() => {
    if (open) {
      setAnalytics(initial?.analytics ?? false)
      setMarketing(initial?.marketing ?? false)
    }
  }, [open, initial])

  // Close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label={t('close')}
            onClick={onClose}
            className="absolute inset-0 bg-[rgba(26,25,23,0.5)] backdrop-blur-[2px]"
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('prefsTitle')}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-border bg-surface',
              'shadow-[0_24px_70px_-16px_rgba(26,25,23,0.4)]',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-divider px-6 py-4">
              <h3 className="font-display text-[1.15rem] font-extrabold tracking-[-0.02em] text-text">
                {t('prefsTitle')}
              </h3>
              <button
                type="button"
                aria-label={t('close')}
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-full text-text-faint transition-colors hover:bg-surface-2 hover:text-text"
              >
                <X className="size-[18px]" strokeWidth={2} />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              <p className="mb-4 text-[13px] leading-[1.55] text-text-muted">
                {t('prefsIntro')}
              </p>
              <div className="flex flex-col gap-2.5">
                <Category
                  icon={<ShieldCheck className="size-[17px]" strokeWidth={1.9} />}
                  title={t('necessaryTitle')}
                  desc={t('necessaryDesc')}
                  checked
                  disabled
                  badge={t('alwaysOn')}
                />
                <Category
                  icon={<BarChart3 className="size-[17px]" strokeWidth={1.9} />}
                  title={t('analyticsTitle')}
                  desc={t('analyticsDesc')}
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <Category
                  icon={<Megaphone className="size-[17px]" strokeWidth={1.9} />}
                  title={t('marketingTitle')}
                  desc={t('marketingDesc')}
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-2 border-t border-divider px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onRejectAll}
                className="rounded-full px-4 py-2.5 text-[13px] font-semibold text-text-muted transition-colors hover:text-text"
              >
                {t('rejectAll')}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSave({ analytics, marketing })}
                  className={cn(
                    'flex-1 rounded-full border border-[var(--color-ghost-border)] px-4 py-2.5 text-[13px] font-semibold text-text sm:flex-none',
                    'transition-colors duration-150 hover:bg-[var(--color-ghost-hover)]',
                  )}
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={onAcceptAll}
                  className={cn(
                    'flex-1 rounded-full bg-purple px-5 py-2.5 text-[13px] font-semibold text-white sm:flex-none',
                    'transition-[background,box-shadow] duration-150 hover:bg-purple-hover hover:shadow-[var(--glow-purple)]',
                  )}
                >
                  {t('acceptAll')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
