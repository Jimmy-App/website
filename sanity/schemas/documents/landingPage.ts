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
        defineField({
          name: "pricingSecondaryLabel",
          title: "Pricing Secondary Link Label",
          type: "string",
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
          name: "mockupUrlLabel",
          title: "Mockup URL Label",
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
                  name: "uiAvatarInitials",
                  title: "UI Avatar Initials",
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
          title: "Logging Feature",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
            defineField({ name: "tagLabel", title: "Tag Label", type: "string" }),
            defineField({
              name: "uiExerciseName",
              title: "UI Exercise Name",
              type: "string",
            }),
            defineField({
              name: "uiSetLabel",
              title: "UI Set Label",
              type: "string",
            }),
            defineField({
              name: "uiWeightLabel",
              title: "UI Weight Label",
              type: "string",
            }),
            defineField({
              name: "uiIntensityLowLabel",
              title: "UI Intensity Low Label",
              type: "string",
            }),
            defineField({
              name: "uiIntensityHighLabel",
              title: "UI Intensity High Label",
              type: "string",
            }),
            defineField({
              name: "uiRpeLabel",
              title: "UI RPE Label",
              type: "string",
            }),
            defineField({
              name: "uiButtonLabel",
              title: "UI Button Label",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "timer",
          title: "Timer Feature",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
            defineField({
              name: "uiRestLabel",
              title: "UI Rest Label",
              type: "string",
            }),
            defineField({
              name: "uiTimerValue",
              title: "UI Timer Value",
              type: "string",
            }),
            defineField({
              name: "uiLockLabel",
              title: "UI Lock Label",
              type: "string",
            }),
            defineField({
              name: "uiLockValue",
              title: "UI Lock Value",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "offline",
          title: "Offline Feature",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
            defineField({
              name: "uiStatusLabel",
              title: "UI Status Label",
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
              name: "uiVoiceNoteLabel",
              title: "UI Voice Note Label",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "sync",
          title: "Sync Feature",
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
                  name: "syncStat",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string" }),
                    defineField({ name: "value", title: "Value", type: "string" }),
                  ],
                },
              ],
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
      ],
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "object",
      fields: [
        defineField({ name: "badgeText", title: "Badge Text", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "titleHighlight",
          title: "Title Highlight",
          type: "string",
        }),
        defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 3 }),
        defineField({
          name: "popularBadgeLabel",
          title: "Popular Badge Label",
          type: "string",
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
                defineField({ name: "price", title: "Price", type: "string" }),
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
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
        defineField({
          name: "brandLabel",
          title: "Brand Label",
          type: "string",
        }),
        defineField({
          name: "copyrightText",
          title: "Copyright Text",
          type: "string",
          description: "Use {year} to insert the current year.",
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
