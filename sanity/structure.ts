import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(S.documentTypeList('siteSettings').title('Site Settings')),
      S.listItem()
        .title('Home Page')
        .child(S.documentTypeList('homePage').title('Home Page')),
      S.divider(),
      S.listItem()
        .title('Navigation')
        .child(S.documentTypeList('navigation').title('Navigation')),
      S.listItem()
        .title('Footer')
        .child(S.documentTypeList('footer').title('Footer')),
      S.divider(),
      S.listItem()
        .title('Pricing')
        .child(S.documentTypeList('pricing').title('Pricing')),
      S.listItem()
        .title('Pricing Features')
        .child(S.documentTypeList('pricingFeatures').title('Pricing Features')),
    ])
