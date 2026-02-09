import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

const planOptionList = [
  { title: "The Starter", value: "starter" },
  { title: "The Scale", value: "scale" },
  { title: "The Elite", value: "elite" },
  { title: "The Brand", value: "brand" },
] as const;

export const pricingFeatures = defineType({
  name: "pricingFeatures",
  title: "Pricing Features",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Pricing Features",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rows",
      title: "Feature Rows",
      type: "array",
      of: [
        {
          type: "object",
          name: "pricingFeatureRow",
          fields: [
            defineField({
              name: "title",
              title: "Feature Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
            defineField({
              name: "includedPlans",
              title: "Included In Plans",
              description: "Select plans where this feature is included.",
              type: "array",
              of: [{ type: "string" }],
              options: {
                list: planOptionList.map((option) => ({
                  title: option.title,
                  value: option.value,
                })),
              },
            }),
            defineField({
              name: "addOnPlans",
              title: "Add-on In Plans",
              description:
                "Optional. Select plans where this feature is available as add-on.",
              type: "array",
              of: [{ type: "string" }],
              options: {
                list: planOptionList.map((option) => ({
                  title: option.title,
                  value: option.value,
                })),
              },
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as
                    | { includedPlans?: string[] }
                    | undefined;
                  const includedPlans = parent?.includedPlans || [];
                  const addOnPlans =
                    Array.isArray(value)
                      ? value.filter((plan): plan is string => typeof plan === "string")
                      : [];
                  const overlap = addOnPlans.filter((plan) =>
                    includedPlans.includes(plan),
                  );

                  if (overlap.length > 0) {
                    return "A plan cannot be both Included and Add-on for the same feature.";
                  }

                  return true;
                }),
            }),
          ],
          preview: {
            select: {
              title: "title",
              description: "description",
            },
            prepare({ title, description }) {
              return {
                title: title || "Feature row",
                subtitle: description || "No description",
              };
            },
          },
        },
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
        title: title || "Pricing Features",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
