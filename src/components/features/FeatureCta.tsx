/**
 * FeatureCta — Dark CTA band with logo on top.
 *
 * Mirrors the GuidesLanding / blog CTA pattern exactly:
 * dark gradient background (165deg, #221C2E → #1A1620) + logo Image
 * + title with purple accent + body + primary "Start for free" + ghost "Book a demo".
 */

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type Props = {
  t: {
    ctaEyebrow: string
    ctaTitlePrefix: string
    ctaTitleAccent: string
    ctaTitleSuffix: string
    ctaBody: string
    startFree: string
    bookDemo: string
  }
}

export function FeatureCta({ t }: Props) {
  return (
    <section
      aria-label="Get started with Jimmy"
      className="border-t border-border py-[var(--section-pad-y)]"
    >
      <div className="container-content">
        <div
          className="relative overflow-hidden rounded-[28px] px-[clamp(2rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)] text-center"
          style={{ background: 'linear-gradient(165deg, #221C2E 0%, #1A1620 100%)' }}
        >
          {/* Purple glow orb — top right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-[320px] opacity-60"
            style={{
              background:
                'radial-gradient(circle, rgba(138,50,224,0.5) 0%, transparent 70%)',
            }}
          />
          {/* Purple glow orb — bottom left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -left-16 size-[240px] opacity-40"
            style={{
              background:
                'radial-gradient(circle, rgba(138,50,224,0.4) 0%, transparent 70%)',
            }}
          />

          {/* Logo */}
          <div className="relative mb-6 flex justify-center">
            <div className="flex items-center gap-2.5">
              <Image
                src="/assets/logo/logo.svg"
                alt=""
                width={36}
                height={36}
                className="rounded-[10px]"
              />
              <span className="font-display text-[22px] font-extrabold [letter-spacing:-0.04em] leading-none text-white">
                Jimmy
              </span>
            </div>
          </div>

          {/* Eyebrow */}
          <p className="relative mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-purple-on-dark">
            {t.ctaEyebrow}
          </p>

          {/* Title */}
          <h2 className="relative mb-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.1] [letter-spacing:-0.04em] text-white [text-wrap:balance]">
            {t.ctaTitlePrefix}
            <span className="text-purple-on-dark">{t.ctaTitleAccent}</span>
            {t.ctaTitleSuffix}
          </h2>

          {/* Body */}
          <p
            className="relative mx-auto mb-8 max-w-[44ch] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-[1.65]"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            {t.ctaBody}
          </p>

          {/* CTAs */}
          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full bg-purple px-6 py-[13px] text-[14px] font-semibold text-white shadow-[0_2px_16px_rgba(138,50,224,0.4)] transition-[background,box-shadow,transform] duration-[var(--dur-fast)] hover:bg-purple-hover hover:shadow-[0_4px_24px_rgba(138,50,224,0.55)] hover:-translate-y-px"
            >
              {t.startFree}
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-[13px] text-[14px] font-semibold text-white transition-[background,border-color] duration-[var(--dur-fast)] hover:bg-white/[0.06]"
              style={{ borderColor: 'rgba(255,255,255,0.22)' }}
            >
              {t.bookDemo}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
