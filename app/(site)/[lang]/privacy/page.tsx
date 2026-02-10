import { notFound } from "next/navigation";

import { isSupportedLocale, localeBasePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import type { SeoFields } from "@/lib/seo";
import LegalNavbar from "@/components/landing/LegalNavbar";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageBySlugQuery } from "@/sanity/lib/queries";

type PageData = {
  title?: string;
  seo?: SeoFields | null;
  blocks?: { _key?: string; _type?: string; heading?: string; body?: string }[];
};

type PageProps = {
  params: Promise<{ lang: string }>;
};

type TocEntry = {
  id: string;
  heading: string;
  index: number;
};

function toAnchorId(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return normalized || "section";
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    return {};
  }

  const page = await sanityFetch<PageData>({
    query: pageBySlugQuery,
    params: { language: lang, slug: "privacy" },
  });

  const path = `${localeBasePath(lang)}/privacy`;

  return buildMetadata({
    title: page?.title || "Privacy Policy",
    seo: page?.seo,
    path,
    locale: lang,
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const page = await sanityFetch<PageData>({
    query: pageBySlugQuery,
    params: { language: lang, slug: "privacy" },
  });

  if (!page) {
    return (
      <>
        <LegalNavbar lang={lang} />
        <section className="mx-auto w-full max-w-4xl px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-32">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-base text-slate-600">
            Create a Privacy Policy page in Sanity to render this content.
          </p>
        </section>
      </>
    );
  }

  const tocEntries: TocEntry[] = (page.blocks || [])
    .map((block, index) => {
      const heading = block.heading?.trim() || "";
      if (!heading) return null;

      return {
        id: `${toAnchorId(heading)}-${index + 1}`,
        heading,
        index,
      };
    })
    .filter((value): value is TocEntry => value !== null);
  const headingIdByIndex = new Map(tocEntries.map((entry) => [entry.index, entry.id]));
  const hasToc = tocEntries.length > 0;

  return (
    <>
      <LegalNavbar lang={lang} />
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        {page.blocks?.length ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            {hasToc ? (
              <aside className="hidden lg:col-span-3 lg:block">
                <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-500">
                    On this page
                  </p>
                  <nav aria-label="Privacy sections" className="mt-3 flex flex-col gap-1.5">
                    {tocEntries.map((entry) => (
                      <a
                        key={entry.id}
                        href={`#${entry.id}`}
                        className="rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                      >
                        {entry.heading}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            ) : null}

            <div className={hasToc ? "lg:col-span-9" : "lg:col-span-12"}>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {page.title || "Privacy Policy"}
              </h1>
              <div className="mt-8 space-y-8">
                {page.blocks.map((block, blockIndex) => (
                  <section
                    key={block._key || block.heading}
                    id={headingIdByIndex.get(blockIndex)}
                    className="scroll-mt-32 space-y-3 lg:scroll-mt-36"
                  >
                    {block.heading ? (
                      <h2 className="text-xl font-semibold text-slate-900">
                        {block.heading}
                      </h2>
                    ) : null}
                    {block.body ? (
                      <p className="whitespace-pre-line text-base leading-relaxed text-slate-700">
                        {block.body}
                      </p>
                    ) : null}
                  </section>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {page.title || "Privacy Policy"}
            </h1>
            <p className="mt-6 text-base text-slate-600">
              Add structured blocks to the Privacy Policy page in Sanity.
            </p>
          </>
        )}
      </section>
    </>
  );
}
