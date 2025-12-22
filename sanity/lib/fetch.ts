import type { QueryParams } from "next-sanity";

import { client } from "./client";
import { hasValidConfig } from "./config";

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
};

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: SanityFetchOptions): Promise<QueryResponse> {
  if (!hasValidConfig) {
    return null as QueryResponse;
  }

  return client.fetch(query, params, {
    next: { revalidate, tags },
  });
}
