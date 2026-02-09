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

const englishPricing = {
  title: "Pricing",
  seo: {
    title: "Pricing",
    description:
      "Simple pricing for independent coaches. Start free and upgrade as your coaching business grows.",
  },
  pricingSecondaryLabel: "See all pricing plans",
  badgeText: "Pricing Plans",
  titleHighlight: "Pay later.",
  subtitle:
    "A pricing model that aligns with your success. Start for free and upgrade only when your business grows.",
  popularBadgeLabel: "Most Popular",
  monthlyLabel: "Monthly",
  yearlyLabel: "Yearly",
  yearlySaveLabel: "Save 2 months",
  yearlyFreeMonths: 2,
  currency: "usd",
  secondaryHelperText: "200+ clients? Custom needs? Let's talk.",
  pricingPage: {
    standardPlanCtaLabel: "Join Waitlist",
    addOnLabel: "Add-on",
    featuresHeadingLabel: "Features",
    includedInLabel: "Included in",
    clientCapacityTitle: "Client Capacity",
    clientCapacityDescription: "Maximum active clients per plan",
    customPlan: {
      name: "The Brand",
      description:
        "Your own white-label app in the App Store. Fully branded for you.",
      price: "",
      period: "",
      clients: "Unlimited",
      ctaLabel: "Contact Sales",
      ctaHref: "/en/for-coaches",
    },
  },
  plans: [
    {
      name: "The Starter",
      prices: { usd: 0, eur: 0, gbp: 0 },
      period: "/mo",
      clients: "Up to 5 Clients",
      description: "Perfect for side hustles and getting your first clients.",
      ctaLabel: "Join Waitlist",
      isFeatured: false,
      features: [
        { label: "Coach & Back-Office", isAddon: false },
        { label: "Client Communication", isAddon: false },
        { label: "Exercise Library", isAddon: false },
        { label: "Health Sync", isAddon: false },
        { label: "Client App", isAddon: false },
        { label: "Payments & Billing", isAddon: true },
      ],
    },
    {
      name: "The Scale",
      prices: { usd: 49, eur: 49, gbp: 39 },
      period: "/mo",
      clients: "Up to 25 Clients",
      description: "For coaches ready to quit their 9-to-5 job.",
      ctaLabel: "Join Waitlist",
      isFeatured: true,
      features: [
        { label: "Everything in Starter", isAddon: false },
        { label: "Revenue Analytics", isAddon: false },
        { label: "Progress Tracking", isAddon: false },
        { label: "Workout Templates", isAddon: false },
        { label: "Priority Support", isAddon: false },
        { label: "Payments & Billing", isAddon: true },
      ],
    },
    {
      name: "The Elite",
      prices: { usd: 99, eur: 99, gbp: 79 },
      period: "/mo",
      clients: "Up to 200 Clients",
      description: "Serious tools to dominate your niche.",
      ctaLabel: "Join Waitlist",
      isFeatured: false,
      features: [
        { label: "Everything in The Scale", isAddon: false },
        { label: "Group Communication", isAddon: false },
        { label: "Branding", isAddon: false },
        { label: "Bulk Actions", isAddon: false },
        { label: "Data & Reports", isAddon: false },
        { label: "Priority 1:1 Support", isAddon: false },
      ],
    },
  ],
};

const documents = [
  {
    _type: "pricing",
    language: "en",
    ...englishPricing,
  },
];

async function seedPricingDocument(doc) {
  const existing = await client.fetch(
    `*[_type == "pricing" && language == $language][0]{_id}`,
    { language: doc.language },
  );

  if (existing?._id) {
    await client.patch(existing._id).set(doc).commit({
      autoGenerateArrayKeys: true,
    });
    console.log(`updated pricing for ${doc.language}`);
    return;
  }

  await client.create(doc);
  console.log(`created pricing for ${doc.language}`);
}

async function main() {
  for (const doc of documents) {
    // Sequential writes reduce mutation conflicts while reseeding.
    await seedPricingDocument(doc);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
