/**
 * Portable Text renderer for guide bodies.
 *
 * Mirrors the visual output of the static GuideBody.tsx renderer but
 * consumes Sanity Portable Text from GUIDE_QUERY_RESULT['body'].
 *
 * Custom block types supported:
 *   guideCallout  — 4-tone callout box (note/tip/warn/success)
 *   checklist     — checkbox list
 *   guideSteps    — numbered timeline with per-step PT sub-body
 *   guideFaq      — accordion FAQ (via GuideFaq client leaf)
 *   guideVideo    — video skeleton (via GuideVideo)
 *   image         — figure with alt + caption (skeleton if no asset)
 */

import { PortableText, type PortableTextComponents, type PortableTextBlock } from '@portabletext/react'
import { Info, Lightbulb, TriangleAlert, PartyPopper, Check, Image as ImageIcon } from 'lucide-react'
import { GuideFaq } from '@/components/guides/GuideFaq'
import { GuideVideo } from '@/components/guides/GuideVideo'
import { urlFor } from '../../../sanity/image'
import { slugifyHeading } from '@/lib/guides'
import type { GUIDE_QUERY_RESULT } from '../../../sanity.types'

// ── Type aliases ─────────────────────────────────────────────────────────────

type GuideBody = NonNullable<NonNullable<GUIDE_QUERY_RESULT>['body']>

// The step sub-body items type (used in guideSteps)
type StepBody = NonNullable<
  Extract<GuideBody[number], { _type: 'guideSteps' }>['items']
>[number]['body']

// ── Heading text helper ───────────────────────────────────────────────────────

function headingText(value: PortableTextBlock): string {
  const kids = (value.children ?? []) as Array<{ text?: string }>
  return kids.map((c) => c.text ?? '').join('')
}

// ── Callout tones ─────────────────────────────────────────────────────────────

type CalloutTone = 'note' | 'tip' | 'warn' | 'success'

const CALLOUT_STYLES: Record<
  CalloutTone,
  { bg: string; border: string; labelColor: string; icon: React.ReactNode }
> = {
  note: {
    bg: 'rgba(56,189,248,0.08)',
    border: '#38bdf8',
    labelColor: '#0369a1',
    icon: <Info className="size-[15px]" strokeWidth={2} style={{ color: '#0369a1' }} />,
  },
  tip: {
    bg: 'rgba(138,50,224,0.07)',
    border: '#8a32e0',
    labelColor: '#7929c9',
    icon: <Lightbulb className="size-[15px]" strokeWidth={2} style={{ color: '#7929c9' }} />,
  },
  warn: {
    bg: 'rgba(245,158,11,0.09)',
    border: '#f59e0b',
    labelColor: '#b45309',
    icon: <TriangleAlert className="size-[15px]" strokeWidth={2} style={{ color: '#b45309' }} />,
  },
  success: {
    bg: 'rgba(16,185,129,0.09)',
    border: '#10b981',
    labelColor: '#0f766e',
    icon: <PartyPopper className="size-[15px]" strokeWidth={2} style={{ color: '#0f766e' }} />,
  },
}

function GuideCalloutBlock({
  tone,
  label,
  text,
}: {
  tone: CalloutTone
  label: string
  text: string
}) {
  const s = CALLOUT_STYLES[tone] ?? CALLOUT_STYLES.tip
  return (
    <div
      className="my-6 rounded-[14px] p-4"
      style={{ background: s.bg, borderLeft: `3px solid ${s.border}` }}
    >
      <div className="mb-1.5 flex items-center gap-2">
        {s.icon}
        <span
          className="text-[11.5px] font-bold uppercase tracking-[0.08em]"
          style={{ color: s.labelColor }}
        >
          {label}
        </span>
      </div>
      <p className="text-[14.5px] leading-[1.65] text-text">{text}</p>
    </div>
  )
}

// ── Figure skeleton (no image asset in seed) ──────────────────────────────────

function FigureSkeleton({ caption }: { caption?: string | null }) {
  return (
    <figure className="my-6">
      <div
        className="relative overflow-hidden rounded-xl border border-border bg-surface-2"
        style={{ aspectRatio: '16/9' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="size-8 text-text-faint" strokeWidth={1.25} />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 flex items-center gap-1.5 text-[12.5px] italic text-text-muted">
          <ImageIcon className="size-3 shrink-0" strokeWidth={1.5} />
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// ── Step sub-body renderer (recursive — uses the same component set) ──────────

function StepPortableBody({ body }: { body: StepBody }) {
  if (!body) return null
  return (
    <PortableText
      value={body as unknown as PortableTextBlock[]}
      components={stepBodyComponents}
    />
  )
}

// Step body components (h3 only, no h2)
const stepBodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-[15px] leading-[1.8] text-text">{children}</p>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2.5 mt-7 font-display text-[1.1rem] font-bold tracking-[var(--tracking-snug)] text-text">
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-5 ml-1 flex list-none flex-col gap-2">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-7 text-[15px] leading-[1.7] text-text before:absolute before:left-0 before:top-[0.7em] before:size-[7px] before:rounded-full before:bg-purple before:content-['']">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={(value as { href?: string })?.href ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-purple underline decoration-purple/30 underline-offset-2 transition-colors hover:decoration-purple"
      >
        {children}
      </a>
    ),
  },
  types: {
    guideCallout: ({ value }) => {
      const v = value as { tone?: string; label?: string; text?: string }
      const tone = (v.tone ?? 'tip') as CalloutTone
      return (
        <GuideCalloutBlock
          tone={tone}
          label={v.label ?? ''}
          text={v.text ?? ''}
        />
      )
    },
    image: ({ value }) => {
      const v = value as { asset?: { _ref?: string }; alt?: string | null; caption?: string | null }
      if (!v.asset?._ref) return <FigureSkeleton caption={v.caption} />
      const src = urlFor(value as never).width(1280).fit('max').auto('format').url()
      return (
        <figure className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={v.alt ?? ''} loading="lazy" className="w-full rounded-[16px]" />
          {v.caption && (
            <figcaption className="mt-2 text-center text-[13px] italic text-text-muted">
              {v.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

// ── Main guide body components ────────────────────────────────────────────────

const guideComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-[15px] leading-[1.8] text-text">{children}</p>
    ),
    h2: ({ children, value }) => (
      <h2
        id={slugifyHeading(headingText(value))}
        className="mb-3.5 mt-10 scroll-mt-[96px] font-display text-[clamp(1.35rem,2.6vw,1.75rem)] font-extrabold leading-[1.2] tracking-[var(--tracking-tight)] text-text first:mt-0"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2.5 mt-7 font-display text-[1.1rem] font-bold tracking-[var(--tracking-snug)] text-text">
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-5 ml-1 flex list-none flex-col gap-2">{children}</ul>,
    number: ({ children }) => (
      <ol className="mb-5 ml-1 flex list-none flex-col gap-2 [counter-reset:item]">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-7 text-[15px] leading-[1.7] text-text before:absolute before:left-0 before:top-[0.7em] before:size-[7px] before:rounded-full before:bg-purple before:content-['']">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="relative pl-9 text-[15px] leading-[1.7] text-text [counter-increment:item] before:absolute before:left-0 before:top-[0.05em] before:grid before:size-[24px] before:place-items-center before:rounded-full before:bg-purple-light before:text-[12px] before:font-bold before:text-purple before:[content:counter(item)]">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={(value as { href?: string })?.href ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-purple underline decoration-purple/30 underline-offset-2 transition-colors hover:decoration-purple"
      >
        {children}
      </a>
    ),
  },
  types: {
    guideCallout: ({ value }) => {
      const v = value as { tone?: string; label?: string; text?: string }
      const tone = (v.tone ?? 'tip') as CalloutTone
      return (
        <GuideCalloutBlock
          tone={tone}
          label={v.label ?? ''}
          text={v.text ?? ''}
        />
      )
    },

    checklist: ({ value }) => {
      const v = value as { items?: Array<string> }
      const items = v.items ?? []
      return (
        <ul className="my-5 space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-[3px] flex size-[18px] shrink-0 items-center justify-center rounded-full bg-purple-light">
                <Check className="size-[10px] text-purple" strokeWidth={2.5} />
              </span>
              <span className="text-[14.5px] leading-[1.65] text-text">{item}</span>
            </li>
          ))}
        </ul>
      )
    },

    guideSteps: ({ value }) => {
      const v = value as Extract<GuideBody[number], { _type: 'guideSteps' }>
      const items = v.items ?? []
      return (
        <div className="my-8 space-y-0">
          {items.map((step, i) => (
            <div
              key={i}
              id={`step-${i + 1}`}
              className="relative pb-10 pl-12 scroll-mt-[96px] last:pb-0"
            >
              {/* Connecting vertical line */}
              {i < items.length - 1 && (
                <div
                  aria-hidden
                  className="absolute left-[18px] top-[36px] w-[2px] bg-divider"
                  style={{ height: 'calc(100% - 12px)' }}
                />
              )}
              {/* Numbered chip */}
              <div
                aria-hidden
                className="absolute left-0 top-0 flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-light text-[13px] font-bold text-purple ring-2 ring-surface"
              >
                {i + 1}
              </div>
              {/* Content */}
              <h3 className="mb-3 mt-1 font-display text-[1.1rem] font-bold tracking-[var(--tracking-snug)] text-text">
                {step.title}
              </h3>
              <div>
                <StepPortableBody body={step.body} />
              </div>
            </div>
          ))}
        </div>
      )
    },

    guideFaq: ({ value }) => {
      const v = value as Extract<GuideBody[number], { _type: 'guideFaq' }>
      const items = (v.items ?? []).map((it) => ({ q: it.q ?? '', a: it.a ?? '' }))
      return <GuideFaq items={items} />
    },

    guideVideo: ({ value }) => {
      const v = value as { label?: string; duration?: string }
      return <GuideVideo label={v.label ?? ''} duration={v.duration ?? ''} />
    },

    image: ({ value }) => {
      const v = value as { asset?: { _ref?: string }; alt?: string | null; caption?: string | null }
      if (!v.asset?._ref) return <FigureSkeleton caption={v.caption} />
      const src = urlFor(value as never).width(1280).fit('max').auto('format').url()
      return (
        <figure className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={v.alt ?? ''} loading="lazy" className="w-full rounded-[16px]" />
          {v.caption && (
            <figcaption className="mt-2 text-center text-[13px] italic text-text-muted">
              {v.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

// ── Public export ─────────────────────────────────────────────────────────────

export function GuidePortableBody({ body }: { body: GuideBody }) {
  return (
    <div className="max-w-[68ch]">
      <PortableText value={body as unknown as PortableTextBlock[]} components={guideComponents} />
    </div>
  )
}
