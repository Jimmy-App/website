/**
 * Eased in-page scroll to an element by id — smoother than native
 * `scroll-behavior: smooth`, which flies too fast over long distances.
 * Duration scales with distance (clamped) so short and long jumps both feel
 * calm. Honors prefers-reduced-motion by jumping instantly.
 */
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export function smoothScrollToId(id: string, offset = 80): void {
  const el = document.getElementById(id)
  if (!el) return

  const targetY = el.getBoundingClientRect().top + window.scrollY - offset

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY)
    return
  }

  const startY = window.scrollY
  const distance = targetY - startY
  // ~0.6ms per px, clamped to a calm-but-snappy range.
  const duration = Math.min(1300, Math.max(650, Math.abs(distance) * 0.6))
  let startTime: number | null = null

  const step = (now: number): void => {
    if (startTime === null) startTime = now
    const progress = Math.min((now - startTime) / duration, 1)
    window.scrollTo(0, startY + distance * easeInOutCubic(progress))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
