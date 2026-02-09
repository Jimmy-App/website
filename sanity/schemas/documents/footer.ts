import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "brandLabel",
      title: "Brand Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Use {year} to insert the current year.",
    }),
  ],
  preview: {
    select: {
      brandLabel: "brandLabel",
      language: "language",
    },
    prepare({ brandLabel, language }) {
      return {
        title: brandLabel || "Footer",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
