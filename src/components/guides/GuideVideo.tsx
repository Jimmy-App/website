import { Play } from 'lucide-react'

type Props = {
  label: string
  duration: string
}

export function GuideVideo({ label, duration }: Props) {
  return (
    <figure
      className="relative my-8 overflow-hidden rounded-2xl border border-border bg-surface-2"
      style={{ aspectRatio: '16/9' }}
      aria-label={label}
      role="img"
    >
      {/* Skeleton shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-2 via-surface-offset to-surface-2 opacity-70" />

      {/* Subtle animated shimmer */}
      <div
        aria-hidden
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ animation: 'shimmer 2.2s ease-in-out infinite' }}
      />

      {/* Center play button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-full border border-border bg-surface shadow-[var(--shadow-md)]">
          <Play className="size-5 translate-x-0.5 text-purple" fill="currentColor" strokeWidth={0} />
        </div>
        <span className="text-[13px] font-medium text-text-muted">{label}</span>
      </div>

      {/* Duration pill */}
      <span className="absolute bottom-3 right-3 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-text backdrop-blur-sm">
        {duration}
      </span>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </figure>
  )
}
