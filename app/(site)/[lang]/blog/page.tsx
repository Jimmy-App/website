import Link from "next/link";
import { notFound } from "next/navigation";

import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postsByLanguageQuery } from "@/sanity/lib/queries";

type PostListItem = {
  _id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  publishDate?: string;
};

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  const path = `${localeBasePath(lang)}/blog`;

  return buildMetadata({
    title: "Blog",
    description: "Blog index page.",
    path,
  });
}

export default async function BlogIndexPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const posts = await sanityFetch<PostListItem[]>({
    query: postsByLanguageQuery,
    params: { language: lang },
  });

  return (
    <section>
      <h1>Blog</h1>
      {posts?.length ? (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <h2>
                <Link
                  href={`${localeBasePath(lang)}/blog/${post.slug}`}
                >
                  {post.title || "Untitled post"}
                </Link>
              </h2>
              {post.excerpt ? <p>{post.excerpt}</p> : null}
              {post.publishDate ? <p>{post.publishDate}</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p>Add blog posts in Sanity to populate this list.</p>
      )}
    </section>
  );
}
