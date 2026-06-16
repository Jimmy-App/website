import { Info, Lightbulb, TriangleAlert, PartyPopper, Check, Image } from 'lucide-react'
import type { Block, CalloutTone, FaqItem, StepItem } from '@/lib/guides'
import { GuideFaq } from '@/components/guides/GuideFaq'
import { GuideVideo } from '@/components/guides/GuideVideo'

/* ── Inline text: **bold** + _italic_ ──────────────────────────────── */
export function renderInline(text: string): React.ReactNode {
  // Split on **bold** and _italic_ markers
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-text">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

/* ── Callout tones ───────────────────────────────────────────────────── */
type CalloutStyle = {
  bg: string
  border: string
  label: string
  icon: React.ReactNode
}

const CALLOUT_STYLES: Record<CalloutTone, CalloutStyle> = {
  note: {
    bg: 'rgba(56,189,248,0.08)',
    border: '#38bdf8',
    label: '#0369a1',
    icon: <Info className="size-[15px]" strokeWidth={2} style={{ color: '#0369a1' }} />,
  },
  tip: {
    bg: 'rgba(138,50,224,0.07)',
    border: '#8a32e0',
    label: '#7929c9',
    icon: <Lightbulb className="size-[15px]" strokeWidth={2} style={{ color: '#7929c9' }} />,
  },
  warn: {
    bg: 'rgba(245,158,11,0.09)',
    border: '#f59e0b',
    label: '#b45309',
    icon: <TriangleAlert className="size-[15px]" strokeWidth={2} style={{ color: '#b45309' }} />,
  },
  success: {
    bg: 'rgba(16,185,129,0.09)',
    border: '#10b981',
    label: '#0f766e',
    icon: <PartyPopper className="size-[15px]" strokeWidth={2} style={{ color: '#0f766e' }} />,
  },
}

function Callout({ tone, label, text }: { tone: CalloutTone; label: string; text: string }) {
  const s = CALLOUT_STYLES[tone]
  return (
    <div
      className="my-6 rounded-[14px] p-4"
      style={{
        background: s.bg,
        borderLeft: `3px solid ${s.border}`,
      }}
    >
      <div className="mb-1.5 flex items-center gap-2">
        {s.icon}
        <span
          className="text-[11.5px] font-bold uppercase tracking-[0.08em]"
          style={{ color: s.label }}
        >
          {label}
        </span>
      </div>
      <p className="text-[14.5px] leading-[1.65] text-text">{renderInline(text)}</p>
    </div>
  )
}

/* ── Figure skeleton ────────────────────────────────────────────────── */
function FigureSkeleton({ caption }: { caption: string }) {
  return (
    <figure className="my-6">
      <div
        className="relative overflow-hidden rounded-xl border border-border bg-surface-2"
        style={{ aspectRatio: '16/9' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image className="size-8 text-text-faint" strokeWidth={1.25} />
        </div>
      </div>
      <figcaption className="mt-2 flex items-center gap-1.5 text-[12.5px] italic text-text-muted">
        <Image className="size-3 shrink-0" strokeWidth={1.5} />
        {caption}
      </figcaption>
    </figure>
  )
}

/* ── Steps (numbered timeline) ──────────────────────────────────────── */
function Steps({ items }: { items: StepItem[] }) {
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
            <RenderBlocks blocks={step.blocks} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Checklist ──────────────────────────────────────────────────────── */
function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="my-5 space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-[3px] flex size-[18px] shrink-0 items-center justify-center rounded-full bg-purple-light">
            <Check className="size-[10px] text-purple" strokeWidth={2.5} />
          </span>
          <span className="text-[14.5px] leading-[1.65] text-text">{renderInline(item)}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── Block renderer (recursive for steps) ──────────────────────────── */
export function RenderBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={i}
                id={block.id}
                className="mb-3.5 mt-10 scroll-mt-[96px] font-display text-[clamp(1.35rem,2.6vw,1.75rem)] font-extrabold leading-[1.2] tracking-[var(--tracking-tight)] text-text first:mt-0"
              >
                {block.text}
              </h2>
            )
          case 'h3':
            return (
              <h3
                key={i}
                className="mb-2.5 mt-7 font-display text-[1.1rem] font-bold tracking-[var(--tracking-snug)] text-text"
              >
                {block.text}
              </h3>
            )
          case 'p':
            return (
              <p key={i} className="mb-4 text-[15px] leading-[1.8] text-text">
                {renderInline(block.text)}
              </p>
            )
          case 'check':
            return <CheckList key={i} items={block.items} />
          case 'callout':
            return <Callout key={i} tone={block.tone} label={block.label} text={block.text} />
          case 'figure':
            return <FigureSkeleton key={i} caption={block.caption} />
          case 'video':
            return <GuideVideo key={i} label={block.label} duration={block.duration} />
          case 'steps':
            return <Steps key={i} items={block.items} />
          case 'faq': {
            const faqItems: FaqItem[] = block.items
            return <GuideFaq key={i} items={faqItems} />
          }
          default:
            return null
        }
      })}
    </>
  )
}

/* ── Top-level export ───────────────────────────────────────────────── */
export function GuideBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-[68ch]">
      <RenderBlocks blocks={blocks} />
    </div>
  )
}
