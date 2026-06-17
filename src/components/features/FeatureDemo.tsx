'use client'

/**
 * FeatureDemo — switches to the correct animated demo component
 * based on the feature's demoKey.
 *
 * For 'progress-tracking' (demoKey=null) we render a tasteful animated
 * placeholder until a real demo is built.
 */

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Flame, Activity } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { WorkoutBuilderDemo } from '@/components/sections/WorkoutBuilderDemo'
import { CommunityFeedDemo } from '@/components/sections/CommunityFeedDemo'
import { MessagingDemo } from '@/components/sections/MessagingDemo'
import { PaymentsDemo } from '@/components/sections/PaymentsDemo'
import { CourseBuilderDemo } from '@/components/sections/CourseBuilderDemo'
import type { FeatureDemoKey } from '@/lib/features'

// ── Progress Tracking Placeholder ─────────────────────────────────────────────
// A clean animated illustration: rising bar chart + streak counter + PR badges.
// Lightweight CSS/inline animation — no framer-motion needed here.

function ProgressTrackingPlaceholder({ active }: { active: boolean }) {
  const reducedMotion = useReducedMotion() ?? false

  // Bar heights as percentages (7 bars)
  const BARS = [42, 58, 34, 71, 63, 82, 90]
  const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  const [animatedHeights, setAnimatedHeights] = useState<number[]>(
    BARS.map(() => 0),
  )
  const [prVisible, setPrVisible] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!active || hasAnimated.current) return
    if (reducedMotion) {
      setAnimatedHeights(BARS)
      setPrVisible(true)
      setStreakCount(18)
      hasAnimated.current = true
      return
    }

    hasAnimated.current = true

    // Stagger bar reveals
    const timers: ReturnType<typeof setTimeout>[] = []
    BARS.forEach((h, i) => {
      timers.push(
        setTimeout(() => {
          setAnimatedHeights((prev) => {
            const next = [...prev]
            next[i] = h
            return next
          })
        }, 180 + i * 90),
      )
    })

    // PR badges appear after bars
    timers.push(setTimeout(() => setPrVisible(true), 180 + BARS.length * 90 + 100))

    // Streak counter counts up
    timers.push(
      setTimeout(() => {
        let count = 0
        const interval = setInterval(() => {
          count++
          setStreakCount(count)
          if (count >= 18) clearInterval(interval)
        }, 60)
        timers.push(interval as unknown as ReturnType<typeof setTimeout>)
      }, 400),
    )

    return () => timers.forEach((t) => clearTimeout(t))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reducedMotion])

  return (
    <div className="flex flex-col gap-3 p-1">
      {/* Header row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-purple-light">
            <TrendingUp size={14} className="text-purple" strokeWidth={2} />
          </span>
          <span className="text-[13px] font-bold text-text">Progress Overview</span>
        </div>
        <span className="rounded-full bg-purple-light px-2.5 py-1 text-[10px] font-bold text-purple">
          This week
        </span>
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-border bg-surface p-3">
        <div className="mb-2 text-[11px] font-semibold text-text-muted">Weekly sessions</div>
        <div className="flex items-end gap-[5px]" style={{ height: '64px' }}>
          {BARS.map((_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative w-full flex-1 overflow-hidden rounded-t-[3px]">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-[3px] bg-purple"
                  style={{
                    height: `${animatedHeights[i] ?? 0}%`,
                    transition: reducedMotion
                      ? 'none'
                      : 'height 480ms cubic-bezier(0.16,1,0.3,1)',
                    opacity: i === BARS.length - 1 ? 1 : 0.6 + (i / BARS.length) * 0.4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-[5px]">
          {LABELS.map((l, i) => (
            <div key={i} className="flex-1 text-center text-[9px] font-medium text-text-faint">
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Streak */}
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface p-3">
          <Flame size={16} className="text-orange-500" strokeWidth={2} />
          <span
            className="font-display text-[1.25rem] font-extrabold tabular-nums text-text"
            style={{ transition: 'none' }}
          >
            {streakCount}
          </span>
          <span className="text-center text-[9px] font-medium text-text-faint">day streak</span>
        </div>

        {/* Sessions */}
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface p-3">
          <Activity size={16} className="text-purple" strokeWidth={2} />
          <span className="font-display text-[1.25rem] font-extrabold tabular-nums text-text">
            47
          </span>
          <span className="text-center text-[9px] font-medium text-text-faint">sessions</span>
        </div>

        {/* PRs this month */}
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface p-3">
          <TrendingUp size={16} className="text-green-600" strokeWidth={2} />
          <span className="font-display text-[1.25rem] font-extrabold tabular-nums text-text">
            12
          </span>
          <span className="text-center text-[9px] font-medium text-text-faint">PRs this mo.</span>
        </div>
      </div>

      {/* PR badges */}
      <div
        className="flex flex-col gap-1.5 transition-[opacity,transform] duration-500"
        style={{
          opacity: prVisible ? 1 : 0,
          transform: prVisible ? 'translateY(0)' : 'translateY(8px)',
          transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {[
          { name: 'Back Squat', value: '120 kg', delta: '+5 kg' },
          { name: 'Deadlift', value: '142.5 kg', delta: '+2.5 kg' },
        ].map((pr) => (
          <div
            key={pr.name}
            className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-md bg-purple-light">
                <TrendingUp size={10} className="text-purple" strokeWidth={2.5} />
              </span>
              <span className="text-[12px] font-semibold text-text">{pr.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-text">{pr.value}</span>
              <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
                {pr.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder label */}
      <div className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-surface-2 px-3 py-2">
        <TrendingUp size={12} className="text-text-faint" strokeWidth={1.75} />
        <span className="text-[11px] text-text-faint">Live demo coming soon</span>
      </div>
    </div>
  )
}

// ── Main switch ───────────────────────────────────────────────────────────────

export function FeatureDemo({
  demoKey,
  active,
}: {
  demoKey: FeatureDemoKey
  active: boolean
}) {
  switch (demoKey) {
    case 'workout':
      return <WorkoutBuilderDemo embedded active={active} />
    case 'community':
      return <CommunityFeedDemo embedded active={active} />
    case 'messaging':
      return <MessagingDemo embedded active={active} />
    case 'payments':
      return <PaymentsDemo embedded active={active} />
    case 'courses':
      return <CourseBuilderDemo embedded active={active} />
    default:
      return <ProgressTrackingPlaceholder active={active} />
  }
}
