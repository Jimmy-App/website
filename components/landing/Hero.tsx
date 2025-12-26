'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

import DashboardMockup from './DashboardMockup';
import { COACH_AVATARS } from './constants';

type HeroContent = {
  badgeText?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  mockupUrlLabel?: string;
  socialProofText?: string;
  successMessage?: string;
};

type HeroProps = {
  waitlistLabel?: string;
  brandLabel?: string;
  content?: HeroContent | null;
};

const Hero = ({ waitlistLabel, brandLabel, content }: HeroProps) => {
  const resolvedWaitlistLabel = waitlistLabel || 'Join Waitlist';
  const resolvedBadgeText = content?.badgeText || 'Waitlist Open';
  const resolvedTitle = content?.title || 'The operating system for';
  const resolvedTitleHighlight = content?.titleHighlight || 'independent coaches';
  const resolvedBrandLabel = brandLabel || 'Jimmy';
  const resolvedSubtitleTemplate = content?.subtitle || 'Stop hacking together Excel and WhatsApp. {brand} is the workspace built for solopreneurs to manage clients, programming, and progress.';
  const resolvedInputPlaceholder = content?.inputPlaceholder || 'Enter your email...';
  const resolvedMockupUrlLabel = content?.mockupUrlLabel || 'app.jimmycoach.com';
  const resolvedSocialProofText = content?.socialProofText || 'Join 400+ other coaches waiting for access.';
  const resolvedSuccessMessage = content?.successMessage || "You're on the list! Keep an eye on your inbox.";
  const subtitleParts = resolvedSubtitleTemplate.split('{brand}');
  const subtitleHasBrand = resolvedSubtitleTemplate.includes('{brand}');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = status === 'submitting';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || isSubmitting) return;
    setStatus('submitting');
    setErrorMessage(null);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Unable to join the waitlist.');
      }
      setStatus('success');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to join the waitlist.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  return (
    <section className="relative pt-20 lg:pt-40 pb-0 overflow-hidden bg-white" id="waitlist">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-white border border-purple-100 shadow-[0_2px_10px_-3px_rgba(124,58,237,0.1)] hover:border-purple-200 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
          </span>
          <span className="text-[11px] font-bold text-purple-900 tracking-wider uppercase">
            {resolvedBadgeText}
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1] max-w-4xl">
          {resolvedTitle}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
            {resolvedTitleHighlight}
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed">
          {subtitleHasBrand ? (
            <>
              {subtitleParts[0]}
              <span className="text-gray-900 font-medium">{resolvedBrandLabel}</span>
              {subtitleParts[1]}
            </>
          ) : (
            resolvedSubtitleTemplate
          )}
        </p>

        <div className="w-full max-w-md relative group mb-24 z-20">
          {status !== 'success' ? (
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
                      placeholder={resolvedInputPlaceholder}
                      className="w-full bg-transparent border-none p-2 text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none text-base outline-none"
                      value={email}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setEmail(event.target.value);
                        if (status === 'error') {
                          setStatus('idle');
                          setErrorMessage(null);
                        }
                      }}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-shrink-0 px-6 py-3.5 rounded-full font-bold text-white bg-purple-600 shadow-md flex items-center gap-2 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 transition-all duration-200"
                  >
                    {isSubmitting ? 'Joining...' : resolvedWaitlistLabel}{' '}
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
              {errorMessage && (
                <p className="mt-4 text-sm text-red-500 font-medium">{errorMessage}</p>
              )}
              <div className="mt-8 relative z-30 text-xs text-gray-500 font-medium flex items-center justify-center gap-2">
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
                <span>{resolvedSocialProofText}</span>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-medium shadow-sm animate-in fade-in zoom-in slide-in-from-bottom-2">
              <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                <Check size={18} />
              </div>
              <span>{resolvedSuccessMessage}</span>
            </div>
          )}
        </div>
        <DashboardMockup urlLabel={resolvedMockupUrlLabel} />
      </div>
    </section>
  );
};

export default Hero;
