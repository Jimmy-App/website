import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { documentInternationalization } from "@sanity/document-internationalization";

import { apiVersion, dataset, projectId } from "./sanity/lib/config";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Marketing Website",
  projectId,
  dataset,
  basePath: "/studio",
  apiVersion,
  plugins: [
    deskTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        { id: "en", title: "English" },
        { id: "fr", title: "French" },
        { id: "es", title: "Spanish" },
      ],
      schemaTypes: [
        "siteSettings",
        "page",
        "post",
        "docPage",
        "navigation",
        "footer",
      ],
      languageField: "language",
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
