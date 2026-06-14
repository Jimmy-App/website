import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge doesn't know our custom `--text-*` theme sizes, so by default it
 * mis-classifies named utilities like `text-hero` / `text-h2` as text-COLOR and
 * drops them when combined with a real color (e.g. `text-text`). Register them as
 * font-size so size + color coexist correctly.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'hero',
            'display',
            'h2',
            'h3',
            'h4',
            'lead',
            'body',
            '2xs',
            'eyebrow',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
