import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'

import { env } from './env'
import { schemaTypes } from './schemas'
import { structure } from './structure'

const supportedLanguages = [
  { id: 'en', title: 'English' },
  { id: 'fr', title: 'Français' },
  { id: 'es', title: 'Español' },
]

const localizedSchemaTypes = [
  'homePage',
  'pricingPage',
  'affiliatePage',
  'navigation',
  'footer',
  'siteSettings',
  'feature',
]

const hiddenTemplateIds = new Set(
  localizedSchemaTypes.flatMap((schemaType) => [
    `${schemaType}-parameterized`,
    ...supportedLanguages.map((language) => `${schemaType}-${language.id}`),
  ]),
)

export default defineConfig({
  name: 'default',
  title: 'Jimmy Marketing',
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  basePath: '/studio',
  apiVersion: env.SANITY_API_VERSION,
  plugins: [
    structureTool({ structure }),
    visionTool(),
    documentInternationalization({
      supportedLanguages,
      schemaTypes: localizedSchemaTypes,
      languageField: 'language',
    }),
  ],
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => !hiddenTemplateIds.has(item.templateId)),
  },
  schema: {
    types: schemaTypes,
  },
})
