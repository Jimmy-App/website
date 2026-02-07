'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { COACH_AVATARS } from './constants';

type WaitlistSignupFormProps = {
  waitlistLabel: string;
  inputPlaceholder: string;
  successMessage: string;
  socialProofText: string;
  className?: string;
  socialProofClassName?: string;
};

const DEFAULT_SOCIAL_PROOF_CLASSNAME =
  'mt-8 text-sm text-gray-500 font-medium flex items-center justify-center gap-2';

const WaitlistSignupForm = ({
  waitlistLabel,
  inputPlaceholder,
  successMessage,
  socialProofText,
  className = 'w-full max-w-md relative group',
  socialProofClassName = DEFAULT_SOCIAL_PROOF_CLASSNAME,
}: WaitlistSignupFormProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiFiredRef = useRef(false);

  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#7c3aed', '#22c55e', '#f59e0b', '#ec4899', '#ffffff'];

    canvas.width = canvas.offsetWidth || 600;
    canvas.height = canvas.offsetHeight || 600;

    const particles = Array.from({ length: 50 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 2) * 10,
      life: 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
    }));

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.5;
        particle.life -= 2;

        ctx.fillStyle = particle.color;
        ctx.globalAlpha = Math.max(0, particle.life / 100);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        if (particle.life <= 0) {
          particles.splice(i, 1);
          i -= 1;
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    if (isSuccess && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      fireConfetti();
    }
    if (!isSuccess) {
      confettiFiredRef.current = false;
    }
  }, [isSuccess]);

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
    <div className={className}>
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes success-pulse {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          50% {
            transform: scale(1.08);
          }
          70% {
            transform: scale(0.98);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes success-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.35);
          }
          50% {
            box-shadow:
              0 0 50px rgba(16, 185, 129, 0.55),
              0 0 80px rgba(16, 185, 129, 0.35);
          }
        }
        @keyframes checkmark-draw {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes celebration-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
        }
        .animate-success-glow {
          animation: success-glow 2s ease-in-out infinite;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkmark-draw 0.4s ease-out 0.3s forwards;
        }
        .animate-ring {
          animation: celebration-ring 0.8s ease-out forwards;
        }
      `}</style>

      <div
        className="relative w-full min-h-[60px] perspective-1000"
        style={{ perspective: '1000px' }}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-50 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2"
        />

        <div
          className={`absolute inset-0 flex items-center justify-center rounded-full border border-green-200 bg-green-50 px-4 text-sm font-semibold text-green-800 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isSuccess ? 'animate-success-pulse animate-success-glow opacity-100' : 'pointer-events-none opacity-0'
          }`}
          style={{
            transform: isSuccess ? 'rotateX(0deg) scale(1)' : 'rotateX(-90deg) scale(0.95)',
          }}
        >
          {isSuccess ? (
            <>
              <div
                className="animate-ring absolute left-1/2 top-1/2 h-full w-full rounded-full border-2 border-emerald-400"
                style={{ animationDelay: '0s' }}
              />
              <div
                className="animate-ring absolute left-1/2 top-1/2 h-full w-full rounded-full border-2 border-emerald-300"
                style={{ animationDelay: '0.15s' }}
              />
              <div
                className="animate-ring absolute left-1/2 top-1/2 h-full w-full rounded-full border-2 border-emerald-200"
                style={{ animationDelay: '0.3s' }}
              />
            </>
          ) : null}

          <div className={`flex items-center gap-2 ${isSuccess ? 'animate-bounce-in' : ''}`}>
            <div className="rounded-full bg-green-100 p-1 text-green-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  className={isSuccess ? 'animate-checkmark' : ''}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-center leading-snug">{successMessage}</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`relative h-[60px] w-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isSuccess ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          style={{
            transform: isSuccess ? 'rotateX(90deg) scale(0.96)' : 'rotateX(0deg) scale(1)',
          }}
        >
          <div className="relative h-full w-full">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-200 to-indigo-200 blur opacity-20 transition duration-500 group-hover:opacity-50" />
            <div className="relative flex h-full items-center rounded-full border border-gray-200 bg-white p-1.5 shadow-xl shadow-purple-900/5 transition-all duration-300 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100">
              <div className="flex-1 pl-5">
                <input
                  type="email"
                  placeholder={inputPlaceholder}
                  className="w-full border-none bg-transparent p-2 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
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
                className="flex min-w-[132px] flex-shrink-0 items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 sm:text-base"
              >
                {isSubmitting ? (
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <>
                    {waitlistLabel}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {errorMessage ? <p className="mt-4 text-sm font-medium text-red-500">{errorMessage}</p> : null}

      <div className={socialProofClassName}>
        <div className="flex -space-x-2">
          {COACH_AVATARS.map((url) => (
            <Image
              key={url}
              src={url}
              alt="Coach"
              width={24}
              height={24}
              sizes="24px"
              className="h-6 w-6 rounded-full border-2 border-white ring-1 ring-gray-100"
              loading="lazy"
            />
          ))}
        </div>
        <span>{socialProofText}</span>
      </div>
    </div>
  );
};

export default WaitlistSignupForm;
