import Link from "next/link";
import { notFound } from "next/navigation";

import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { docsByLanguageQuery } from "@/sanity/lib/queries";

type DocListItem = {
  _id: string;
  title?: string;
  slug?: string;
  order?: number;
};

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  const path = `${localeBasePath(lang)}/docs`;

  return buildMetadata({
    title: "Docs",
    description: "Documentation index page.",
    path,
  });
}

export default async function DocsIndexPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const docs = await sanityFetch<DocListItem[]>({
    query: docsByLanguageQuery,
    params: { language: lang },
  });

  return (
    <section>
      <h1>Docs</h1>
      {docs?.length ? (
        <ul>
          {docs.map((doc) => (
            <li key={doc._id}>
              <Link
                href={`${localeBasePath(lang)}/docs/${doc.slug}`}
              >
                {doc.title || "Untitled doc"}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Create doc pages in Sanity to populate the docs list.</p>
      )}
    </section>
  );
}
