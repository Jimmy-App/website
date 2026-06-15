'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity/sanity.config'

// NextStudio (not the raw `Studio` from `sanity`) renders the Studio in a
// full-viewport (100dvh) container and injects a style reset so the host site's
// global CSS (Tailwind base, body font/line-height in globals.css) can't clip
// or restyle it. Raw <Studio> made the Studio only as tall as its content,
// leaving the page visually "cut off".
export default function StudioClient() {
  return <NextStudio config={config} />
}
