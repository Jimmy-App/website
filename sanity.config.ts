import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { documentInternationalization } from "@sanity/document-internationalization";

import { apiVersion, dataset, projectId } from "./sanity/lib/config";
import { structure } from "./sanity/deskStructure";
import { schemaTypes } from "./sanity/schemaTypes";

const supportedLanguages = [
  { id: "en", title: "English" },
  { id: "fr", title: "French" },
  { id: "es", title: "Spanish" },
  { id: "ua", title: "Ukrainian" },
];

const localizedSchemaTypes = [
  "siteSettings",
  "landingPage",
  "page",
  "post",
  "docPage",
  "navigation",
  "footer",
];

const hiddenTemplateIds = new Set(
  localizedSchemaTypes.flatMap((schemaType) => [
    `${schemaType}-parameterized`,
    ...supportedLanguages.map((language) => `${schemaType}-${language.id}`),
  ]),
);

export default defineConfig({
  name: "default",
  title: "Marketing Website",
  projectId,
  dataset,
  basePath: "/jadmin",
  apiVersion,
  plugins: [
    deskTool({ structure }),
    visionTool(),
    documentInternationalization({
      supportedLanguages,
      schemaTypes: localizedSchemaTypes,
      languageField: "language",
    }),
  ],
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => !hiddenTemplateIds.has(item.templateId)),
  },
  schema: {
    types: schemaTypes,
  },
});
