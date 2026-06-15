import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Page')
        .child(S.documentTypeList('homePage').title('Home Page (per language)')),
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
