import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "";
const token = process.env.SANITY_API_TOKEN || "";

if (!projectId || !dataset) {
  console.error("Missing SANITY project id or dataset.");
  process.exit(1);
}

if (!token) {
  console.error("Missing SANITY_API_TOKEN for write access.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-02-01",
  useCdn: false,
  token,
});

const documents = [
  {
    _type: "footer",
    language: "en",
    brandLabel: "Jimmy",
    copyrightText: "© {year} Just Jimmy LLC. Built for freedom.",
  },
  {
    _type: "footer",
    language: "es",
    brandLabel: "Jimmy",
    copyrightText: "© {year} Just Jimmy LLC. Hecho para la independencia.",
  },
  {
    _type: "footer",
    language: "fr",
    brandLabel: "Jimmy",
    copyrightText: "© {year} Just Jimmy LLC. Conçu pour l'indépendance.",
  },
  {
    _type: "footer",
    language: "ua",
    brandLabel: "Jimmy",
    copyrightText: "© {year} Just Jimmy LLC. Створено для незалежності.",
  },
];

async function seedFooterDocument(doc) {
  const existing = await client.fetch(
    `*[_type == "footer" && language == $language][0]{_id}`,
    { language: doc.language },
  );

  if (existing?._id) {
    const payload = { ...doc };
    delete payload._type;
    await client.patch(existing._id).set(payload).commit();
    console.log(`updated footer for ${doc.language}`);
    return;
  }

  await client.create(doc);
  console.log(`created footer for ${doc.language}`);
}

async function main() {
  for (const doc of documents) {
    // Sequential writes reduce mutation conflicts while reseeding.
    await seedFooterDocument(doc);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
