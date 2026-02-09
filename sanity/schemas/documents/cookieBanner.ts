import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

export const cookieBanner = defineType({
  name: "cookieBanner",
  title: "Cookie Banner",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Cookie Preferences",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      initialValue: "We use cookies for analytics and marketing.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "policyLinkLabel",
      title: "Policy Link Label",
      type: "string",
      initialValue: "Read Cookie Policy",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rejectButtonLabel",
      title: "Reject Button Label",
      type: "string",
      initialValue: "Reject All",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "acceptButtonLabel",
      title: "Accept Button Label",
      type: "string",
      initialValue: "Accept All",
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
        title: title || "Cookie Banner",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
