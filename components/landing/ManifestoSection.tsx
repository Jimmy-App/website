'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Heart, ArrowRight, Check } from 'lucide-react';
import { COACH_AVATARS } from './constants';

const ManifestoSection = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (email) setSubmitted(true);
    };

    return (
        <section className="py-16 md:py-32 bg-white relative overflow-hidden border-t border-gray-100" id="manifesto">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-50/60 via-white to-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/40 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-8">
                    <Heart size={12} className="fill-purple-700" />
                    Our Mission
                </div>

                <h2 className="text-4xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
                    Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Independent.</span>
                </h2>

                <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium max-w-3xl mx-auto mb-16">
                    We are building Jimmy because we believe the future of fitness is <span className="text-gray-900 font-semibold underline decoration-purple-200 decoration-4 underline-offset-4">independent coaches</span>, not faceless franchises.
                    We are here to give you the same tools the big guys have, <span className="text-gray-900 font-semibold">without the enterprise price tag.</span>
                </p>

                {/* Waitlist Form */}
                <div className="w-full max-w-md relative group">
                    {!submitted ? (
                        <div className="flex flex-col items-center">
                            <div className="relative transform transition-all hover:scale-[1.01] w-full z-20">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                                <form
                                    onSubmit={handleSubmit}
                                    className="relative flex items-center bg-white p-1.5 rounded-full border border-gray-200 shadow-xl shadow-purple-900/5 focus-within:ring-2 focus-within:ring-purple-100 focus-within:border-purple-300 transition-all duration-300"
                                >
                                    <div className="flex-1 pl-5">
                                        <input
                                            type="email"
                                            placeholder="Enter your email..."
                                            className="w-full bg-transparent border-none p-2 text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none text-base outline-none"
                                            value={email}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex-shrink-0 px-6 py-3.5 rounded-full font-bold text-white bg-purple-600 shadow-md flex items-center gap-2 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 transition-all duration-200"
                                    >
                                        Join Waitlist <ArrowRight size={16} />
                                    </button>
                                </form>
                            </div>
                            <div className="mt-8 text-xs text-gray-500 font-medium flex items-center justify-center gap-2">
                                <div className="flex -space-x-2">
                                    {COACH_AVATARS.map((url) => (
                                        <Image
                                            key={url}
                                            src={url}
                                            alt="Coach"
                                            width={24}
                                            height={24}
                                            sizes="24px"
                                            className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-gray-100"
                                            loading="lazy"
                                        />
                                    ))}
                                </div>
                                <span>Join 400+ other coaches waiting for access.</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-medium shadow-sm animate-in fade-in zoom-in slide-in-from-bottom-2">
                            <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                                <Check size={18} />
                            </div>
                            <span>You&apos;re on the list! Keep an eye on your inbox.</span>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default ManifestoSection;
