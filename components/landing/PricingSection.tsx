'use client';

import { useState } from 'react';
import { ArrowRight, Check, Plus, Sparkles, Users, Zap } from 'lucide-react';
import type { SupportedLocale } from '@/lib/i18n';
import {
  formatPriceValue,
  resolvePlanAmount,
  resolvePricingCurrency,
  type PricingCurrency,
  type PricingPlanPrices,
} from '@/lib/pricing';
import {
  LANDING_SECTION_BADGE_CLASS,
  LANDING_SECTION_TITLE_CLASS,
} from './constants';

type PricingContent = {
  badgeText?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
  yearlySaveLabel?: string;
  yearlyFreeMonths?: number;
  currency?: string;
  popularBadgeLabel?: string;
  secondaryHelperText?: string;
  plans?: PricingPlan[];
};

type PricingPlan = {
  name?: string;
  price?: string;
  prices?: PricingPlanPrices;
  period?: string;
  clients?: string;
  description?: string;
  isFeatured?: boolean;
  features?: { label?: string; isAddon?: boolean }[];
};

type PricingSectionProps = {
  waitlistLabel?: string;
  waitlistHref?: string;
  pricingSecondaryLabel?: string;
  pricingSecondaryHref?: string;
  currentLocale?: SupportedLocale;
  content?: PricingContent | null;
};

type BillingFrequency = 'monthly' | 'yearly';

const formatAmount = (amount: number) =>
  Number.isInteger(amount) ? `${amount}` : amount.toFixed(2);

const formatMonthsLabel = (months: number) => {
  const value = formatAmount(months);
  const suffix = months === 1 ? 'month' : 'months';
  return `Save ${value} ${suffix}`;
};

const displayPrice = (
  amount: number | null,
  fallbackPrice: string,
  frequency: BillingFrequency,
  yearlyFreeMonths: number,
  currency: PricingCurrency
) => {
  if (amount === null) return fallbackPrice;

  const normalizedFreeMonths = Math.min(Math.max(yearlyFreeMonths, 0), 12);
  const yearlyPaidMonths = Math.max(12 - normalizedFreeMonths, 0);
  const adjusted =
    frequency === 'yearly' && amount > 0 ? amount * yearlyPaidMonths : amount;
  return formatPriceValue(adjusted, currency);
};

const periodLabel = (period: string | undefined, frequency: BillingFrequency) =>
  frequency === 'yearly' ? '/yr' : period || '/mo';

const parseClientsLabel = (label: string | undefined) => {
  const value = label?.trim() || 'Up to 0 Clients';
  const match = value.match(/^Up to\s+(\d+)\s+(.+)$/i);
  if (!match) {
    return { prefix: '', count: value, suffix: '' };
  }

  return {
    prefix: 'Up to',
    count: match[1],
    suffix: match[2],
  };
};

const planAudience = (name: string | undefined, index: number) => {
  const normalized = (name || '').toLowerCase();
  if (normalized.includes('starter')) return 'Best for solo coaches starting out';
  if (normalized.includes('growth')) return 'Best for growing coaching businesses';
  if (normalized.includes('elite')) return 'Best for high-volume coaching teams';

  const fallback = [
    'Best for solo coaches starting out',
    'Best for growing coaching businesses',
    'Best for high-volume coaching teams',
  ];
  return fallback[index] || 'Best for modern coaching businesses';
};

const PricingSection = ({
  waitlistLabel,
  waitlistHref,
  pricingSecondaryLabel,
  pricingSecondaryHref,
  currentLocale,
  content,
}: PricingSectionProps) => {
  const [selectedFrequency, setSelectedFrequency] =
    useState<BillingFrequency>('monthly');

  const resolvedWaitlistLabel = waitlistLabel || 'Join Waitlist';
  const resolvedWaitlistHref = waitlistHref || '#waitlist';
  const resolvedPricingSecondaryLabel =
    pricingSecondaryLabel || 'See all pricing plans';
  const resolvedBadgeText = content?.badgeText || 'Pricing Plans';
  const resolvedTitle = content?.title || 'Grow first.';
  const resolvedTitleHighlight = content?.titleHighlight || 'Pay later.';
  const resolvedSubtitle =
    content?.subtitle ||
    'A pricing model that aligns with your success. Start for free and upgrade only when your business grows.';
  const resolvedMonthlyLabel = content?.monthlyLabel || 'Monthly';
  const resolvedYearlyLabel = content?.yearlyLabel || 'Yearly';
  const resolvedYearlyFreeMonths =
    typeof content?.yearlyFreeMonths === 'number' ? content.yearlyFreeMonths : 2;
  const normalizedYearlyFreeMonths = Math.min(
    Math.max(resolvedYearlyFreeMonths, 0),
    12
  );
  const defaultYearlySaveLabel =
    normalizedYearlyFreeMonths > 0 ? formatMonthsLabel(normalizedYearlyFreeMonths) : '';
  const resolvedYearlySaveLabel = content?.yearlySaveLabel || defaultYearlySaveLabel;
  const resolvedPopularBadgeLabel = content?.popularBadgeLabel || 'Most Popular';
  const resolvedSecondaryHelperText =
    content?.secondaryHelperText || "200+ clients? Custom needs? Let's talk.";
  const resolvedPricingSecondaryHref = pricingSecondaryHref || '/pricing';
  const resolvedCurrency = resolvePricingCurrency(content?.currency, currentLocale);

  const defaultPlans: PricingPlan[] = [
    {
      name: 'The Starter',
      price: '€0',
      period: '/mo',
      clients: 'Up to 5 Clients',
      description: 'Perfect for getting started.',
      features: [
        { label: 'Core Workout Builder (Drag & Drop)', isAddon: false },
        { label: '1:1 Direct Client Chat', isAddon: false },
        { label: 'Basic Exercise Library (Videos)', isAddon: false },
        { label: 'Apple Health & Google Fit Sync', isAddon: false },
        { label: 'Mobile App for Clients (Offline-first)', isAddon: false },
        { label: 'Member Payments & Billing', isAddon: true },
      ],
      isFeatured: false,
    },
    {
      name: 'The Growth',
      price: '€49',
      period: '/mo',
      clients: 'Up to 30 Clients',
      description: 'For growing coaching businesses.',
      features: [
        { label: 'Everything in Starter', isAddon: false },
        { label: 'Revenue Analytics & Projections', isAddon: false },
        { label: 'Advanced Progression Tracking', isAddon: false },
        { label: 'Custom Workout Templates', isAddon: false },
        { label: 'Priority Email Support', isAddon: false },
        { label: 'Member Payments & Billing', isAddon: true },
      ],
      isFeatured: true,
    },
    {
      name: 'The Elite',
      price: '€99',
      period: '/mo',
      clients: 'Up to 200 Clients',
      description: 'Maximum scale and automation.',
      features: [
        { label: 'Everything in Growth', isAddon: false },
        { label: 'Group Chats & Community Groups', isAddon: false },
        { label: 'Advanced Branding (Your colors/logo)', isAddon: false },
        { label: 'Bulk Program Assignment', isAddon: false },
        { label: 'Exportable Data & Reports', isAddon: false },
        { label: 'Priority 1:1 Support', isAddon: false },
      ],
      isFeatured: false,
    },
  ];

  const resolvedPlans = content?.plans?.length ? content.plans : defaultPlans;

  return (
    <section className="border-t border-[#edf1f6] bg-white py-14 md:py-24" id="pricing">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className={`mb-5 ${LANDING_SECTION_BADGE_CLASS}`}>
            <Zap size={12} />
            {resolvedBadgeText}
          </div>

          <h2 className={LANDING_SECTION_TITLE_CLASS}>
            {resolvedTitle}{' '}
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {resolvedTitleHighlight}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-lg md:text-xl">
            {resolvedSubtitle}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <div className="inline-flex rounded-full border border-[#dfe7f2] bg-[#f5f8fc] p-1">
            <button
              type="button"
              onClick={() => setSelectedFrequency('monthly')}
              className={`inline-flex items-center rounded-full px-4 py-2 text-base font-semibold transition-colors ${
                selectedFrequency === 'monthly'
                  ? 'bg-white text-purple-700 shadow-[0_8px_14px_-12px_rgba(15,23,42,0.45)]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {resolvedMonthlyLabel}
            </button>
            <button
              type="button"
              onClick={() => setSelectedFrequency('yearly')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold transition-colors ${
                selectedFrequency === 'yearly'
                  ? 'bg-white text-purple-700 shadow-[0_8px_14px_-12px_rgba(15,23,42,0.45)]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{resolvedYearlyLabel}</span>
              {resolvedYearlySaveLabel ? (
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-[0_6px_12px_-8px_rgba(91,71,255,0.9)] ${
                    selectedFrequency === 'yearly'
                      ? 'border-[#5b47ff] bg-[#5b47ff] text-white'
                      : 'border-[#6d5cff] bg-[#6d5cff] text-white'
                  }`}
                >
                  {resolvedYearlySaveLabel}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resolvedPlans.map((plan, index) => {
            const isFeatured = Boolean(plan.isFeatured);
            const planFeatures = plan.features || [];
            const resolvedPlanDescription =
              plan.description?.trim() || planAudience(plan.name, index);
            const baseAmount = resolvePlanAmount({
              prices: plan.prices,
              currency: resolvedCurrency,
              fallbackPrice: plan.price,
            });
            const resolvedPlanPrice = displayPrice(
              baseAmount,
              plan.price || '$0',
              selectedFrequency,
              normalizedYearlyFreeMonths,
              resolvedCurrency
            );
            const resolvedPeriod = periodLabel(plan.period, selectedFrequency);
            const parsedClients = parseClientsLabel(plan.clients);

            return (
              <article
                key={`${plan.name || 'plan'}-${index}`}
                className={`relative flex h-full flex-col rounded-[24px] border p-6 sm:p-7 ${
                  isFeatured
                    ? 'border-purple-200 bg-purple-50/60 shadow-[0_18px_34px_-24px_rgba(147,51,234,0.2)]'
                    : 'border-[#e1e8f2] bg-white shadow-[0_12px_24px_-20px_rgba(15,23,42,0.16)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Plan
                    </p>
                    <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      {plan.name}
                    </h3>
                  </div>
                  {isFeatured ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-purple-700">
                      <Sparkles size={11} />
                      {resolvedPopularBadgeLabel}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {resolvedPlanDescription}
                </p>

                <div className="mt-5 flex items-end gap-2">
                  <span
                    className={`text-5xl font-extrabold tracking-tight ${
                      isFeatured ? 'text-purple-700' : 'text-slate-900'
                    }`}
                  >
                    {resolvedPlanPrice}
                  </span>
                  <span className="pb-1 text-base font-medium text-slate-400">
                    {resolvedPeriod}
                  </span>
                </div>

                <div
                  className={`mt-5 inline-flex max-w-full items-center gap-2 rounded-full border px-2.5 py-1.5 ${
                    isFeatured
                      ? 'border-purple-200 bg-white text-purple-700'
                      : 'border-[#e2e8f2] bg-[#f8fbff] text-slate-700'
                  }`}
                >
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                      isFeatured
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-[#eef2f8] text-slate-600'
                    }`}
                  >
                    <Users size={12} />
                  </span>

                  <p className="text-sm font-semibold leading-none">
                    {parsedClients.prefix ? (
                      <>
                        <span className={isFeatured ? 'text-purple-600/80' : 'text-slate-500'}>
                          {parsedClients.prefix}{' '}
                        </span>
                        <span className="text-[15px] font-bold">{parsedClients.count}</span>{' '}
                        {parsedClients.suffix}
                      </>
                    ) : (
                      parsedClients.count
                    )}
                  </p>
                </div>

                <div className="mt-6 flex-1 border-t border-[#e8edf5] pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
                    What&apos;s included
                  </p>

                  <div className="space-y-3">
                    {planFeatures.map((feature, featureIndex) => {
                      const isAddon = Boolean(feature.isAddon);
                      return (
                        <div
                          key={`${feature.label || 'feature'}-${featureIndex}`}
                          className="flex items-start gap-3"
                        >
                          <span
                            className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              isAddon
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-[#eef2f8] text-slate-700'
                            }`}
                          >
                            {isAddon ? (
                              <Plus size={12} strokeWidth={2.5} />
                            ) : (
                              <Check size={12} strokeWidth={2.5} />
                            )}
                          </span>
                          <span className="text-sm leading-relaxed text-slate-600">
                            {feature.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <a
                  href={resolvedWaitlistHref}
                  className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-base font-semibold transition-colors ${
                    isFeatured
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'border border-purple-200 bg-white text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  {resolvedWaitlistLabel}
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href={resolvedPricingSecondaryHref}
            className="group inline-flex items-center gap-2 text-base font-bold text-gray-900 transition-colors hover:text-purple-700"
          >
            {resolvedPricingSecondaryLabel}
            <ArrowRight
              size={18}
              className="text-purple-600 transition-transform group-hover:translate-x-1"
            />
          </a>
          <p className="mt-2 text-sm text-gray-400">{resolvedSecondaryHelperText}</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
