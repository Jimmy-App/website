import type { Metadata } from "next";

import { getSiteUrl } from "./site";

type SeoFields = {
  title?: string | null;
  description?: string | null;
  noIndex?: boolean | null;
};

type MetadataInput = {
  title?: string | null;
  description?: string | null;
  seo?: SeoFields | null;
  path?: string;
};

export function buildMetadata({ title, description, seo, path }: MetadataInput) {
  const resolvedTitle = seo?.title || title || "";
  const resolvedDescription = seo?.description || description || "";
  const siteUrl = getSiteUrl();
  const canonical = path ? `${siteUrl}${path}` : siteUrl;

  const metadata: Metadata = {
    title: resolvedTitle || undefined,
    description: resolvedDescription || undefined,
    alternates: { canonical },
  };

  if (seo?.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}
