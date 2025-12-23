import { notFound } from "next/navigation";

import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageBySlugQuery } from "@/sanity/lib/queries";

type PageData = {
  title?: string;
  seo?: { title?: string; description?: string; noIndex?: boolean } | null;
  blocks?: { _key?: string; _type?: string; heading?: string; body?: string }[];
};

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  const page = await sanityFetch<PageData>({
    query: pageBySlugQuery,
    params: { language: lang, slug: "terms" },
  });

  const path = `${localeBasePath(lang)}/terms`;

  return buildMetadata({
    title: page?.title || "Terms",
    description: page?.seo?.description || "",
    seo: page?.seo,
    path,
  });
}

export default async function TermsPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const page = await sanityFetch<PageData>({
    query: pageBySlugQuery,
    params: { language: lang, slug: "terms" },
  });

  if (!page) {
    return (
      <section>
        <h1>Terms</h1>
        <p>Create a Terms page in Sanity to render this content.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>{page.title || "Terms"}</h1>
      {page.blocks?.length ? (
        <div>
          {page.blocks.map((block) => (
            <section key={block._key || block.heading}>
              {block.heading ? <h2>{block.heading}</h2> : null}
              {block.body ? <p>{block.body}</p> : null}
            </section>
          ))}
        </div>
      ) : (
        <p>Add structured blocks to the Terms page in Sanity.</p>
      )}
    </section>
  );
}
