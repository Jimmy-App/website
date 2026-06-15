'use client'

import { useReducedMotion, motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TeamData } from '@/lib/content'

// ─── Animation helpers ────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function useReveal(delayMs = 0) {
  const reduced = useReducedMotion()
  if (reduced) return { initial: {}, animate: {}, transition: {} }
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.64, ease: EASE, delay: delayMs / 1000 },
  }
}

// ─── Social icon shapes (inline SVG — no external dependency) ─────────────────

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.46-2.2 2.96V21H9V9z" />
    </svg>
  )
}

// ─── Social button ────────────────────────────────────────────────────────────

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        'flex size-8 items-center justify-center rounded-[9px]',
        'border border-border bg-bg text-text-muted',
        'transition-[color,border-color,background,transform,box-shadow] duration-[160ms] ease-[ease]',
        'hover:-translate-y-0.5 hover:border-transparent hover:bg-purple hover:text-white',
        'hover:shadow-[0_6px_16px_-5px_rgba(138,50,224,0.5)]',
      )}
    >
      {children}
    </a>
  )
}

// ─── Team card ────────────────────────────────────────────────────────────────

interface MemberData {
  idx: string
  name: string
  role: string
  bio: string
  location: string
  photo: string
  initials: string
}

function TeamCard({
  member,
  delayMs,
}: {
  member: MemberData
  delayMs: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.article
      initial={reduced ? {} : { opacity: 0, y: 24 }}
      animate={reduced ? {} : { opacity: 1, y: 0 }}
      transition={reduced ? {} : { duration: 0.6, ease: EASE, delay: delayMs / 1000 }}
      className={cn(
        'relative grid overflow-hidden',
        'grid-cols-[128px_1fr] max-[440px]:grid-cols-1',
        'rounded-[22px] border border-border bg-surface',
        'shadow-[0_4px_24px_rgba(0,0,0,0.05),0_1px_4px_rgba(0,0,0,0.03)]',
        'transition-[border-color,box-shadow] duration-[220ms] ease-[ease]',
        'hover:border-purple-border hover:shadow-[0_14px_34px_-12px_rgba(138,50,224,0.16)]',
      )}
    >
      {/* Photo column */}
      <div
        className={cn(
          'relative border-r border-border bg-surface-2',
          'max-[440px]:min-h-[140px] max-[440px]:border-b max-[440px]:border-r-0',
        )}
      >
        {/* Index label */}
        <span
          className={cn(
            'absolute left-3 top-2.5 z-10',
            'font-display text-[11px] font-extrabold tracking-[0.05em] text-purple',
          )}
          aria-hidden="true"
        >
          {member.idx}
        </span>

        {/* Photo */}
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>

      {/* Body column */}
      <div className="flex min-w-0 flex-col p-[1.15rem_1.3rem]">
        {/* Name + role row */}
        <div className="mb-[0.55rem] flex flex-wrap items-center gap-[10px]">
          <h3
            className={cn(
              'font-display text-[1.2rem] font-extrabold leading-none',
              'tracking-[-0.03em] text-text',
            )}
          >
            {member.name}
          </h3>
          <span
            className={cn(
              'whitespace-nowrap rounded-full border border-purple-border',
              'bg-purple-light px-[9px] py-[3px]',
              'text-[10px] font-bold uppercase tracking-[0.07em] text-purple',
            )}
          >
            {member.role}
          </span>
        </div>

        {/* Bio */}
        <p
          className={cn(
            'mb-[0.9rem] text-pretty text-[12.5px] leading-[1.5] text-text-muted',
          )}
        >
          {member.bio}
        </p>

        {/* Footer: location + socials */}
        <div className="mt-auto flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-[5px]',
              'text-[11.5px] font-medium text-text-faint',
            )}
          >
            <MapPin className="size-3" strokeWidth={1.75} />
            {member.location}
          </span>

          <div className="ml-auto flex gap-[6px]">
            <SocialLink href="#" label="Instagram">
              <IconInstagram className="size-[15px]" />
            </SocialLink>
            <SocialLink href="#" label="LinkedIn">
              <IconLinkedIn className="size-[15px]" />
            </SocialLink>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// ─── Team section ─────────────────────────────────────────────────────────────

// Hardcoded photo paths (Sanity image fields are not yet URL-resolved in this context)
const MEMBER_PHOTOS = ['/assets/people/coach-1.png', '/assets/people/coach-2.png']

export function Team({ data }: { data: TeamData }) {
  const revealHeader = useReveal(0)
  const revealStats = useReveal(400)

  const members: MemberData[] = (data.members ?? []).map((m, i) => ({
    idx: String(i + 1).padStart(2, '0'),
    name: m.name ?? '',
    role: m.role ?? '',
    bio: m.bio ?? '',
    location: m.location ?? '',
    photo: MEMBER_PHOTOS[i] ?? '/assets/people/coach-1.png',
    initials: (m.name ?? '').split(' ').map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase(),
  }))

  const stats = (data.stats ?? []).map((s) => ({
    _key: s._key,
    num: s.num ?? '',
    heading: s.heading ?? '',
    body: s.body ?? '',
  }))

  return (
    <section
      id="team"
      aria-label={data.sectionLabel ?? ''}
      className={cn(
        'relative bg-bg',
        'border-t border-border',
        'overflow-hidden',
      )}
    >
      <div
        className={cn(
          'relative mx-auto max-w-[1080px]',
          'px-[clamp(1rem,4vw,2.5rem)]',
          'py-[clamp(4rem,8vw,6.5rem)]',
        )}
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
        <motion.header
          {...revealHeader}
          className="mx-auto mb-[clamp(2.25rem,4vw,3rem)] max-w-[640px] text-center"
        >
          <span
            className={cn(
              'mb-4 inline-flex items-center gap-[6px]',
              'text-[11px] font-bold uppercase tracking-[0.1em] text-purple',
              'before:size-[5px] before:rounded-full before:bg-purple before:content-[""]',
            )}
          >
            {data.eyebrow}
          </span>

          <h2
            className={cn(
              'font-display text-balance text-[clamp(2rem,4vw,3.25rem)]',
              'mb-[0.85rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-text',
            )}
          >
            {data.title}
          </h2>

          <p
            className={cn(
              'mx-auto max-w-[40ch] text-pretty',
              'text-[clamp(0.95rem,1.3vw,1.1rem)] font-normal leading-[1.55] text-text-muted',
            )}
          >
            {data.subtitle}
          </p>
        </motion.header>

        {/* ── Team grid ─────────────────────────────────────────────────── */}
        <div
          className={cn(
            'mb-[clamp(1.25rem,2.5vw,1.75rem)]',
            'grid gap-[clamp(1rem,2vw,1.25rem)]',
            'grid-cols-2 max-[820px]:mx-auto max-[820px]:max-w-[520px] max-[820px]:grid-cols-1',
          )}
        >
          {members.map((member, i) => (
            <TeamCard key={member.idx} member={member} delayMs={120 + i * 100} />
          ))}
        </div>

        {/* ── Stats strip ───────────────────────────────────────────────── */}
        <motion.div
          {...revealStats}
          className={cn(
            'grid grid-cols-3 overflow-hidden',
            'rounded-[18px] border border-border bg-surface',
            'max-[820px]:mx-auto max-[820px]:max-w-[520px] max-[820px]:grid-cols-1',
          )}
        >
          {stats.map((stat, i) => (
            <div
              key={stat._key}
              className={cn(
                'flex items-center gap-3 px-[1.4rem] py-[1.1rem]',
                i !== 0
                  ? 'border-l border-[var(--color-divider)] max-[820px]:border-l-0 max-[820px]:border-t max-[820px]:border-[var(--color-divider)]'
                  : '',
              )}
            >
              <span
                className={cn(
                  'font-display text-[clamp(1.25rem,2vw,1.55rem)]',
                  'shrink-0 font-extrabold leading-none tracking-[-0.02em] text-purple',
                  'whitespace-nowrap',
                )}
              >
                {stat.num}
              </span>
              <span className="flex min-w-0 flex-col gap-[2px]">
                <span className="text-[13px] font-bold tracking-[-0.01em] text-text">
                  {stat.heading}
                </span>
                <span className="text-[11.5px] leading-[1.4] text-text-muted">
                  {stat.body}
                </span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
