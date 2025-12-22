import { seo } from "./schemas/objects/seo";
import { navItem } from "./schemas/objects/navItem";
import { textBlock } from "./schemas/objects/textBlock";
import { socialLink } from "./schemas/objects/socialLink";
import { author } from "./schemas/documents/author";
import { category } from "./schemas/documents/category";
import { docPage } from "./schemas/documents/docPage";
import { footer } from "./schemas/documents/footer";
import { navigation } from "./schemas/documents/navigation";
import { page } from "./schemas/documents/page";
import { post } from "./schemas/documents/post";
import { siteSettings } from "./schemas/documents/siteSettings";

export const schemaTypes = [
  seo,
  navItem,
  textBlock,
  socialLink,
  author,
  category,
  siteSettings,
  page,
  post,
  docPage,
  navigation,
  footer,
];
