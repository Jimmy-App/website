import type { SlugIsUniqueValidator } from "sanity";

import { apiVersion } from "../../lib/config";

export const isUniqueByLanguage: SlugIsUniqueValidator = async (
  value,
  context,
) => {
  const { document, getClient } = context;
  const currentValue =
    typeof value === "string" ? value : (value as { current?: string })?.current;
  const language = document?.language;

  if (!currentValue || !language || !document?._type) {
    return true;
  }

  const client = getClient({ apiVersion });
  const id = document._id.replace(/^drafts\./, "");

  const query = `!defined(*[
    _type == $type &&
    slug.current == $slug &&
    language == $language &&
    !(_id in [$draftId, $publishedId])
  ][0]._id)`;

  const params = {
    type: document._type,
    slug: currentValue,
    language,
    draftId: `drafts.${id}`,
    publishedId: id,
  };

  return client.fetch(query, params);
};
