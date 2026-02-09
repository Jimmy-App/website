import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
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
  "pricing",
  "pricingFeatures",
  "page",
  "post",
  "docPage",
  "navigation",
  "footer",
  "cookieBanner",
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
    structureTool({ structure }),
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
