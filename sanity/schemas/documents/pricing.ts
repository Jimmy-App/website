import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

export const pricing = defineType({
  name: "pricing",
  title: "Pricing",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pricingSecondaryLabel",
      title: "Pricing Secondary Link Label",
      type: "string",
      initialValue: "See all pricing plans",
    }),
    defineField({
      name: "badgeText",
      title: "Badge Text",
      type: "string",
    }),
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
      name: "popularBadgeLabel",
      title: "Popular Badge Label",
      type: "string",
    }),
    defineField({
      name: "monthlyLabel",
      title: "Monthly Toggle Label",
      type: "string",
    }),
    defineField({
      name: "yearlyLabel",
      title: "Yearly Toggle Label",
      type: "string",
    }),
    defineField({
      name: "yearlySaveLabel",
      title: "Yearly Save Label",
      type: "string",
    }),
    defineField({
      name: "yearlyFreeMonths",
      title: "Yearly Free Months",
      type: "number",
      initialValue: 2,
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "usd",
      options: {
        list: [
          { title: "US Dollar (USD)", value: "usd" },
          { title: "Euro (EUR)", value: "eur" },
          { title: "British Pound (GBP)", value: "gbp" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "secondaryHelperText",
      title: "Secondary Helper Text",
      type: "string",
    }),
    defineField({
      name: "plans",
      title: "Plans",
      type: "array",
      of: [
        {
          type: "object",
          name: "pricingPlan",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({
              name: "prices",
              title: "Prices by Currency",
              type: "object",
              fields: [
                defineField({ name: "usd", title: "USD", type: "number" }),
                defineField({ name: "eur", title: "EUR", type: "number" }),
                defineField({ name: "gbp", title: "GBP", type: "number" }),
              ],
            }),
            defineField({ name: "period", title: "Period", type: "string" }),
            defineField({ name: "clients", title: "Clients", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
            defineField({
              name: "isFeatured",
              title: "Is Featured",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "planFeature",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                    }),
                    defineField({
                      name: "isAddon",
                      title: "Is Add-on",
                      type: "boolean",
                      initialValue: false,
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
      currency: "currency",
    },
    prepare({ title, language, currency }) {
      const currencyLabel = currency ? currency.toUpperCase() : "USD";
      return {
        title: title || "Pricing",
        subtitle: `${language ? `Locale: ${language}` : "Locale not set"} • ${currencyLabel}`,
      };
    },
  },
});
