import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getNavigation, getFooter, getPosts } from '../../../../sanity/getHomePage'
import { urlFor } from '../../../../sanity/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BlogIndex } from '@/components/blog/BlogIndex'
import { BlogNewsletter } from '@/components/blog/BlogNewsletter'
import type { CardPost } from '@/components/blog/PostCard'
import { formatPostDate, isCategoryKey } from '@/lib/blog'
import type { POSTS_QUERY_RESULT } from '../../../../sanity.types'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'The Jimmy blog — retention, programming and business playbooks for modern fitness coaches.',
}

type SanityPost = POSTS_QUERY_RESULT[number]

function toCard(p: SanityPost, locale: string): CardPost {
  return {
    slug: p.slug ?? '',
    category: isCategoryKey(p.category) ? p.category : 'stories',
    title: p.title ?? '',
    excerpt: p.excerpt ?? '',
    shortDate: formatPostDate(p.publishedAt, locale).short,
    readMin: p.readMin ?? 5,
    coverUrl: p.coverImage?.asset
      ? urlFor(p.coverImage).width(800).height(500).fit('crop').auto('format').url()
      : null,
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [navigation, footer, posts] = await Promise.all([
    getNavigation(locale),
    getFooter(locale),
    getPosts(locale),
  ])
  if (!navigation || !footer) notFound()

  const valid = posts.filter((p) => p.slug)
  const featuredSrc = valid.find((p) => p.featured) ?? valid[0]
  const cards = valid.map((p) => toCard(p, locale))
  const featured = featuredSrc ? toCard(featuredSrc, locale) : null
  const picks = valid
    .filter((p) => p.pick && p.slug !== featuredSrc?.slug)
    .slice(0, 3)
    .map((p) => toCard(p, locale))
  const rest = cards.filter((c) => c.slug !== featured?.slug)

  return (
    <>
      <Navbar data={navigation} />
      {featured ? (
        <BlogIndex featured={featured} picks={picks} posts={rest} />
      ) : (
        <div className="mx-auto max-w-[1120px] px-[clamp(20px,5vw,40px)] py-24 text-center text-text-muted">
          No articles published yet.
        </div>
      )}
      <BlogNewsletter />
      <Footer data={footer} />
    </>
  )
}
