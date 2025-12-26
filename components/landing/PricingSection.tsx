'use client';

import { Check, ArrowRight, Zap, Sparkles, Plus } from 'lucide-react';

type PricingContent = {
    badgeText?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    popularBadgeLabel?: string;
    secondaryHelperText?: string;
    plans?: {
        name?: string;
        price?: string;
        period?: string;
        clients?: string;
        description?: string;
        isFeatured?: boolean;
        features?: { label?: string; isAddon?: boolean }[];
    }[];
};

type PricingSectionProps = {
    waitlistLabel?: string;
    pricingSecondaryLabel?: string;
    content?: PricingContent | null;
};

const PricingSection = ({ waitlistLabel, pricingSecondaryLabel, content }: PricingSectionProps) => {
    const resolvedWaitlistLabel = waitlistLabel || 'Join Waitlist';
    const resolvedPricingSecondaryLabel = pricingSecondaryLabel || 'See all pricing plans';
    const resolvedBadgeText = content?.badgeText || 'Pricing Plans';
    const resolvedTitle = content?.title || 'Grow first.';
    const resolvedTitleHighlight = content?.titleHighlight || 'Pay later.';
    const resolvedSubtitle = content?.subtitle || 'A pricing model that aligns with your success. Start for free and upgrade only when your business grows.';
    const resolvedPopularBadgeLabel = content?.popularBadgeLabel || 'Most Popular';
    const resolvedSecondaryHelperText = content?.secondaryHelperText || 'Compare features and limits for 200+ clients';

    const defaultPlans = [
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
                { label: 'Member Payments & Billing', isAddon: true }
            ],
            isFeatured: false
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
                { label: 'Member Payments & Billing', isAddon: true }
            ],
            isFeatured: true
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
                { label: 'Priority 1:1 Support', isAddon: false }
            ],
            isFeatured: false
        }
    ];

    const resolvedPlans = content?.plans?.length ? content.plans : defaultPlans;

    return (
        <section className="py-16 md:py-32 bg-white relative overflow-hidden" id="pricing">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[100px] mix-blend-multiply" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100/50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                        <Zap size={12} className="fill-purple-700" />
                        {resolvedBadgeText}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
                        {resolvedTitle}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                            {resolvedTitleHighlight}
                        </span>
                    </h2>
                    <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
                        {resolvedSubtitle}
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">
                    {resolvedPlans.map((plan, index) => (
                        <div
                            key={`${plan.name || 'plan'}-${index}`}
                            className={`relative flex flex-col p-8 md:p-10 rounded-[32px] transition-all duration-300 group
                ${plan.isFeatured
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl shadow-purple-900/40 scale-100 lg:scale-105 z-10 ring-1 ring-white/10'
                                    : 'bg-white text-gray-900 border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/10 z-0'
                                }
              `}
                        >
                            {plan.isFeatured && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-purple-700 text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 ring-4 ring-white/20">
                                    <Sparkles size={12} className="fill-purple-700/20" /> {resolvedPopularBadgeLabel}
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-lg font-bold mb-4 ${plan.isFeatured ? 'text-purple-100' : 'text-gray-900'}`}>{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className={`text-5xl font-extrabold tracking-tight ${plan.isFeatured ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                                    <span className={`text-lg font-medium ${plan.isFeatured ? 'text-purple-200' : 'text-gray-400'}`}>{plan.period}</span>
                                </div>
                                <p className={`text-sm ${plan.isFeatured ? 'text-purple-100' : 'text-gray-500'}`}>{plan.description}</p>
                            </div>

                            <div className={`p-4 rounded-2xl mb-8 flex items-center justify-center font-bold text-sm ${plan.isFeatured ? 'bg-white/10 text-white border border-white/20' : 'bg-purple-50 text-purple-900 border border-purple-100'
                                }`}>
                                {plan.clients}
                            </div>

                            <div className="flex-1 space-y-5 mb-10">
                                {(plan.features || []).map((feature, featureIndex) => {
                                    const isAddon = Boolean(feature.isAddon);
                                    return (
                                        <div key={`${feature.label || 'feature'}-${featureIndex}`} className="flex items-start gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isAddon
                                                ? (plan.isFeatured ? 'bg-emerald-400 text-emerald-900' : 'bg-emerald-100 text-emerald-600')
                                                : (plan.isFeatured ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-600')
                                                }`}>
                                                {isAddon ? <Plus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
                                            </div>
                                            <span className={`text-sm font-medium ${plan.isFeatured ? 'text-white' : 'text-gray-600'}`}>{feature.label}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <a
                                href="#waitlist"
                                className={`w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center ${plan.isFeatured
                                    ? 'bg-white text-purple-700 hover:bg-purple-50 shadow-lg shadow-black/10'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-200/50'
                                    }`}
                            >
                                {resolvedWaitlistLabel}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Secondary CTA */}
                <div className="text-center">
                    <a href="#" className="inline-flex items-center gap-2 text-base font-bold text-gray-900 hover:text-purple-600 transition-colors group">
                        {resolvedPricingSecondaryLabel}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-purple-500" />
                    </a>
                    <p className="text-gray-400 mt-2 text-xs">{resolvedSecondaryHelperText}</p>
                </div>

            </div>
        </section>
    );
};

export default PricingSection;
