import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

const iconOptions = [
  { title: "Zoom In", value: "zoomIn" },
  { title: "Clock", value: "clock3" },
  { title: "Wifi Off", value: "wifiOff" },
];

export const forClientsPage = defineType({
  name: "forClientsPage",
  title: "For Clients Page",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({ name: "badgeText", title: "Badge Text", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "titleHighlight",
          title: "Title Highlight",
          type: "string",
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "primaryButtonLabel",
          title: "Primary Button Label",
          type: "string",
        }),
        defineField({
          name: "secondaryButtonLabel",
          title: "Secondary Button Label",
          type: "string",
        }),
        defineField({
          name: "imageAlt",
          title: "Hero Image Alt",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "why",
      title: "Why Section",
      type: "object",
      fields: [
        defineField({ name: "badgeText", title: "Badge Text", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "points",
          title: "Cards",
          type: "array",
          of: [
            {
              type: "object",
              name: "forClientsWhyPoint",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({
                  name: "body",
                  title: "Body",
                  type: "text",
                  rows: 3,
                }),
                defineField({
                  name: "icon",
                  title: "Icon",
                  type: "string",
                  options: {
                    list: iconOptions,
                    layout: "dropdown",
                  },
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "features",
      title: "Features Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "items",
          title: "Feature Items",
          type: "array",
          of: [
            {
              type: "object",
              name: "forClientsFeatureItem",
              fields: [
                defineField({
                  name: "anchorId",
                  title: "Anchor ID",
                  type: "string",
                  description: "Used for #hash navigation links.",
                }),
                defineField({
                  name: "category",
                  title: "Category Label",
                  type: "string",
                }),
                defineField({
                  name: "headline",
                  title: "Headline",
                  type: "string",
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                  rows: 3,
                }),
                defineField({
                  name: "imageSrc",
                  title: "Image Source",
                  type: "string",
                  description: "Use a public relative path, for example /assets/...",
                }),
                defineField({
                  name: "imageAlt",
                  title: "Image Alt",
                  type: "string",
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA Section",
      type: "object",
      fields: [
        defineField({ name: "badgeText", title: "Badge Text", type: "string" }),
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "primaryButtonLabel",
          title: "Primary Button Label",
          type: "string",
        }),
        defineField({
          name: "secondaryButtonLabel",
          title: "Secondary Button Label",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: title || "For Clients Page",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
