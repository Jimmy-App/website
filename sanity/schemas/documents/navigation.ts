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
    defineField({
      name: "featuresDropdown",
      title: "Features Dropdown",
      type: "object",
      fields: [
        defineField({
          name: "coaches",
          title: "For Coaches Column",
          type: "object",
          fields: [
            defineField({
              name: "badgeLabel",
              title: "Badge Label",
              type: "string",
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [{ type: "navItem" }],
            }),
            defineField({
              name: "viewAllLabel",
              title: "View All Label",
              type: "string",
            }),
            defineField({
              name: "viewAllHref",
              title: "View All Href",
              type: "string",
              description: "Relative or absolute URL.",
            }),
          ],
        }),
        defineField({
          name: "clients",
          title: "For Clients Column",
          type: "object",
          fields: [
            defineField({
              name: "badgeLabel",
              title: "Badge Label",
              type: "string",
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [{ type: "navItem" }],
            }),
            defineField({
              name: "viewAllLabel",
              title: "View All Label",
              type: "string",
            }),
            defineField({
              name: "viewAllHref",
              title: "View All Href",
              type: "string",
              description: "Relative or absolute URL.",
            }),
          ],
        }),
        defineField({
          name: "platform",
          title: "Platform Column",
          type: "object",
          fields: [
            defineField({
              name: "badgeText",
              title: "Badge Text",
              type: "string",
            }),
            defineField({
              name: "headline",
              title: "Headline",
              type: "string",
            }),
            defineField({
              name: "subheadline",
              title: "Subheadline",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "buttonLabel",
              title: "Button Label",
              type: "string",
            }),
            defineField({
              name: "buttonHref",
              title: "Button Href",
              type: "string",
              description: "Relative or absolute URL.",
            }),
          ],
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
        title: title || "Navigation",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
