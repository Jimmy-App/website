import Link from "next/link";
import {
  Check,
  Minus,
  MoveRight,
} from "lucide-react";
import type { SupportedLocale } from "@/lib/i18n";
import {
  formatPriceValue,
  resolvePlanAmount,
  resolvePricingCurrency,
  type PricingPlanPrices,
} from "@/lib/pricing";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ComparisonValue = "check" | "minus" | string;

type PricingPlanFeature = {
  label?: string;
  isAddon?: boolean;
};

type PricingPlanKey = "starter" | "scale" | "elite" | "brand";

type PricingPlan = {
  name?: string;
  price?: string;
  prices?: PricingPlanPrices;
  period?: string;
  clients?: string;
  description?: string;
  ctaLabel?: string;
  isFeatured?: boolean;
  features?: PricingPlanFeature[];
};

type PricingPageCustomPlan = {
  name?: string;
  description?: string;
  price?: string;
  period?: string;
  clients?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type PricingFeatureMatrixRow = {
  title?: string;
  description?: string;
  includedPlans?: PricingPlanKey[];
  addOnPlans?: PricingPlanKey[];
};

type PricingFeaturesContent = {
  title?: string;
  rows?: PricingFeatureMatrixRow[];
};

type PricingPageSettings = {
  standardPlanCtaLabel?: string;
  addOnLabel?: string;
  featuresHeadingLabel?: string;
  includedInLabel?: string;
  clientCapacityTitle?: string;
  clientCapacityDescription?: string;
  customPlan?: PricingPageCustomPlan;
};

type PricingContent = {
  badgeText?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
  yearlySaveLabel?: string;
  yearlyFreeMonths?: number;
  popularBadgeLabel?: string;
  secondaryHelperText?: string;
  currency?: string;
  pricingPage?: PricingPageSettings;
  plans?: PricingPlan[];
};

type ComparisonRow = {
  label: string;
  values: ComparisonValue[];
  displayTitle?: string;
  displayDescription?: string;
};

type FeatureMap = Record<string, { isAddon: boolean }>;

type NormalizedPlan = {
  name: string;
  description: string;
  clients: string;
  featureMap: FeatureMap;
};

type PricingCard = {
  name: string;
  description: string;
  price: string;
  period?: string;
  ctaLabel: string;
  ctaHref: string;
  isFeatured: boolean;
};

type PricingSectionWithComparisonProps = {
  content?: PricingContent | null;
  featuresContent?: PricingFeaturesContent | null;
  waitlistHref?: string;
  currentLocale?: SupportedLocale;
  className?: string;
};

const FEATURE_LABEL_OVERRIDES: {
  pattern: RegExp;
  title: string;
  description: string;
}[] = [
  {
    pattern: /core workout builder|workout builder|program builder|programming/i,
    title: "Coach & Back-Office",
    description: "Programs, templates, clients",
  },
  {
    pattern: /coach\s*&\s*back[-\s]?office/i,
    title: "Coach & Back-Office",
    description: "Programs, templates, clients",
  },
  {
    pattern: /1:1 direct client chat|client chat/i,
    title: "Client Communication",
    description: "1:1 messaging and check-ins",
  },
  {
    pattern: /basic exercise library|exercise library/i,
    title: "Exercise Library",
    description: "Built-in demos and movement references",
  },
  {
    pattern: /apple health|google fit|health.*sync/i,
    title: "Health Sync",
    description: "Apple Health + Google Fit integration",
  },
  {
    pattern: /mobile app for clients|offline-first/i,
    title: "Client App",
    description: "Offline-first workout experience",
  },
  {
    pattern: /member payments|billing/i,
    title: "Payments & Billing",
    description: "Subscriptions and member payments",
  },
  {
    pattern: /revenue analytics|projections/i,
    title: "Revenue Analytics",
    description: "Forecasts and business insights",
  },
  {
    pattern: /advanced progression tracking|progression tracking/i,
    title: "Progress Tracking",
    description: "PRs, trends, and consistency tracking",
  },
  {
    pattern: /custom workout templates|workout templates/i,
    title: "Workout Templates",
    description: "Reusable plans for faster programming",
  },
  {
    pattern: /priority email support/i,
    title: "Priority Support",
    description: "Faster support response times",
  },
  {
    pattern: /group chats|community groups/i,
    title: "Group Communication",
    description: "Group chats and community spaces",
  },
  {
    pattern: /advanced branding|colors\/logo|branding/i,
    title: "Branding",
    description: "Your own colors and logo",
  },
  {
    pattern: /bulk program assignment|bulk/i,
    title: "Bulk Actions",
    description: "Assign programs at scale",
  },
  {
    pattern: /exportable data|reports|data export/i,
    title: "Data & Reports",
    description: "Exports and reporting tools",
  },
  {
    pattern: /priority 1:1 support|1:1 support/i,
    title: "Priority 1:1 Support",
    description: "Dedicated high-touch support",
  },
  {
    pattern: /client limit/i,
    title: "Client Capacity",
    description: "Maximum active clients per plan",
  },
];

function sanitizeDescription(value: string) {
  return value.replace(/^\s*[—–-]\s*/, "").trim();
}

function resolveRowLabelView(label: string) {
  for (const override of FEATURE_LABEL_OVERRIDES) {
    if (override.pattern.test(label)) {
      return {
        title: override.title,
        description: sanitizeDescription(override.description),
      };
    }
  }

  const dashSplitMatch = label.match(/^(.*?)\s*[—–-]\s*(.+)$/);
  if (dashSplitMatch) {
    return {
      title: dashSplitMatch[1].trim(),
      description: sanitizeDescription(dashSplitMatch[2]),
    };
  }

  const parenthesisMatch = label.match(/^(.*?)\s*\((.*?)\)\s*$/);
  if (parenthesisMatch) {
    return {
      title: parenthesisMatch[1].trim(),
      description: sanitizeDescription(parenthesisMatch[2]),
    };
  }

  return {
    title: label,
    description: sanitizeDescription("Feature availability by plan"),
  };
}

function ComparisonCellValue({ value }: { value: ComparisonValue }) {
  if (value === "check") {
    return <Check className="h-4 w-4 text-purple-600" />;
  }

  if (value === "minus") {
    return <Minus className="h-4 w-4 text-slate-400" />;
  }

  return <p className="text-center text-sm font-medium text-slate-500">{value}</p>;
}

function PricingSectionWithComparison({
  content,
  featuresContent,
  waitlistHref = "#waitlist",
  currentLocale,
  className,
}: PricingSectionWithComparisonProps) {
  const defaultPlans: PricingPlan[] = [
    {
      name: "The Starter",
      description: "Perfect for side hustles and getting your first clients.",
      price: "€0",
      period: "/mo",
      clients: "Up to 5 Clients",
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
      description: "For coaches ready to quit their 9-to-5 job.",
      price: "€49",
      period: "/mo",
      clients: "Up to 25 Clients",
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
      description: "Serious tools to dominate your niche.",
      price: "€99",
      period: "/mo",
      clients: "Up to 200 Clients",
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
  ];
  const sourcePlans = [0, 1, 2].map(
    (index) => content?.plans?.[index] || defaultPlans[index],
  );
  const resolvedTitle = content?.title || "Grow first.";
  const resolvedTitleHighlight = content?.titleHighlight || "Pay later.";
  const resolvedSubtitle =
    content?.subtitle ||
    "A pricing model that aligns with your success. Start for free and upgrade only when your business grows.";
  const resolvedCurrency = resolvePricingCurrency(content?.currency, currentLocale);
  const resolvedStandardPlanCtaLabel =
    content?.pricingPage?.standardPlanCtaLabel || "Join Waitlist";
  const resolvedAddOnLabel = content?.pricingPage?.addOnLabel || "Add-on";
  const resolvedFeaturesHeadingLabel =
    featuresContent?.title?.trim() ||
    content?.pricingPage?.featuresHeadingLabel ||
    "Features";
  const resolvedIncludedInLabel =
    content?.pricingPage?.includedInLabel || "Included in";
  const resolvedClientCapacityTitle =
    content?.pricingPage?.clientCapacityTitle || "Client Capacity";
  const resolvedClientCapacityDescription =
    content?.pricingPage?.clientCapacityDescription ||
    "Maximum active clients per plan";
  const basePathFromWaitlist = waitlistHref.split("#")[0] || "";
  const contactSalesHref = basePathFromWaitlist
    ? `${basePathFromWaitlist}/for-coaches`
    : "/for-coaches";
  const resolvedCustomPlan = content?.pricingPage?.customPlan;
  const resolvedCustomPlanName = resolvedCustomPlan?.name || "The Brand";
  const resolvedCustomPlanDescription =
    resolvedCustomPlan?.description ||
    "Your own white-label app in the App Store. Fully branded for you.";
  const resolvedCustomPlanPrice = resolvedCustomPlan?.price || "";
  const resolvedCustomPlanPeriod = resolvedCustomPlan?.period || "";
  const resolvedCustomPlanClients = resolvedCustomPlan?.clients || "Unlimited";
  const resolvedCustomPlanCtaLabel =
    resolvedCustomPlan?.ctaLabel || "Contact Sales";
  const resolvedCustomPlanCtaHref =
    resolvedCustomPlan?.ctaHref || contactSalesHref;

  const fallbackAmounts = [0, 49, 99];
  const pricingCards: PricingCard[] = sourcePlans.map((plan, index) => {
    const amount =
      resolvePlanAmount({
        prices: plan.prices,
        currency: resolvedCurrency,
        fallbackPrice: plan.price,
      }) ?? fallbackAmounts[index] ?? 0;
    const fallbackPlan = defaultPlans[index];

    return {
      name: plan.name || fallbackPlan?.name || `Plan ${index + 1}`,
      description:
        plan.description ||
        fallbackPlan?.description ||
        "Built for modern coaching businesses.",
      price: formatPriceValue(amount, resolvedCurrency),
      period: plan.period || fallbackPlan?.period || "/mo",
      ctaLabel: plan.ctaLabel || resolvedStandardPlanCtaLabel,
      ctaHref: waitlistHref,
      isFeatured:
        typeof plan.isFeatured === "boolean"
          ? plan.isFeatured
          : Boolean(fallbackPlan?.isFeatured),
    };
  });
  pricingCards.push({
    name: resolvedCustomPlanName,
    description: resolvedCustomPlanDescription,
    price: resolvedCustomPlanPrice,
    period: resolvedCustomPlanPeriod || undefined,
    ctaLabel: resolvedCustomPlanCtaLabel,
    ctaHref: resolvedCustomPlanCtaHref,
    isFeatured: false,
  });

  const normalizedFeatureMaps: FeatureMap[] = [];
  const normalizedPlans: NormalizedPlan[] = sourcePlans.map((plan, planIndex) => {
    const previousPlanFeatures =
      planIndex > 0
        ? normalizedFeatureMaps[planIndex - 1]
        : ({} as FeatureMap);
    const resolvedFeatureMap: FeatureMap = {};
    let inheritsPrevious = false;

    (plan.features || []).forEach((feature) => {
      const label = (feature.label || "").trim();
      if (!label) return;
      if (/^everything in\b/i.test(label)) {
        inheritsPrevious = true;
        return;
      }

      resolvedFeatureMap[label] = { isAddon: Boolean(feature.isAddon) };
    });

    if (inheritsPrevious && planIndex > 0) {
      Object.entries(previousPlanFeatures).forEach(([label, value]) => {
        if (!resolvedFeatureMap[label]) {
          resolvedFeatureMap[label] = value;
        }
      });
    }

    normalizedFeatureMaps[planIndex] = resolvedFeatureMap;

    return {
      name: plan.name || defaultPlans[planIndex]?.name || `Plan ${planIndex + 1}`,
      description:
        plan.description ||
        defaultPlans[planIndex]?.description ||
        "Built for modern coaching businesses.",
      clients: plan.clients || "",
      featureMap: resolvedFeatureMap,
    };
  });

  const allFeatureLabels: string[] = [];
  normalizedPlans.forEach((plan) => {
    Object.keys(plan.featureMap).forEach((label) => {
      if (!allFeatureLabels.includes(label)) {
        allFeatureLabels.push(label);
      }
    });
  });

  const customPlanFeatureMap: FeatureMap = allFeatureLabels.reduce(
    (acc, label) => {
      acc[label] = { isAddon: false };
      return acc;
    },
    {} as FeatureMap,
  );
  const comparisonPlans = [
    ...normalizedPlans.map((plan) => ({
      name: plan.name,
      clients: plan.clients,
      featureMap: plan.featureMap,
    })),
    {
      name: resolvedCustomPlanName,
      clients: resolvedCustomPlanClients,
      featureMap: customPlanFeatureMap,
    },
  ];
  const comparisonPlanKeys: PricingPlanKey[] = [
    "starter",
    "scale",
    "elite",
    "brand",
  ];

  const mergeComparisonValue = (
    current: ComparisonValue,
    incoming: ComparisonValue,
  ): ComparisonValue => {
    const priority: Record<string, number> = {
      minus: 0,
      [resolvedAddOnLabel]: 1,
      check: 2,
    };
    const currentPriority = priority[current] ?? -1;
    const incomingPriority = priority[incoming] ?? -1;

    if (incomingPriority > currentPriority) return incoming;
    return current;
  };

  const dedupedFeatureRowsMap = new Map<string, ComparisonRow>();
  allFeatureLabels.forEach((label) => {
    const rowView = resolveRowLabelView(label);
    const values = comparisonPlans.map((plan) => {
      const feature = plan.featureMap[label];
      if (!feature) return "minus";
      return feature.isAddon ? resolvedAddOnLabel : "check";
    });
    const dedupeKey = `${rowView.title}|||${rowView.description || ""}`;

    const existing = dedupedFeatureRowsMap.get(dedupeKey);
    if (!existing) {
      dedupedFeatureRowsMap.set(dedupeKey, {
        label,
        values,
        displayTitle: rowView.title,
        displayDescription: rowView.description,
      });
      return;
    }

    existing.values = existing.values.map((value, index) =>
      mergeComparisonValue(value, values[index]),
    );
  });

  const featureRowsNormalized = Array.from(dedupedFeatureRowsMap.values());

  const clientLimitRow: ComparisonRow = {
    label: "Client Limit",
    values: comparisonPlans.map((plan) => {
      const clients = plan.clients.trim();
      if (!clients) return "N/A";
      return clients.replace(/^Up to\s+/i, "");
    }),
    displayTitle: resolvedClientCapacityTitle,
    displayDescription: resolvedClientCapacityDescription,
  };
  const matrixRows = (featuresContent?.rows || []).filter((row) =>
    Boolean(row?.title?.trim()),
  );
  const featureRowsFromMatrix: ComparisonRow[] = matrixRows.map((row) => {
    const rowTitle = row.title?.trim() || "Feature";
    const rowDescription = row.description?.trim();
    const includedPlans = row.includedPlans || [];
    const addOnPlans = row.addOnPlans || [];

    return {
      label: rowTitle,
      values: comparisonPlanKeys.map((planKey) => {
        if (includedPlans.includes(planKey)) return "check";
        if (addOnPlans.includes(planKey)) return resolvedAddOnLabel;
        return "minus";
      }),
      displayTitle: rowTitle,
      displayDescription: rowDescription,
    };
  });
  const rows: ComparisonRow[] =
    featureRowsFromMatrix.length > 0
      ? [clientLimitRow, ...featureRowsFromMatrix]
      : [clientLimitRow, ...featureRowsNormalized];
  const comparisonColumnTitles = comparisonPlans.map((plan) => plan.name);

  return (
    <section className={cn("w-full pb-20 pt-28 lg:pb-28 lg:pt-40", className)} id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 text-center">
          <div className="flex w-full max-w-3xl flex-col items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              {resolvedTitle}{" "}
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {resolvedTitleHighlight}
              </span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
              {resolvedSubtitle}
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-x-auto">
          <div className="min-w-[1080px] overflow-hidden rounded-[28px] border border-[#dfe7f2] bg-white/95 shadow-[0_24px_45px_-34px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <div className="grid grid-cols-5 gap-px bg-[#e7edf5]">
              <div aria-hidden className="bg-white" />
              {pricingCards.map((card) => (
                <div
                  key={card.name}
                  className="flex h-full flex-col bg-white px-4 py-5 md:px-6 md:py-6"
                >
                  <p className="text-2xl font-bold tracking-tight text-slate-900">{card.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {card.description}
                  </p>
                  <div className="mt-auto pt-8">
                    <p className="flex flex-col gap-1 text-xl sm:flex-row sm:items-end sm:gap-2">
                      <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                        {card.price}
                      </span>
                      {card.period ? (
                        <span className="pb-1 text-sm font-medium text-slate-400">
                          {card.period}
                        </span>
                      ) : null}
                    </p>
                    <Button
                      asChild
                      variant={card.isFeatured ? "default" : "outline"}
                      className={cn(
                        "!h-auto w-fit gap-2 !rounded-full px-6 py-3 text-sm font-semibold transition-all",
                        "mt-8",
                        card.isFeatured
                          ? "bg-purple-600 text-white shadow-[0_14px_30px_-18px_rgba(124,58,237,0.9)] hover:bg-purple-700"
                          : "border-[#d9e2ef] bg-white text-slate-700 hover:bg-slate-50",
                      )}
                    >
                      <Link href={card.ctaHref}>
                        {card.ctaLabel}
                        <MoveRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e7edf5] px-4 py-4 lg:px-6">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-500">
                {resolvedFeaturesHeadingLabel}
              </p>
            </div>

            <div className="grid grid-cols-5 divide-x divide-[#e7edf5] border-t border-[#e7edf5]">
              <div className="px-4 py-3 text-sm font-semibold text-slate-500 lg:px-6">
                {resolvedIncludedInLabel}
              </div>
              {comparisonColumnTitles.map((title) => (
                <div
                  key={title}
                  className="px-4 py-3 text-center text-sm font-semibold text-slate-600"
                >
                  {title}
                </div>
              ))}
            </div>

            {rows.map((row, rowIndex) => {
              const rowLabelView = {
                title:
                  row.displayTitle ?? resolveRowLabelView(row.label).title,
                description:
                  row.displayDescription ??
                  resolveRowLabelView(row.label).description,
              };

              return (
                <div
                  key={`${row.label}-${rowIndex}`}
                  className="grid grid-cols-5 divide-x divide-[#e7edf5] border-t border-[#e7edf5]"
                >
                  <div className="px-4 py-4 lg:px-6">
                    <p className="text-sm font-semibold text-slate-700">
                      {rowLabelView.title}
                    </p>
                    {rowLabelView.description ? (
                      <p className="mt-0.5 text-sm font-normal text-slate-500">
                        {rowLabelView.description}
                      </p>
                    ) : null}
                  </div>
                  {row.values.map((value, index) => (
                    <div
                      key={`${row.label}-${index}`}
                      className="flex items-center justify-center px-4 py-4"
                    >
                      <ComparisonCellValue value={value} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export type {
  PricingContent as PricingSectionWithComparisonContent,
  PricingFeaturesContent as PricingSectionWithComparisonFeaturesContent,
};
export { PricingSectionWithComparison };
