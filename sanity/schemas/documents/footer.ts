import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

export const footer = defineType({
  name: "footer",
  title: "Footer",
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
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "navItem" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: title || "Footer",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
