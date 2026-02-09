import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Marketing")
        .child(
          S.list()
            .title("Marketing")
            .items([
              S.documentTypeListItem("landingPage").title("Landing Pages"),
              S.documentTypeListItem("forClientsPage").title("For Clients Page"),
              S.documentTypeListItem("forCoachesPage").title("For Coaches Page"),
              S.documentTypeListItem("pricing").title("Pricing"),
              S.documentTypeListItem("navigation").title("Navigation"),
              S.documentTypeListItem("footer").title("Footer"),
              S.documentTypeListItem("siteSettings").title("Site Settings"),
            ])
        ),
      S.listItem()
        .title("Editorial")
        .child(
          S.list()
            .title("Editorial")
            .items([
              S.documentTypeListItem("post").title("Posts"),
              S.documentTypeListItem("category").title("Categories"),
              S.documentTypeListItem("author").title("Authors"),
            ])
        ),
      S.listItem()
        .title("Docs")
        .child(
          S.list()
            .title("Docs")
            .items([
              S.documentTypeListItem("docPage").title("Doc Pages"),
              S.documentTypeListItem("page").title("Pages"),
            ])
        ),
    ]);
