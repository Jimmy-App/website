import { defineField } from "sanity";

export const languageField = defineField({
  name: "language",
  title: "Language",
  type: "string",
  readOnly: true,
  hidden: true,
  validation: (Rule) => Rule.required(),
  options: {
    list: [
      { title: "English", value: "en" },
      { title: "French", value: "fr" },
      { title: "Spanish", value: "es" },
      { title: "Ukrainian", value: "ua" },
    ],
  },
  initialValue: "en",
});
