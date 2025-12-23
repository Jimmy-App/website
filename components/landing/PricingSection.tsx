'use client';

import { Check, ArrowRight, Zap, Sparkles, Plus } from 'lucide-react';

const PricingSection = () => {
    const PLANS = [
        {
            name: 'The Starter',
            price: '€0',
            period: '/mo',
            clients: 'Up to 5 Clients',
            description: 'Perfect for getting started.',
            features: [
                'Core Workout Builder (Drag & Drop)',
                '1:1 Direct Client Chat',
                'Basic Exercise Library (Videos)',
                'Apple Health & Google Fit Sync',
                'Mobile App for Clients (Offline-first)',
                'Member Payments & Billing'
            ],
            highlight: false,
            buttonText: 'Start for Free',
            buttonVariant: 'secondary'
        },
        {
            name: 'The Growth',
            price: '€49',
            period: '/mo',
            clients: 'Up to 30 Clients',
            description: 'For growing coaching businesses.',
            features: [
                'Everything in Starter',
                'Revenue Analytics & Projections',
                'Advanced Progression Tracking',
                'Custom Workout Templates',
                'Priority Email Support',
                'Member Payments & Billing'
            ],
            highlight: true,
            buttonText: 'Start Free Trial',
            buttonVariant: 'primary'
        },
        {
            name: 'The Elite',
            price: '€99',
            period: '/mo',
            clients: 'Up to 200 Clients',
            description: 'Maximum scale and automation.',
            features: [
                'Everything in Growth',
                'Group Chats & Community Groups',
                'Advanced Branding (Your colors/logo)',
                'Bulk Program Assignment',
                'Exportable Data & Reports',
                'Priority 1:1 Support'
            ],
            highlight: false,
            buttonText: 'Start Free Trial',
            buttonVariant: 'secondary'
        }
    ];

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
                        Pricing Plans
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
                        Grow first. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Pay later.</span>
                    </h2>
                    <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
                        A pricing model that aligns with your success. Start for free and upgrade only when your business grows.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-24">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col p-8 md:p-10 rounded-[32px] transition-all duration-300 group
                ${plan.highlight
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl shadow-purple-900/40 scale-100 lg:scale-105 z-10 ring-1 ring-white/10'
                                    : 'bg-white text-gray-900 border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/10 z-0'
                                }
              `}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-purple-700 text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 ring-4 ring-white/20">
                                    <Sparkles size={12} className="fill-purple-700/20" /> Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className={`text-lg font-bold mb-4 ${plan.highlight ? 'text-purple-100' : 'text-gray-900'}`}>{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className={`text-5xl font-extrabold tracking-tight ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                                    <span className={`text-lg font-medium ${plan.highlight ? 'text-purple-200' : 'text-gray-400'}`}>{plan.period}</span>
                                </div>
                                <p className={`text-sm ${plan.highlight ? 'text-purple-100' : 'text-gray-500'}`}>{plan.description}</p>
                            </div>

                            <div className={`p-4 rounded-2xl mb-8 flex items-center justify-center font-bold text-sm ${plan.highlight ? 'bg-white/10 text-white border border-white/20' : 'bg-purple-50 text-purple-900 border border-purple-100'
                                }`}>
                                {plan.clients}
                            </div>

                            <div className="flex-1 space-y-5 mb-10">
                                {plan.features.map((feature) => {
                                    const isAddon = feature === 'Member Payments & Billing';
                                    return (
                                        <div key={feature} className="flex items-start gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isAddon
                                                ? (plan.highlight ? 'bg-emerald-400 text-emerald-900' : 'bg-emerald-100 text-emerald-600')
                                                : (plan.highlight ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-600')
                                                }`}>
                                                {isAddon ? <Plus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
                                            </div>
                                            <span className={`text-sm font-medium ${plan.highlight ? 'text-white' : 'text-gray-600'}`}>{feature}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                className={`w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 transform active:scale-[0.98] ${plan.highlight
                                    ? 'bg-white text-purple-700 hover:bg-purple-50 shadow-lg shadow-black/10'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-200/50'
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Secondary CTA */}
                <div className="text-center">
                    <a href="#" className="inline-flex items-center gap-2 text-base font-bold text-gray-900 hover:text-purple-600 transition-colors group">
                        See all pricing plans
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-purple-500" />
                    </a>
                    <p className="text-gray-400 mt-2 text-xs">Compare features and limits for 200+ clients</p>
                </div>

            </div>
        </section>
    );
};

export default PricingSection;
