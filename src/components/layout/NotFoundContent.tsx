import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { NotFoundData } from '@/lib/content'

const FALLBACK: NotFoundData = {
  eyebrow: 'Error 404',
  title: 'This page took a rest day.',
  lead: "The link you followed doesn't exist — or it's still warming up. Either way, let's get you back on the program.",
  ctaPrimary: 'Back to home',
  ctaSecondary: 'Explore features',
}

/**
 * Ported 404 stage (digits "4 — mascot — 4", headline, CTAs) on a purple glow
 * + grid backdrop. Rendered between the shared Navbar and Footer.
 */
export function NotFoundContent({
  data,
  locale,
}: {
  data: NotFoundData | null
  locale: string
}) {
  const t = { ...FALLBACK, ...(data ?? {}) }
  const home = `/${locale}`

  return (
    <main className="relative isolate flex min-h-[78dvh] flex-col items-center justify-center overflow-hidden px-6 py-[clamp(2rem,5vw,5.5rem)] text-center">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-28vh] -z-10 h-[min(1100px,120vw)] w-[min(1100px,120vw)] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(closest-side, rgba(138,50,224,0.16) 0%, rgba(138,50,224,0.07) 38%, rgba(138,50,224,0) 72%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(26,25,23,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,25,23,0.035) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 42%, #000 35%, transparent 80%)',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 42%, #000 35%, transparent 80%)',
        }}
      />

      {/* Eyebrow */}
      <span className="inline-flex items-center gap-[9px] rounded-full border border-purple-border bg-purple-light px-[14px] py-[7px] text-[11px] font-bold uppercase tracking-[0.18em] text-purple">
        <span className="h-[6px] w-[6px] rounded-full bg-purple shadow-[0_0_0_3px_rgba(138,50,224,0.18)]" />
        {t.eyebrow}
      </span>

      {/* 4 — mascot — 4 lockup */}
      <div
        aria-hidden
        className="my-[clamp(1.1rem,2.8vw,2rem)] flex items-center justify-center gap-[clamp(4px,1.4vw,16px)] leading-[0.8]"
      >
        <span className="nf-digit">4</span>
        <span className="nf-mascot relative aspect-square w-[clamp(6rem,19vw,13.5rem)] flex-none">
          <Image
            src="/assets/logo/logo.svg"
            alt=""
            width={216}
            height={216}
            priority
            className="relative z-10 block h-full w-full rounded-[22.5%] shadow-[0_0_60px_rgba(138,50,224,0.45),0_18px_50px_-12px_rgba(0,0,0,0.25)]"
          />
        </span>
        <span className="nf-digit">4</span>
      </div>

      <h1 className="font-display text-display font-extrabold leading-[1.02] tracking-[var(--tracking-display)] text-text text-balance">
        {t.title}
      </h1>
      <p className="mx-auto mt-[18px] max-w-[46ch] text-lead leading-[var(--leading-relaxed)] text-text-muted text-pretty">
        {t.lead}
      </p>

      {/* CTAs */}
      <div className="mt-[clamp(1.6rem,3.4vw,2.5rem)] flex flex-wrap items-center justify-center gap-3">
        <a
          href={home}
          className={cn(
            'inline-flex items-center gap-2 rounded-full bg-purple px-[28px] py-[14px] text-[15px] font-semibold text-white',
            'transition-[background,box-shadow,transform] duration-200 hover:bg-purple-hover hover:-translate-y-[1px] hover:shadow-[0_0_28px_rgba(138,50,224,0.32)]',
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          {t.ctaPrimary}
        </a>
        <a
          href={`${home}#features`}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-ghost-border bg-surface px-[28px] py-[14px] text-[15px] font-medium text-text',
            'transition-[background,border-color] duration-200 hover:bg-ghost-hover hover:border-ghost-border-h',
          )}
        >
          {t.ctaSecondary}
        </a>
      </div>

      {/* Mascot float (scoped, reduced-motion safe) */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .nf-mascot { animation: nfFloat 5.5s ease-in-out 1s infinite; }
          @keyframes nfFloat {
            0%, 100% { transform: translateY(0) rotate(-1.5deg); }
            50%      { transform: translateY(-12px) rotate(1.5deg); }
          }
        }
        .nf-digit {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(6rem, 20vw, 14.5rem);
          letter-spacing: -0.04em;
          line-height: 1;
          background: linear-gradient(176deg, #2A2622 0%, #14110F 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </main>
  )
}
