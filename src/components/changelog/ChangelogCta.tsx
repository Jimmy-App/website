/**
 * ChangelogCta — dark CTA band with logo, mirroring the blog/guides/feature CTA.
 * "Want something on this list?" → request a feature / see the roadmap.
 */

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type Props = {
  t: {
    titlePrefix: string
    titleAccent: string
    body: string
    primary: string
    secondary: string
  }
}

export function ChangelogCta({ t }: Props) {
  return (
    <section
      aria-label="Request a feature"
      className="border-t border-border py-[var(--section-pad-y)]"
    >
      <div className="container-content">
        <div
          className="relative overflow-hidden rounded-[28px] px-[clamp(2rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)] text-center"
          style={{ background: 'linear-gradient(165deg, #221C2E 0%, #1A1620 100%)' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-[320px] opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(138,50,224,0.5) 0%, transparent 70%)' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -left-16 size-[240px] opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(138,50,224,0.4) 0%, transparent 70%)' }}
          />

          <div className="relative mb-6 flex justify-center">
            <div className="flex items-center gap-2.5">
              <Image src="/assets/logo/logo.svg" alt="" width={36} height={36} className="rounded-[10px]" />
              <span className="font-display text-[22px] font-extrabold [letter-spacing:-0.04em] leading-none text-white">
                Jimmy
              </span>
            </div>
          </div>

          <h2 className="relative mb-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.1] [letter-spacing:-0.04em] text-white [text-wrap:balance]">
            {t.titlePrefix}
            <span className="text-purple-on-dark">{t.titleAccent}</span>
          </h2>

          <p
            className="relative mx-auto mb-8 max-w-[46ch] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-[1.65]"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            {t.body}
          </p>

          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://discord.gg/Rsqh6yZmEM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-purple px-6 py-[13px] text-[14px] font-semibold text-white shadow-[0_2px_16px_rgba(138,50,224,0.4)] transition-[background,box-shadow,transform] duration-[var(--dur-fast)] hover:bg-purple-hover hover:shadow-[0_4px_24px_rgba(138,50,224,0.55)] hover:-translate-y-px"
            >
              {t.primary}
              <ArrowRight size={15} strokeWidth={2} />
            </a>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-[13px] text-[14px] font-semibold text-white transition-[background,border-color] duration-[var(--dur-fast)] hover:bg-white/[0.06]"
              style={{ borderColor: 'rgba(255,255,255,0.22)' }}
            >
              {t.secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
