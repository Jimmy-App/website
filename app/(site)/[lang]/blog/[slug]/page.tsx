import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";

import PortableTextRenderer from "@/components/PortableTextRenderer";
import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import type { SeoFields } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postBySlugQuery } from "@/sanity/lib/queries";

type PostData = {
  title?: string;
  slug?: string;
  excerpt?: string;
  publishDate?: string;
  author?: { name?: string } | null;
  categories?: { title?: string }[];
  body?: PortableTextBlock[] | null;
  seo?: SeoFields | null;
};

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  const post = await sanityFetch<PostData>({
    query: postBySlugQuery,
    params: { language: lang, slug },
  });

  const path = `${localeBasePath(lang)}/blog/${slug}`;

  return buildMetadata({
    title: post?.title || "Blog post",
    description: post?.excerpt || "",
    seo: post?.seo,
    path,
    locale: lang,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { lang, slug } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const post = await sanityFetch<PostData>({
    query: postBySlugQuery,
    params: { language: lang, slug },
  });

  if (!post) {
    return (
      <section>
        <h1>Blog post</h1>
        <p>Create a post document in Sanity to render this page.</p>
      </section>
    );
  }

  return (
    <article>
      <h1>{post.title || "Blog post"}</h1>
      {post.publishDate ? <p>Published: {post.publishDate}</p> : null}
      {post.author?.name ? <p>Author: {post.author.name}</p> : null}
      {post.categories?.length ? (
        <p>
          Categories: {post.categories.map((category) => category.title).join(", ")}
        </p>
      ) : null}
      {post.excerpt ? <p>{post.excerpt}</p> : null}
      <PortableTextRenderer value={post.body} />
      <p>
        <Link href={`${localeBasePath(lang)}/blog`}>Back to blog</Link>
      </p>
    </article>
  );
}
