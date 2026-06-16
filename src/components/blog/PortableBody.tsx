import { PortableText, type PortableTextComponents, type PortableTextBlock } from '@portabletext/react'
import { Zap, Check } from 'lucide-react'
import { urlFor } from '../../../sanity/image'
import { slugifyHeading, type PostBody } from '@/lib/blog'

function headingText(value: PortableTextBlock): string {
  const kids = (value.children ?? []) as Array<{ text?: string }>
  return kids.map((c) => c.text ?? '').join('')
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-5 text-[1.0625rem] leading-[1.8] text-text">{children}</p>,
    h2: ({ children, value }) => (
      <h2
        id={slugifyHeading(headingText(value))}
        className="mb-3.5 mt-11 scroll-mt-[96px] font-display text-[clamp(1.45rem,3vw,1.95rem)] font-extrabold leading-[1.2] tracking-[var(--tracking-tight)] text-text"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2.5 mt-8 font-display text-[1.2rem] font-bold tracking-[-0.01em] text-text">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-7 border-l-[3px] border-purple pl-5 text-[1.0625rem] italic leading-[1.7] text-text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 ml-1 flex list-none flex-col gap-2.5">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 ml-1 flex list-none flex-col gap-2.5 [counter-reset:item]">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-7 text-[1.0625rem] leading-[1.7] text-text before:absolute before:left-0 before:top-[0.7em] before:size-[7px] before:rounded-full before:bg-purple before:content-['']">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="relative pl-9 text-[1.0625rem] leading-[1.7] text-text [counter-increment:item] before:absolute before:left-0 before:top-[0.05em] before:grid before:size-[24px] before:place-items-center before:rounded-full before:bg-purple-light before:text-[12px] before:font-bold before:text-purple before:[content:counter(item)]">
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
    callout: ({ value }) => {
      const v = value as { tone?: 'spark' | 'check'; label?: string; text?: string }
      return (
        <div className="my-7 rounded-[16px] border border-purple-border bg-purple-light/50 p-[clamp(16px,2.4vw,22px)]">
          <div className="mb-1.5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-purple">
            {v.tone === 'check' ? <Check className="size-[15px]" strokeWidth={2.4} /> : <Zap className="size-[15px]" strokeWidth={2.2} />}
            {v.label}
          </div>
          <p className="text-[15.5px] leading-[1.6] text-text">{v.text}</p>
        </div>
      )
    },
    pullquote: ({ value }) => {
      const v = value as { text?: string; cite?: string }
      return (
        <blockquote className="my-8 border-l-[3px] border-purple pl-5 font-display text-[clamp(1.2rem,2.4vw,1.5rem)] font-medium leading-[1.4] tracking-[-0.01em] text-text">
          {v.text}
          {v.cite && <cite className="mt-3 block text-[14px] font-normal not-italic text-text-muted">{v.cite}</cite>}
        </blockquote>
      )
    },
    image: ({ value }) => {
      const v = value as { asset?: { _ref?: string }; alt?: string | null; caption?: string | null }
      if (!v.asset?._ref) return null
      const src = urlFor(value as never).width(1280).fit('max').auto('format').url()
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={v.alt ?? ''} loading="lazy" className="w-full rounded-[16px]" />
          {v.caption && (
            <figcaption className="mt-3 text-center text-[13px] italic text-text-muted">{v.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
}

export function PortableBody({ blocks }: { blocks: PostBody }) {
  return (
    <div className="max-w-[68ch]">
      <PortableText value={blocks as unknown as PortableTextBlock[]} components={components} />
    </div>
  )
}
