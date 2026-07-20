import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { pageMetadata, localizedUrl } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { articleSchema, breadcrumbSchema } from '@/lib/jsonld'
import {
  getPost,
  getPosts,
  getPostSlugs,
} from '../../../../../sanity/getHomePage'
import { urlFor } from '../../../../../sanity/image'
import { Link } from '@/i18n/navigation'
import { PortableBody } from '@/components/blog/PortableBody'
import { BlogCover } from '@/components/blog/BlogCover'
import { PostCard, type CardPost } from '@/components/blog/PostCard'
import { ReadingBar, ArticleToc, ArticleShare } from '@/components/blog/ArticleInteractive'
import { CATEGORY_META } from '@/components/blog/categories'
import {
  formatPostDate,
  isCategoryKey,
  tocFromBody,
  type CategoryKey,
  type PostBody,
} from '@/lib/blog'

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.filter((s) => s.slug).map((s) => ({ slug: s.slug as string }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPost(locale, slug)
  if (!post) return pageMetadata({ locale, path: `/blog/${slug}`, title: 'Blog' })
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.title ?? 'Blog',
    description: post.excerpt ?? undefined,
    type: 'article',
  })
}

const Dot = () => <span className="size-[3px] rounded-full bg-text-faint" />

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [post, allPosts, t] = await Promise.all([
    getPost(locale, slug),
    getPosts(locale),
    getTranslations({ locale, namespace: 'blog' }),
  ])
  if (!post) notFound()

  const category: CategoryKey = isCategoryKey(post.category) ? post.category : 'stories'
  const meta = CATEGORY_META[category]
  const dates = formatPostDate(post.publishedAt, locale)
  const toc = tocFromBody(post.body)
  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1600).height(800).fit('crop').auto('format').url()
    : null

  // Related: same category first, then fill from the rest.
  const others = allPosts.filter((p) => p.slug && p.slug !== slug)
  const related: CardPost[] = [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ]
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug ?? '',
      category: isCategoryKey(p.category) ? p.category : 'stories',
      title: p.title ?? '',
      excerpt: p.excerpt ?? '',
      shortDate: formatPostDate(p.publishedAt, locale).short,
      readMin: p.readMin ?? 5,
      coverUrl: p.coverImage?.asset
        ? urlFor(p.coverImage).width(800).height(500).fit('crop').auto('format').url()
        : null,
    }))

  const postUrl = localizedUrl(locale, `/blog/${slug}`)
  const articleLd = articleSchema({
    headline: post.title ?? 'Blog',
    description: post.excerpt ?? undefined,
    url: postUrl,
    image: coverUrl ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    locale,
  })
  const breadcrumbLd = breadcrumbSchema([
    { name: 'Home', url: localizedUrl(locale) },
    { name: 'Blog', url: localizedUrl(locale, '/blog') },
    { name: post.title ?? 'Article', url: postUrl },
  ])

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbLd]} />
      <ReadingBar />

      {/* ── Article head ── */}
      <section className="relative overflow-hidden border-b border-border bg-surface-2">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[35%] left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full opacity-60 blur-[90px]"
          style={{ background: 'radial-gradient(circle, rgba(138,50,224,0.16), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[820px] px-[clamp(20px,5vw,40px)] pb-[clamp(2rem,4vw,3rem)] pt-[calc(var(--navbar-height)+clamp(1.25rem,4vw,2.25rem))]">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[13px] text-text-muted">
            <Link href="/blog" className="font-medium transition-colors hover:text-purple">
              {t('breadcrumb')}
            </Link>
            <ChevronRight className="size-3.5 text-text-faint" />
            <span style={{ color: meta.pill.fg }} className="font-semibold">
              {t(`cat.${category}`)}
            </span>
          </nav>

          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span
              className="inline-flex items-center rounded-full px-[10px] py-[4px] text-[11.5px] font-bold"
              style={{ background: meta.pill.bg, color: meta.pill.fg }}
            >
              {t(`cat.${category}`)}
            </span>
            {dates.full && <span className="text-[13px] text-text-muted">{dates.full}</span>}
            <Dot />
            <span className="text-[13px] text-text-muted">{t('minRead', { n: post.readMin ?? 5 })}</span>
          </div>

          <h1 className="max-w-[20ch] font-display text-[clamp(2rem,4.6vw,3.25rem)] font-extrabold leading-[1.08] tracking-[var(--tracking-display)] text-text text-balance">
            {post.title}
          </h1>
          {post.lead && (
            <p className="mt-4 max-w-[58ch] text-[clamp(1.05rem,1.8vw,1.25rem)] leading-[1.55] text-text-muted text-balance">
              {post.lead}
            </p>
          )}

          <div className="mt-7 flex items-center">
            <ArticleShare label={t('share')} copiedLabel={t('copied')} />
          </div>
        </div>
      </section>

      {/* ── Hero cover ── */}
      <div className="mx-auto max-w-[1000px] px-[clamp(20px,5vw,40px)]">
        <BlogCover
          category={category}
          imageUrl={coverUrl}
          alt={post.coverImage?.alt ?? ''}
          iconScale={1.1}
          className="mt-[clamp(1.5rem,3vw,2.5rem)] aspect-[2/1] w-full rounded-[clamp(16px,3vw,24px)] shadow-[var(--shadow-md)]"
        />
      </div>

      {/* ── Body + TOC ── */}
      <div className="mx-auto max-w-[1000px] px-[clamp(20px,5vw,40px)] py-[clamp(2.5rem,5vw,4rem)]">
        <div className="grid grid-cols-1 items-start gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[1fr_220px]">
          <article id="article-prose">
            <PortableBody blocks={(post.body ?? []) as PostBody} />
          </article>
          {toc.length > 0 && <ArticleToc items={toc} label={t('onThisPage')} />}
        </div>
      </div>

      {/* ── Keep reading ── */}
      {related.length > 0 && (
        <section className="border-t border-border bg-surface-2">
          <div className="mx-auto max-w-[1120px] px-[clamp(20px,5vw,40px)] py-[clamp(3rem,6vw,5rem)]">
            <h2 className="mb-6 font-display text-[clamp(1.3rem,2.4vw,1.7rem)] font-extrabold tracking-[var(--tracking-tight)] text-text">
              {t('keepReading')}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard
                  key={p.slug}
                  post={p}
                  catLabel={t(`cat.${p.category}`)}
                  minLabel={t('min', { n: p.readMin })}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="px-[clamp(20px,5vw,40px)] py-[clamp(3rem,6vw,5rem)]">
        <div
          className="relative mx-auto max-w-[820px] overflow-hidden rounded-[24px] border border-white/10 px-[clamp(24px,4vw,52px)] py-[clamp(32px,5vw,52px)] text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]"
          style={{ background: 'linear-gradient(165deg, #221C2E 0%, #1A1620 100%)' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[40%] left-1/2 h-[360px] w-[620px] -translate-x-1/2 rounded-full blur-[80px]"
            style={{ background: 'radial-gradient(circle, rgba(138,50,224,0.45), transparent 70%)' }}
          />
          <div className="relative">
            <Image
              src="/assets/logo/logo.svg"
              alt=""
              width={56}
              height={56}
              aria-hidden
              className="mx-auto mb-5 size-[52px] rounded-[14px] shadow-[0_8px_24px_rgba(138,50,224,0.34)]"
            />
            <h2 className="mx-auto max-w-[22ch] font-display text-[clamp(1.6rem,3.2vw,2.3rem)] font-extrabold leading-[1.12] tracking-[var(--tracking-tight)] text-white text-balance">
              {t('ctaTitle')}
            </h2>
            <p className="mx-auto mt-3 max-w-[50ch] text-[15px] leading-[1.6] text-white/65">{t('ctaBody')}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/pricing"
                className="inline-flex h-[50px] items-center gap-2 rounded-full bg-purple px-7 text-[15px] font-semibold text-white transition-[background,transform] duration-200 hover:bg-purple-hover active:scale-[0.97]"
              >
                {t('ctaPrimary')}
                <ArrowRight className="size-[18px]" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-[50px] items-center rounded-full border border-white/20 bg-white/[0.06] px-7 text-[15px] font-semibold text-white transition-colors duration-200 hover:border-white/35 hover:bg-white/[0.12]"
              >
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
