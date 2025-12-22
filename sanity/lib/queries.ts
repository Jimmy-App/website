import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings" && language == $language][0]{
    title,
    domain,
    socialLinks[]{title, url},
    defaultSeo,
    supportedLocales,
    defaultLocale
  }
`);

export const navigationByLanguageQuery = defineQuery(`
  *[_type == "navigation" && language == $language][0]{
    title,
    items[]{label, href}
  }
`);

export const footerByLanguageQuery = defineQuery(`
  *[_type == "footer" && language == $language][0]{
    title,
    items[]{label, href}
  }
`);

export const homePageQuery = defineQuery(`
  *[_type == "page" && slug.current == "home" && language == $language][0]{
    title,
    "slug": slug.current,
    seo,
    blocks[]
  }
`);

export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug && language == $language][0]{
    title,
    "slug": slug.current,
    seo,
    blocks[]
  }
`);

export const postsByLanguageQuery = defineQuery(`
  *[_type == "post" && language == $language] | order(publishDate desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishDate
  }
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug && language == $language][0]{
    title,
    "slug": slug.current,
    excerpt,
    publishDate,
    author->{name},
    categories[]->{title},
    body,
    seo
  }
`);

export const docsByLanguageQuery = defineQuery(`
  *[_type == "docPage" && language == $language] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    order
  }
`);

export const docPageBySlugQuery = defineQuery(`
  *[_type == "docPage" && slug.current == $slug && language == $language][0]{
    title,
    "slug": slug.current,
    order,
    parent->{title, "slug": slug.current},
    body,
    seo
  }
`);
