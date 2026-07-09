import type { MetadataRoute } from 'next'
import { SITE_NAME } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jimmy — The Skool of Fitness',
    short_name: SITE_NAME,
    description:
      'The retention platform for modern fitness coaches — workouts, community, payments and a white-label app.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf8',
    theme_color: '#8a32e0',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
