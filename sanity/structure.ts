import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Page')
        .child(S.documentTypeList('homePage').title('Home Page (per language)')),
      S.listItem()
        .title('Pricing Page')
        .child(S.documentTypeList('pricingPage').title('Pricing Page (per language)')),
      S.listItem()
        .title('Pricing Plans (prices)')
        .child(
          S.document().schemaType('pricingPlans').documentId('pricingPlans'),
        ),
      S.listItem()
        .title('Affiliate Page')
        .child(S.documentTypeList('affiliatePage').title('Affiliate Page (per language)')),
      S.listItem()
        .title('Affiliate Settings (calculator)')
        .child(
          S.document().schemaType('affiliateSettings').documentId('affiliateSettings'),
        ),
      S.divider(),
      S.listItem()
        .title('Blog Posts')
        .child(S.documentTypeList('post').title('Blog Posts')),
      S.listItem()
        .title('Guides')
        .child(S.documentTypeList('guide').title('Guides')),
      S.listItem()
        .title('Features')
        .child(S.documentTypeList('feature').title('Features')),
      S.divider(),
      S.listItem()
        .title('Navigation')
        .child(S.documentTypeList('navigation').title('Navigation (per language)')),
      S.listItem()
        .title('Footer')
        .child(S.documentTypeList('footer').title('Footer (per language)')),
      S.listItem()
        .title('Site Settings')
        .child(S.documentTypeList('siteSettings').title('Site Settings (per language)')),
    ])
