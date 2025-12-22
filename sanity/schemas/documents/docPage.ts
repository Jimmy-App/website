import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";
import { isUniqueByLanguage } from "../utils/isUniqueByLanguage";

export const docPage = defineType({
  name: "docPage",
  title: "Doc Page",
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
      description: "Use nested paths like getting-started/intro.",
      options: {
        source: "title",
        maxLength: 200,
        isUnique: isUniqueByLanguage,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
    defineField({
      name: "parent",
      title: "Parent",
      type: "reference",
      to: [{ type: "docPage" }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: title || "Untitled doc page",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
