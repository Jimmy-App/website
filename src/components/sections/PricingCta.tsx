import Image from 'next/image'
import { Check, CalendarDays, Users, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { appRegisterUrl } from '@/lib/appUrl'
import { Button } from '@/components/ui/Button'
import type { FinalCtaContent } from '@/lib/content'

// Trust items map by index to these icons (No card / 30 days free / 3 clients).
const TRUST_ICONS = [Check, CalendarDays, Users]

/**
 * Centered dark CTA card ported from the Pricing.html design (mascot, headline,
 * two CTAs, icon trust row). Distinct from the home <FinalCta> (two-column).
 * Content comes from pricingPage.finalCta.
 */
export function PricingCta({ data }: { data: FinalCtaContent }) {
  const tags = data.tags ?? []

  return (
    <section className="px-[clamp(1rem,4vw,2.5rem)] pb-[clamp(4.5rem,9vw,7rem)]">
      <div
        className="relative mx-auto max-w-[1080px] overflow-hidden rounded-[26px] px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.75rem,6vw,4.5rem)] text-center"
        style={{ background: 'linear-gradient(180deg, #1B1430 0%, #110B1E 100%)' }}
      >
        {/* Purple glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-38%] h-[620px] w-[620px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(closest-side, rgba(138,50,224,0.42), transparent 70%)',
          }}
        />

        <div className="relative">
          {/* Mascot */}
          <div className="mx-auto mb-[22px] w-[76px]">
            <Image
              src="/assets/logo/logo.svg"
              alt=""
              width={76}
              height={76}
              aria-hidden
              className="h-[76px] w-[76px] rounded-[20%] shadow-[0_0_60px_rgba(138,50,224,0.55)]"
            />
          </div>

          {/* Headline */}
          <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-white text-balance">
            {data.headlinePrefix}
            {data.headlineAccent}
            {data.headlineSuffix}
            {data.headlineLine2 ? (
              <>
                {' '}
                <span className="block">{data.headlineLine2}</span>
              </>
            ) : null}
          </h2>

          {/* Subtitle */}
          {data.subtitle && (
            <p className="mx-auto mt-[18px] max-w-[46ch] text-lead leading-[var(--leading-relaxed)] text-white/65">
              {data.subtitle}
            </p>
          )}

          {/* CTAs — primary reuses the shared <Button>; secondary is a dark
              translucent button with the same press effect. */}
          <div className="mt-[clamp(1.6rem,3vw,2rem)] flex flex-wrap items-center justify-center gap-3">
            <Button
              href={appRegisterUrl}
              variant="solid"
              size="lg"
              className="px-[30px] py-[15px]"
              icon={<ArrowRight className="size-4" strokeWidth={2} />}
            >
              {data.ctaPrimary}
            </Button>
            <a
              href="#"
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/[0.08] px-[28px] py-[15px] text-[15px] font-medium text-white',
                'transition-[background,transform] duration-200 hover:bg-white/[0.14] active:scale-[0.97]',
              )}
            >
              {data.ctaSecondary}
            </a>
          </div>

          {/* Trust row */}
          {tags.length > 0 && (
            <div className="mt-[28px] flex flex-wrap items-center justify-center gap-x-[22px] gap-y-3 text-[13px] text-white/45">
              {tags.map((tag, i) => {
                const Icon = TRUST_ICONS[i] ?? Check
                return (
                  <span key={i} className="inline-flex items-center gap-[7px]">
                    <Icon className="size-[14px] text-[#B985F5]" strokeWidth={2} />
                    {tag}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
