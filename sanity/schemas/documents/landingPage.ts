import { defineField, defineType } from "sanity";

import { languageField } from "../fields/language";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
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
      name: "cta",
      title: "CTA Labels",
      type: "object",
      fields: [
        defineField({
          name: "waitlistLabel",
          title: "Waitlist Button Label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "badgeText",
          title: "Badge Text",
          type: "string",
        }),
        defineField({
          name: "title",
          title: "Title",
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
          description: "Use {brand} to inject the brand label.",
        }),
        defineField({
          name: "inputPlaceholder",
          title: "Email Input Placeholder",
          type: "string",
        }),
        defineField({
          name: "socialProofText",
          title: "Social Proof Text",
          type: "string",
        }),
        defineField({
          name: "successMessage",
          title: "Success Message",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "problem",
      title: "Problem Section",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
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
          name: "cards",
          title: "Cards",
          type: "array",
          of: [
            {
              type: "object",
              name: "problemCard",
              fields: [
                defineField({
                  name: "key",
                  title: "Key",
                  type: "string",
                  options: {
                    list: [
                      { title: "Spreadsheet", value: "spreadsheet" },
                      { title: "Enterprise", value: "enterprise" },
                      { title: "Jimmy", value: "jimmy" },
                    ],
                  },
                }),
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                }),
                defineField({
                  name: "body",
                  title: "Body",
                  type: "text",
                  rows: 3,
                }),
                defineField({
                  name: "badge",
                  title: "Badge",
                  type: "string",
                }),
                defineField({
                  name: "ctaLabel",
                  title: "CTA Label",
                  type: "string",
                }),
                defineField({
                  name: "uiActionLabel",
                  title: "UI Action Label",
                  type: "string",
                }),
                defineField({
                  name: "uiStatusLabel",
                  title: "UI Status Label",
                  type: "string",
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "coachFeatures",
      title: "Coach Features",
      type: "object",
      fields: [
        defineField({
          name: "badgeText",
          title: "Badge Text",
          type: "string",
        }),
        defineField({
          name: "title",
          title: "Title",
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
          name: "builder",
          title: "Builder Feature",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
            defineField({ name: "weekLabel", title: "Week Label", type: "string" }),
            defineField({
              name: "exerciseItems",
              title: "Exercise Items",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "exerciseDetail",
              title: "Exercise Detail",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "payments",
          title: "Payments Feature",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
            defineField({
              name: "revenueLabel",
              title: "Revenue Label",
              type: "string",
            }),
            defineField({
              name: "revenueDelta",
              title: "Revenue Delta",
              type: "string",
            }),
            defineField({
              name: "revenueAmount",
              title: "Revenue Amount",
              type: "string",
            }),
            defineField({
              name: "notificationTitle",
              title: "Notification Title",
              type: "string",
            }),
            defineField({
              name: "notificationBody",
              title: "Notification Body",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "chat",
          title: "Chat Feature",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
            defineField({
              name: "messageText",
              title: "Message Text",
              type: "string",
            }),
            defineField({
              name: "avatarInitials",
              title: "Avatar Initials",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "health",
          title: "Health Feature",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
            defineField({
              name: "stats",
              title: "Stats",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "featureStat",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string" }),
                    defineField({ name: "value", title: "Value", type: "string" }),
                  ],
                },
              ],
            }),
            defineField({
              name: "syncedLabel",
              title: "Synced Label",
              type: "string",
            }),
            defineField({
              name: "appleHealthAlt",
              title: "Apple Health Alt Text",
              type: "string",
            }),
            defineField({
              name: "googleFitAlt",
              title: "Google Fit Alt Text",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "video",
          title: "Video Feature",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
          ],
        }),
        defineField({
          name: "ctaLabel",
          title: "CTA Label",
          type: "string",
        }),
        defineField({
          name: "ctaHelperText",
          title: "CTA Helper Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "clientExperience",
      title: "Client Experience",
      type: "object",
      fields: [
        defineField({
          name: "badgeText",
          title: "Badge Text",
          type: "string",
        }),
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
          name: "logging",
          title: "Intuitive Feature Card",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
          ],
        }),
        defineField({
          name: "progress",
          title: "Progress Feature Card",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
          ],
        }),
        defineField({
          name: "workouts",
          title: "Workouts Feature Card",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
          ],
        }),
        defineField({
          name: "chat",
          title: "Chats Feature Card",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
          ],
        }),
        defineField({
          name: "ctaLabel",
          title: "CTA Label",
          type: "string",
        }),
        defineField({
          name: "ctaHelperText",
          title: "CTA Helper Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "manifesto",
      title: "Manifesto",
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
          name: "bodyPrefix",
          title: "Body Prefix",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "bodyEmphasis",
          title: "Body Emphasis",
          type: "string",
        }),
        defineField({
          name: "bodyMiddle",
          title: "Body Middle",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "bodyStrong",
          title: "Body Strong",
          type: "string",
        }),
        defineField({
          name: "inputPlaceholder",
          title: "Email Input Placeholder",
          type: "string",
        }),
        defineField({
          name: "socialProofText",
          title: "Social Proof Text",
          type: "string",
        }),
        defineField({
          name: "successMessage",
          title: "Success Message",
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
        title: title || "Landing Page",
        subtitle: language ? `Locale: ${language}` : "Locale not set",
      };
    },
  },
});
