import { cn } from '@/lib/utils'
import type { CategoryKey } from '@/lib/blog'
import { CATEGORY_META } from './categories'

/**
 * Gradient cover placeholder (step 1 — no real photography yet). Decorative: a
 * brand-leaning category gradient + a soft grid + a watermark icon. In step 2
 * this becomes a Sanity <Image> with the same rounded frame.
 */
export function BlogCover({
  category,
  className,
  iconScale = 1,
  imageUrl,
  alt = '',
}: {
  category: CategoryKey
  className?: string
  iconScale?: number
  imageUrl?: string | null
  alt?: string
}) {
  const { gradient, Icon } = CATEGORY_META[category]

  // Real cover photo (step 2) takes over the same rounded frame; otherwise the
  // brand-leaning gradient placeholder is shown.
  if (imageUrl) {
    return (
      <div className={cn('relative overflow-hidden bg-surface-2', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className={cn('relative overflow-hidden', className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)` }}
    >
      {/* soft top-left highlight for depth */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 0% 0%, rgba(255,255,255,0.28), transparent 55%)' }}
      />
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      {/* watermark icon */}
      <Icon
        className="absolute -bottom-[14%] -right-[6%] text-white/20"
        style={{ width: `${52 * iconScale}%`, height: 'auto' }}
        strokeWidth={1.25}
      />
      {/* gentle bottom vignette so overlaid text (if any) stays legible */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.18), transparent)' }}
      />
    </div>
  )
}
