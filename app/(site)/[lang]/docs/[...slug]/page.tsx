import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";

import PortableTextRenderer from "@/components/PortableText";
import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { docPageBySlugQuery } from "@/sanity/lib/queries";

type DocPageData = {
  title?: string;
  slug?: string;
  order?: number;
  parent?: { title?: string; slug?: string } | null;
  body?: PortableTextBlock[] | null;
  seo?: { title?: string; description?: string; noIndex?: boolean } | null;
};

type PageProps = {
  params: Promise<{ lang: string; slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  const slugPath = slug.join("/");
  const docPage = await sanityFetch<DocPageData>({
    query: docPageBySlugQuery,
    params: { language: lang, slug: slugPath },
  });

  const path = `${localeBasePath(lang)}/docs/${slugPath}`;

  return buildMetadata({
    title: docPage?.title || "Doc page",
    description: docPage?.seo?.description || "",
    seo: docPage?.seo,
    path,
  });
}

export default async function DocPage({ params }: PageProps) {
  const { lang, slug } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const slugPath = slug.join("/");
  const docPage = await sanityFetch<DocPageData>({
    query: docPageBySlugQuery,
    params: { language: lang, slug: slugPath },
  });

  if (!docPage) {
    return (
      <section>
        <h1>Doc page</h1>
        <p>Create a doc page in Sanity to render this content.</p>
      </section>
    );
  }

  return (
    <article>
      <h1>{docPage.title || "Doc page"}</h1>
      {docPage.parent?.title ? (
        <p>
          Parent: {docPage.parent.title} ({docPage.parent.slug})
        </p>
      ) : null}
      <PortableTextRenderer value={docPage.body} />
      <p>
        <Link href={`${localeBasePath(lang)}/docs`}>Back to docs</Link>
      </p>
    </article>
  );
}
