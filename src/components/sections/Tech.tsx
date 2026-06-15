'use client'

import { useReducedMotion, motion } from 'framer-motion'
import Image from 'next/image'
import { Lock, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TechData } from '@/lib/content'

// ─── Animation helpers ────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface RevealProps {
  initial: { opacity?: number; y?: number }
  animate: { opacity?: number; y?: number }
  transition: { duration?: number; ease?: [number, number, number, number]; delay?: number }
}

function useReveal(delayMs: number): RevealProps {
  const reduced = useReducedMotion()
  if (reduced) {
    return { initial: {}, animate: {}, transition: {} }
  }
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.64, ease: EASE, delay: delayMs / 1000 },
  }
}

// ─── Apple logo SVG ───────────────────────────────────────────────────────────
function AppleLogo() {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.07 13.77c-.03-3.14 2.56-4.66 2.68-4.74-1.46-2.13-3.73-2.43-4.54-2.46-1.93-.2-3.77 1.14-4.75 1.14-.98 0-2.49-1.11-4.09-1.08-2.1.03-4.04 1.22-5.12 3.08-2.18 3.78-.56 9.38 1.56 12.45 1.04 1.5 2.27 3.18 3.89 3.12 1.57-.06 2.16-1.01 4.06-1.01 1.89 0 2.43 1.01 4.09.98 1.68-.03 2.74-1.52 3.77-3.03 1.19-1.73 1.68-3.41 1.71-3.5-.04-.02-3.23-1.24-3.26-4.95zM14.86 4.48C15.73 3.43 16.32 2 15.97.5c-1.3.05-2.86.87-3.79 1.9-.83.92-1.56 2.39-1.29 3.8 1.45.11 2.93-.73 3.97-1.72z" />
    </svg>
  )
}

// ─── Google Play logo SVG ─────────────────────────────────────────────────────
function PlayLogo() {
  return (
    <svg
      width="22"
      height="24"
      viewBox="0 0 22 24"
      aria-hidden="true"
    >
      <path
        d="M1.22.42C.9.77.72 1.3.72 2v20c0 .7.18 1.23.5 1.58l.08.08 11.2-11.2v-.26L1.3.34l-.08.08z"
        fill="#4FC3F7"
      />
      <path
        d="M16.24 17.22l-3.74-3.74v-.27l3.74-3.74.08.05 4.43 2.52c1.26.72 1.26 1.89 0 2.61l-4.43 2.52-.08.05z"
        fill="#FFCA28"
      />
      <path
        d="M16.32 17.17L12.5 13.34 1.22 24.62c.42.44 1.1.5 1.87.06l13.23-7.51z"
        fill="#F06292"
      />
      <path
        d="M16.32 9.83L3.09.32C2.32-.12 1.64-.06 1.22.38L12.5 11.66l3.82-3.83z"
        fill="#66BB6A"
      />
    </svg>
  )
}

// ─── Feature tile (panel variant) ────────────────────────────────────────────
type TileItem = {
  icon: React.ReactNode
  title: string
  desc: string
}

function PanelTile({ icon, title, desc }: TileItem) {
  return (
    <div
      className={cn(
        'flex items-start',
        'rounded-[14px]',
        'border border-[rgba(255,255,255,0.18)]',
        'border-l-2 border-l-white',
        'bg-[rgba(255,255,255,0.1)]',
        'px-[0.85rem] py-[0.7rem]',
        'transition-[box-shadow,transform] duration-200',
        'hover:shadow-[0_4px_20px_rgba(0,0,0,0.14)]',
      )}
      style={{ gap: '11px' }}
    >
      <div
        className={cn(
          'mt-[1px] flex shrink-0 items-center justify-center',
          'rounded-[9px]',
        )}
        style={{
          width: '32px',
          height: '32px',
          background: 'rgba(255,255,255,0.2)',
          color: '#fff',
        }}
      >
        <span className="flex h-[15px] w-[15px] items-center justify-center [&>svg]:h-[15px] [&>svg]:w-[15px]">
          {icon}
        </span>
      </div>
      <div className="min-w-0">
        <p
          className="font-bold leading-[1.3]"
          style={{ color: '#fff', fontSize: '13.5px', marginBottom: '0.1rem' }}
        >
          {title}
        </p>
        <p
          className="leading-[1.45]"
          style={{ color: 'rgba(255,255,255,0.72)', fontSize: '11.5px' }}
        >
          {desc}
        </p>
      </div>
    </div>
  )
}

// ─── Store badge (panel: white background, dark text) ─────────────────────────
function StoreBadge({
  href,
  label,
  sub,
  main,
  logo,
}: {
  href: string
  label: string
  sub: string
  main: string
  logo: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-[11px]',
        'rounded-[14px]',
        'no-underline',
        'shadow-[0_2px_14px_rgba(26,25,23,0.18)]',
        'transition-[opacity,transform,box-shadow] duration-[160ms]',
        'hover:opacity-[0.88] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(26,25,23,0.28)]',
        'max-[600px]:flex-1 max-[600px]:justify-center',
      )}
      style={{
        background: '#fff',
        color: 'var(--color-text)',
        padding: '9px 16px',
      }}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        {logo}
      </span>
      <span className="flex flex-col">
        <span
          className="mb-[2px] text-[9px] font-medium leading-none tracking-[0.04em] opacity-70"
        >
          {sub}
        </span>
        <span className="font-display text-[15px] font-bold leading-none tracking-[-0.02em]">
          {main}
        </span>
      </span>
    </a>
  )
}

// ─── Tech section — PANEL variant ─────────────────────────────────────────────
export function Tech({ data }: { data: TechData }) {
  const revealHead = useReveal(0)
  const revealTiles = useReveal(90)
  const revealBadges = useReveal(200)
  const revealVisual = useReveal(130)

  // Tiles 2 and 3 are rendered; tile 1 is hidden per panel spec
  const visibleTiles: TileItem[] = [
    {
      icon: <Lock size={15} strokeWidth={1.75} />,
      title: data.tile2Title ?? '',
      desc: data.tile2Desc ?? '',
    },
    {
      icon: <Users size={15} strokeWidth={1.75} />,
      title: data.tile3Title ?? '',
      desc: data.tile3Desc ?? '',
    },
  ]

  return (
    <section
      id="tech-section"
      aria-label={data.sectionLabel ?? ''}
      className={cn(
        'relative border-t border-border bg-bg',
        // generous vertical padding, no radial glow
        'py-[clamp(5rem,9vw,8rem)]',
      )}
    >
      {/*
        Panel: the inner container IS the purple gradient card.
        max-width matches base .tech-inner (1160px), centered.
        overflow:hidden so the phone image is clipped at the panel bottom.
      */}
      <div
        className={cn(
          'relative z-[1] mx-auto overflow-hidden rounded-[32px]',
          // horizontal padding matches the section's container
          'px-[clamp(1rem,4vw,2.5rem)]',
        )}
        style={{
          maxWidth: '1160px',
          // --panel-pad drives the inner padding AND the phone bottom offset
          // We set it as an inline custom property so the visual child can reference it
          // via calc(). Tailwind can't express this cleanly with a clamp CSS var.
          ['--panel-pad' as string]: 'clamp(1.75rem, 3.5vw, 2.75rem)',
          background:
            'linear-gradient(135deg, #5B21B6 0%, var(--color-purple, #7C3AED) 52%, #A855F7 100%)',
          padding: 'var(--panel-pad)',
          boxShadow: '0 24px 70px rgba(91,33,182,0.28)',
        }}
      >
        {/*
          Grid: two columns 1.08fr / 0.92fr
          areas: head/visual, tiles/visual, badges/visual
          Below 900px collapses to single column.
        */}
        <div
          className={cn(
            'grid items-center',
            // Two-column desktop layout
            'grid-cols-[1.08fr_0.92fr]',
            '[grid-template-areas:"head_visual""tiles_visual""badges_visual"]',
            // Responsive: collapse to single column
            'max-[900px]:grid-cols-1',
            'max-[900px]:[grid-template-areas:"head""visual""tiles""badges"]',
          )}
          style={{
            gap: '0.95rem clamp(1.5rem, 3vw, 3rem)',
          }}
        >
          {/* ── Head ─────────────────────────────────────────────────── */}
          <motion.div
            {...revealHead}
            style={{ gridArea: 'head' }}
          >
            {/* Label */}
            <span
              className="mb-[0.6rem] block text-[11px] font-bold uppercase tracking-[0.12em]"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {data.eyebrow}
            </span>

            {/* Title */}
            <h2
              className={cn(
                'font-display font-extrabold leading-[1.05]',
                'tracking-[var(--tracking-display)] text-balance',
                'mb-[0.7rem]',
              )}
              style={{
                color: '#fff',
                fontSize: 'clamp(1.85rem, 3.4vw, 2.8rem)',
              }}
            >
              {data.headlineLead}<em
                className="not-italic"
                style={{
                  color: '#fff',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(255,255,255,0.45)',
                  textUnderlineOffset: '5px',
                }}
              >
                {data.headlineAccent}
              </em>
            </h2>

            {/* Body */}
            <p
              className="max-w-[480px] leading-[1.7]"
              style={{ color: 'rgba(255,255,255,0.82)', fontSize: '14px' }}
            >
              {data.body}
            </p>
          </motion.div>

          {/* ── Tiles (2nd and 3rd only; 1st hidden per panel spec) ─── */}
          <motion.div
            {...revealTiles}
            style={{ gridArea: 'tiles' }}
            className="flex flex-col"
            // gap matches panel override (.tech-tiles { gap: 0.5rem })
            // Can't use Tailwind gap token for arbitrary value without bracket,
            // but 0.5rem = gap-2 which is exact.
          >
            <div className="flex flex-col gap-2">
              {visibleTiles.map((tile, i) => (
                <PanelTile key={i} {...tile} />
              ))}
            </div>
          </motion.div>

          {/* ── Store badges ─────────────────────────────────────────── */}
          <motion.div
            {...revealBadges}
            style={{ gridArea: 'badges' }}
            className="flex flex-wrap gap-3 pt-1"
          >
            <StoreBadge
              href="#"
              label={data.appStoreLabel ?? ''}
              sub={data.appStoreSub ?? ''}
              main={data.appStoreMain ?? ''}
              logo={<AppleLogo />}
            />
            <StoreBadge
              href="#"
              label={data.playStoreLabel ?? ''}
              sub={data.playStoreSub ?? ''}
              main={data.playStoreMain ?? ''}
              logo={<PlayLogo />}
            />
          </motion.div>

          {/* ── Visual (phone pinned to panel bottom) ────────────────── */}
          <motion.div
            {...revealVisual}
            style={{ gridArea: 'visual' }}
            className={cn(
              // align-self: stretch so it fills all three row slots
              'relative self-stretch',
              // min-height so it has space when content is short (desktop only)
              'min-h-[380px]',
              // On mobile the image flows in-line below the copy — no reserved space
              'max-[900px]:min-h-0',
            )}
          >
            {/*
              Desktop (≥901px): image absolutely pinned to the panel bottom
              (bottom = -panel-pad → flush with the panel edge, clipped by overflow:hidden).
              Mobile (≤900px): image flows in normal layout, centred below the copy.
            */}
            <Image
              src="/assets/hand-mock-hero.png"
              alt={data.visualAlt ?? ''}
              width={350}
              height={480}
              loading="lazy"
              className={cn(
                'mx-auto block h-auto w-full max-w-[350px]',
                'min-[901px]:absolute min-[901px]:left-1/2 min-[901px]:bottom-[calc(-1*var(--panel-pad))]',
                'min-[901px]:m-0 min-[901px]:-translate-x-1/2',
              )}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
