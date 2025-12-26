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

const languages = ["en", "fr", "es", "ua"];

const run = async () => {
  for (const language of languages) {
    const landingPage = await client.fetch(
      `*[_type == "landingPage" && language == $language][0]{
        _id,
        language,
        navbar
      }`,
      { language },
    );

    const navigation = await client.fetch(
      `*[_type == "navigation" && language == $language][0]{
        _id,
        title,
        brandLabel,
        mobileHelperText,
        items
      }`,
      { language },
    );

    const navbar = landingPage?.navbar || {};
    const updates = {};

    if (!navigation?.brandLabel && navbar.brandLabel) {
      updates.brandLabel = navbar.brandLabel;
    }
    if (!navigation?.mobileHelperText && navbar.mobileHelperText) {
      updates.mobileHelperText = navbar.mobileHelperText;
    }
    if ((!navigation?.items || navigation.items.length === 0) && navbar.menuItems?.length) {
      updates.items = navbar.menuItems.map((item) => ({
        label: item.label,
        href: item.href,
      }));
    }

    if (navigation?._id) {
      if (Object.keys(updates).length > 0) {
        await client.patch(navigation._id).set(updates).commit({
          autoGenerateArrayKeys: true,
        });
        console.log(`updated navigation for ${language}`);
      } else {
        console.log(`navigation already set for ${language}`);
      }
    } else if (Object.keys(updates).length > 0) {
      await client.create({
        _type: "navigation",
        title: "Navigation",
        language,
        ...updates,
      });
      console.log(`created navigation for ${language}`);
    } else {
      console.log(`no navbar data to migrate for ${language}`);
    }

    if (landingPage?._id && landingPage?.navbar) {
      await client.patch(landingPage._id).unset(["navbar"]).commit();
      console.log(`removed navbar from landingPage for ${language}`);
    }
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
