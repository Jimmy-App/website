import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
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
      name: "brandLabel",
      title: "Brand Label",
      type: "string",
    }),
    defineField({
      name: "mobileHelperText",
      title: "Mobile CTA Helper Text",
      type: "string",
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
        title: title || "Navigation",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
