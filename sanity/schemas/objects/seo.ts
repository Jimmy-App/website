import { defineField, defineType } from "sanity";
import type { ConditionalPropertyCallbackContext, SanityDocument } from "sanity";

type DocumentWithLanguage = SanityDocument & {
  language?: string;
};

const normalizeLocale = (locale?: string) => (locale === "ua" ? "uk" : locale);

const hideForLocale = (locale: string) => {
  return (context: ConditionalPropertyCallbackContext) => {
    const document = context.document as DocumentWithLanguage | undefined;
    const documentLocale = normalizeLocale(document?.language);
    if (!documentLocale) {
      return false;
    }
    return documentLocale !== locale;
  };
};

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Meta Title",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "string",
          validation: (Rule) =>
            Rule.max(60).warning("Meta title should be 60 characters or less."),
          hidden: hideForLocale("en"),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "string",
          validation: (Rule) =>
            Rule.max(60).warning("Meta title should be 60 characters or less."),
          hidden: hideForLocale("es"),
        }),
        defineField({
          name: "fr",
          title: "French",
          type: "string",
          validation: (Rule) =>
            Rule.max(60).warning("Meta title should be 60 characters or less."),
          hidden: hideForLocale("fr"),
        }),
        defineField({
          name: "uk",
          title: "Ukrainian",
          type: "string",
          validation: (Rule) =>
            Rule.max(60).warning("Meta title should be 60 characters or less."),
          hidden: hideForLocale("uk"),
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "text",
          rows: 3,
          validation: (Rule) =>
            Rule.max(160).warning(
              "Meta description should be 160 characters or less.",
            ),
          hidden: hideForLocale("en"),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "text",
          rows: 3,
          validation: (Rule) =>
            Rule.max(160).warning(
              "Meta description should be 160 characters or less.",
            ),
          hidden: hideForLocale("es"),
        }),
        defineField({
          name: "fr",
          title: "French",
          type: "text",
          rows: 3,
          validation: (Rule) =>
            Rule.max(160).warning(
              "Meta description should be 160 characters or less.",
            ),
          hidden: hideForLocale("fr"),
        }),
        defineField({
          name: "uk",
          title: "Ukrainian",
          type: "text",
          rows: 3,
          validation: (Rule) =>
            Rule.max(160).warning(
              "Meta description should be 160 characters or less.",
            ),
          hidden: hideForLocale("uk"),
        }),
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
