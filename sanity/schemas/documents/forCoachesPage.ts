import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

const iconOptions = [
  { title: "Layers", value: "layers" },
  { title: "Wifi Off", value: "wifiOff" },
  { title: "Piggy Bank", value: "piggyBank" },
];

export const forCoachesPage = defineType({
  name: "forCoachesPage",
  title: "For Coaches Page",
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
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "points",
          title: "Cards",
          type: "array",
          of: [
            {
              type: "object",
              name: "forCoachesWhyPoint",
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
              name: "forCoachesFeatureItem",
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
          name: "titleLineOne",
          title: "Title Line One",
          type: "string",
        }),
        defineField({
          name: "titleLineTwo",
          title: "Title Line Two",
          type: "string",
        }),
        defineField({
          name: "bodyPrefix",
          title: "Body Prefix",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "bodyHighlightOne",
          title: "Body Highlight One",
          type: "string",
        }),
        defineField({
          name: "bodyMiddle",
          title: "Body Middle",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "bodyHighlightTwo",
          title: "Body Highlight Two",
          type: "string",
        }),
        defineField({
          name: "bodySuffix",
          title: "Body Suffix",
          type: "string",
        }),
        defineField({
          name: "bodyHighlightThree",
          title: "Body Highlight Three",
          type: "string",
        }),
        defineField({
          name: "bodyEnd",
          title: "Body End",
          type: "string",
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
          name: "helperText",
          title: "Helper Text",
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
        title: title || "For Coaches Page",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
