'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/** "The Locker Room" newsletter block. Visual-only for now (no backend). */
export function BlogNewsletter() {
  const t = useTranslations('blog.newsletter')
  const [done, setDone] = useState(false)

  return (
    <section className="px-[clamp(20px,5vw,40px)] pb-[clamp(3rem,6vw,5rem)]">
      <div className="blog-reveal relative mx-auto max-w-[760px] overflow-hidden rounded-[24px] border border-purple-border bg-surface px-[clamp(24px,4vw,48px)] py-[clamp(28px,4vw,44px)] text-center shadow-[var(--shadow-md)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[40%] left-1/2 h-[300px] w-[560px] -translate-x-1/2 rounded-full opacity-70 blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(138,50,224,0.16), transparent 70%)' }}
        />
        <div className="relative">
          <span className="eyebrow text-purple">{t('eyebrow')}</span>
          <h2 className="mx-auto mt-3 max-w-[20ch] font-display text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold leading-[1.12] tracking-[var(--tracking-tight)] text-text text-balance">
            {t('title')}
          </h2>
          <p className="mx-auto mt-3 max-w-[46ch] text-[14.5px] leading-[1.6] text-text-muted">
            {t('body')}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setDone(true)
            }}
            className="mx-auto mt-6 flex max-w-[440px] flex-col gap-2.5 sm:flex-row"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              {t('placeholder')}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              disabled={done}
              placeholder={t('placeholder')}
              className={cn(
                'h-[46px] w-full rounded-full border border-border bg-surface-2 px-5 text-[14px] text-text sm:flex-1',
                'outline-none transition-colors placeholder:text-text-faint',
                'focus:border-purple-border focus:ring-2 focus:ring-[rgba(138,50,224,0.18)]',
              )}
            />
            <button
              type="submit"
              disabled={done}
              className={cn(
                'inline-flex h-[46px] items-center justify-center gap-1.5 rounded-full px-6 text-[14px] font-semibold text-white',
                'transition-[background,transform] duration-200 active:scale-[0.97]',
                done ? 'bg-[#16a34a]' : 'bg-purple hover:bg-purple-hover',
              )}
            >
              {done && <Check className="size-4" strokeWidth={2.5} />}
              {done ? t('subscribed') : t('button')}
            </button>
          </form>

          <p className="mt-3.5 text-[12px] text-text-faint">{t('fine')}</p>
        </div>
      </div>
    </section>
  )
}
