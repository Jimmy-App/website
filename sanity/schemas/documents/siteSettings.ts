import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Site Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "domain",
      title: "Domain",
      type: "url",
      description: "Primary site URL, used for canonical metadata.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
    }),
    defineField({
      name: "supportedLocales",
      title: "Supported Locales",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["en", "fr", "es", "ua"],
    }),
    defineField({
      name: "defaultLocale",
      title: "Default Locale",
      type: "string",
      initialValue: "en",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: title || "Site Settings",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
