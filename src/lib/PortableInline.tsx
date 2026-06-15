import type { ReactNode } from 'react'

/**
 * Renders a single-paragraph Portable Text value INLINE (no block <p> wrapper),
 * applying per-mark render functions. Used for short rich strings that were
 * previously next-intl `t.rich(...)` calls (e.g. beta.body, manifesto.body)
 * where the surrounding element (a styled <p>) already exists.
 */
type Span = { _key: string; text?: string; marks?: string[] }
type Block = { _key: string; children?: Span[] }

export function PortableInline({
  value,
  marks = {},
}: {
  value: unknown
  marks?: Record<string, (chunk: string) => ReactNode>
}) {
  const blocks = (value as Block[] | null | undefined) ?? []
  return (
    <>
      {blocks.flatMap((block) =>
        (block.children ?? []).map((span) => {
          const mark = (span.marks ?? []).find((m) => marks[m])
          const text = span.text ?? ''
          return (
            <span key={span._key}>
              {mark ? marks[mark](text) : text}
            </span>
          )
        }),
      )}
    </>
  )
}
