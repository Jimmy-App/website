import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

export const pricing = defineType({
  name: "pricing",
  title: "Pricing",
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
      name: "pricingPage",
      title: "Pricing Page Settings",
      type: "object",
      fields: [
        defineField({
          name: "standardPlanCtaLabel",
          title: "Standard Plan CTA Label",
          type: "string",
          initialValue: "Join Waitlist",
        }),
        defineField({
          name: "addOnLabel",
          title: "Add-on Label",
          type: "string",
          initialValue: "Add-on",
        }),
        defineField({
          name: "featuresHeadingLabel",
          title: "Features Heading Label",
          type: "string",
          initialValue: "Features",
        }),
        defineField({
          name: "includedInLabel",
          title: "Included In Label",
          type: "string",
          initialValue: "Included in",
        }),
        defineField({
          name: "clientCapacityTitle",
          title: "Client Capacity Title",
          type: "string",
          initialValue: "Client Capacity",
        }),
        defineField({
          name: "clientCapacityDescription",
          title: "Client Capacity Description",
          type: "string",
          initialValue: "Maximum active clients per plan",
        }),
        defineField({
          name: "customPlan",
          title: "Custom Plan Card",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              initialValue: "The Brand",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              initialValue:
                "Your own white-label app in the App Store. Fully branded for you.",
            }),
            defineField({
              name: "price",
              title: "Price Label",
              type: "string",
              description: "Optional. Leave empty if not needed.",
            }),
            defineField({
              name: "period",
              title: "Period",
              type: "string",
            }),
            defineField({
              name: "clients",
              title: "Clients",
              type: "string",
              initialValue: "Unlimited",
            }),
            defineField({
              name: "ctaLabel",
              title: "CTA Label",
              type: "string",
              initialValue: "Contact Sales",
            }),
            defineField({
              name: "ctaHref",
              title: "CTA Href",
              type: "string",
              description:
                "Relative or absolute URL. Leave empty to use /for-coaches.",
            }),
          ],
        }),
      ],
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
              name: "ctaLabel",
              title: "CTA Label",
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
