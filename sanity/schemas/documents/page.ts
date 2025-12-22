import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";
import { isUniqueByLanguage } from "../utils/isUniqueByLanguage";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: isUniqueByLanguage,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "blocks",
      title: "Blocks",
      type: "array",
      of: [{ type: "textBlock" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: title || "Untitled page",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
