import Link from 'next/link';
import Image from 'next/image';
import DeferredVimeoEmbed from './DeferredVimeoEmbed';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  GripVertical,
  Layers,
  MessageSquare,
  Play,
  Plus,
  TrendingUp,
} from 'lucide-react';
import {
  LANDING_SECTION_BADGE_CLASS,
  LANDING_SECTION_TITLE_CLASS,
} from './constants';

type CoachFeatureContent = {
  badgeText?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  builder?: {
    title?: string;
    body?: string;
    weekLabel?: string;
    exerciseItems?: string[];
    exerciseDetail?: string;
  };
  payments?: {
    title?: string;
    body?: string;
    revenueLabel?: string;
    revenueDelta?: string;
    revenueAmount?: string;
    notificationTitle?: string;
    notificationBody?: string;
  };
  chat?: {
    title?: string;
    body?: string;
    messageText?: string;
    avatarInitials?: string;
  };
  health?: {
    title?: string;
    body?: string;
    stats?: { label?: string; value?: string }[];
    syncedLabel?: string;
    appleHealthAlt?: string;
    googleFitAlt?: string;
  };
  video?: {
    title?: string;
    body?: string;
  };
  ctaLabel?: string;
  ctaHelperText?: string;
};

type CoachFeaturesProps = {
  content?: CoachFeatureContent | null;
  ctaHref?: string;
};

const CoreFeaturesSection = ({ content, ctaHref = '/for-coaches' }: CoachFeaturesProps) => {
  const resolvedBadgeText = content?.badgeText || 'The Coach Experience';
  const resolvedTitle = content?.title || 'Program at the';
  const resolvedTitleHighlight = content?.titleHighlight || 'speed of thought.';
  const resolvedSubtitle =
    content?.subtitle ||
    'We stripped away the clunky menus and slow loading times. Everything you need to run your business is one click away.';
  const resolvedCtaLabel = content?.ctaLabel || 'See full platform features →';
  const resolvedCtaHelperText =
    content?.ctaHelperText ||
    'Create programs, automate check-ins, and manage payments — all in one dashboard.';

  const resolvedBuilder = {
    title: content?.builder?.title || 'Drag-and-drop with Video',
    body:
      content?.builder?.body ||
      'Create programs in seconds. Attach videos, save templates, and automate progressions faster than writing on paper.',
    weekLabel: content?.builder?.weekLabel || 'Week 1: Strength Block',
    exerciseItems: content?.builder?.exerciseItems?.length
      ? content.builder.exerciseItems
      : ['Back Squat', 'Romanian Deadlift', 'Walking Lunges'],
    exerciseDetail: content?.builder?.exerciseDetail || '3 sets x 8 reps @ RPE 8',
  };

  const resolvedPayments = {
    title: content?.payments?.title || 'Get paid while you sleep',
    body:
      content?.payments?.body ||
      'Automate your income. Charge clients directly through the app and track revenue without chasing transfers.',
    revenueLabel: content?.payments?.revenueLabel || 'Monthly Revenue',
    revenueDelta: content?.payments?.revenueDelta || '+12%',
    revenueAmount: content?.payments?.revenueAmount || '$4,250.00',
    notificationTitle: content?.payments?.notificationTitle || 'New Subscription',
    notificationBody: content?.payments?.notificationBody || 'Anna K. just paid $150',
  };

  const resolvedChat = {
    title: content?.chat?.title || '1:1 & Group Chat',
    body:
      content?.chat?.body ||
      'Direct real-time chat included. Send voice notes, videos, and feedback instantly. Group chats for community.',
    messageText:
      content?.chat?.messageText || 'Form felt way better today! Should I increase weight?',
    avatarInitials: content?.chat?.avatarInitials || 'JD',
  };

  const resolvedHealthStats = content?.health?.stats?.length
    ? content.health.stats
    : [
        { label: 'Steps', value: '12,403' },
        { label: 'Sleep', value: '7h 42m' },
      ];

  const resolvedHealth = {
    title: content?.health?.title || 'The Full Picture',
    body:
      content?.health?.body ||
      'We sync with Apple Health & Google Fit. See steps, sleep, and activity data automatically.',
    stats: resolvedHealthStats,
    syncedLabel: content?.health?.syncedLabel || 'Synced',
    appleHealthAlt: content?.health?.appleHealthAlt || 'Apple Health',
    googleFitAlt: content?.health?.googleFitAlt || 'Google Fit',
  };

  const resolvedVideo = {
    title: content?.video?.title || 'No more "What is this exercise?".',
    body:
      content?.video?.body ||
      'Every exercise comes with high-quality video demonstrations. Clients can watch, learn, and perform with confidence.',
  };

  const baseCardClass =
    'flex h-full flex-col rounded-[24px] border border-[#e1e8f2] bg-white p-6 sm:p-7 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.16)] transition-transform duration-200 hover:-translate-y-0.5';

  return (
    <section
      className="relative overflow-hidden border-t border-[#edf1f6] bg-white py-14 md:py-24"
      id="features"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className={`mb-5 ${LANDING_SECTION_BADGE_CLASS}`}>
            <Layers size={12} />
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

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          <article className={`${baseCardClass} lg:col-span-7`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7edf5] bg-[#f8fbff] text-slate-500">
              <Layers size={20} />
            </div>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {resolvedBuilder.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-500">{resolvedBuilder.body}</p>

            <div className="mt-auto pt-6">
              <div className="rounded-2xl border border-[#dbe5f1] bg-[#f8fbff] p-4">
                <div className="flex items-center justify-between border-b border-[#e7edf5] pb-3">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    {resolvedBuilder.weekLabel}
                  </span>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dbe5f1] bg-white text-slate-500"
                    aria-label="Add exercise"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {resolvedBuilder.exerciseItems.map((exercise, index) => (
                    <div
                      key={`${exercise}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-[#e7edf5] bg-white px-3 py-2.5"
                    >
                      <GripVertical size={15} className="text-slate-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{exercise}</p>
                        <p className="truncate text-xs text-slate-500">
                          {resolvedBuilder.exerciseDetail}
                        </p>
                      </div>
                      <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#e7edf5] bg-[#f8fbff] text-slate-500">
                        <Play size={12} className="translate-x-[1px]" fill="currentColor" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className={`${baseCardClass} lg:col-span-5`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7edf5] bg-[#f8fbff] text-slate-500">
              <CreditCard size={20} />
            </div>
            <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {resolvedPayments.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-500">{resolvedPayments.body}</p>

            <div className="mt-auto pt-6">
              <div className="rounded-2xl border border-[#dbe5f1] bg-[#f8fbff] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                      {resolvedPayments.revenueLabel}
                    </p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                      {resolvedPayments.revenueAmount}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#dfe7f2] bg-white px-2.5 py-1 text-xs font-semibold text-[#5b47ff]">
                    <TrendingUp size={12} />
                    {resolvedPayments.revenueDelta}
                  </span>
                </div>

                <div className="mt-4 grid h-14 grid-cols-8 items-end gap-1.5">
                  {[26, 38, 32, 44, 56, 48, 62, 70].map((height, index) => (
                    <div
                      key={`bar-${index}`}
                      className="rounded-md bg-[#d7e1ef]"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#e7edf5] bg-white px-3 py-2.5">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f0ebff] text-[#5b47ff]">
                    $
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {resolvedPayments.notificationTitle}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {resolvedPayments.notificationBody}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className={`${baseCardClass} lg:col-span-4`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7edf5] bg-[#f8fbff] text-slate-500">
              <MessageSquare size={20} />
            </div>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {resolvedChat.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-500">{resolvedChat.body}</p>

            <div className="mt-auto pt-6">
              <div className="min-h-[224px] overflow-hidden rounded-2xl border border-[#dbe5f1] bg-white">
                <div className="flex h-9 items-center justify-between border-b border-[#e7edf5] bg-[#f8fbff] px-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Live chat
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#dfe7f2] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#5b47ff]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5b47ff]" />
                    online
                  </span>
                </div>

                <div className="grid min-h-[188px] grid-cols-[110px_minmax(0,1fr)]">
                  <div className="border-r border-[#e7edf5] bg-[#f8fbff] p-2">
                    <div className="space-y-2">
                      {[0, 1, 2].map((row) => (
                        <div
                          key={`thread-${row}`}
                          className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
                            row === 0
                              ? 'border-[#d8ddff] bg-white'
                              : 'border-[#e7edf5] bg-white/70'
                          }`}
                        >
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0ebff] text-[11px] font-semibold text-[#5b47ff]">
                            {row === 0 ? resolvedChat.avatarInitials : 'CL'}
                          </span>
                          <span className="h-1.5 flex-1 rounded-full bg-[#d7e1ef]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex h-full flex-col bg-white p-2.5 pb-2">
                    <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-[#e7edf5] bg-[#f8fbff] px-3 py-2 text-xs leading-relaxed text-slate-600">
                      {resolvedChat.messageText}
                    </div>
                    <div className="mt-2 ml-auto max-w-[86%] rounded-2xl rounded-tr-sm bg-[#5b47ff] px-3 py-2 text-xs text-white">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                          <Play size={9} fill="currentColor" className="translate-x-[1px]" />
                        </div>
                        <div className="flex h-2.5 items-end gap-0.5">
                          {[5, 8, 4, 10, 6, 7].map((level, index) => (
                            <span
                              key={`wave-${index}`}
                              className="w-0.5 rounded-full bg-white/80"
                              style={{ height: `${level * 10}%` }}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-white/80">0:24</span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-2 rounded-full border border-[#e7edf5] bg-[#f8fbff] px-2 py-1.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#dbe5f1] bg-white text-xs text-slate-400">
                        +
                      </span>
                      <span className="h-1.5 flex-1 rounded-full bg-[#d7e1ef]" />
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#5b47ff] text-[11px] font-semibold text-white">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className={`${baseCardClass} lg:col-span-4`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7edf5] bg-[#f8fbff] text-slate-500">
              <Activity size={20} />
            </div>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {resolvedHealth.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-500">{resolvedHealth.body}</p>

            <div className="mt-auto pt-6">
              <div className="min-h-[224px] overflow-hidden rounded-2xl border border-[#dbe5f1] bg-white">
                <div className="flex h-9 items-center justify-between border-b border-[#e7edf5] bg-[#f8fbff] px-3">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#e7edf5] bg-white">
                      <Image
                        src="/assets/logo/apple-health.svg"
                        alt={resolvedHealth.appleHealthAlt}
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#e7edf5] bg-white">
                      <Image
                        src="/assets/logo/google-fit.svg"
                        alt={resolvedHealth.googleFitAlt}
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#dfe7f2] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#5b47ff]">
                    <CheckCircle2 size={11} />
                    {resolvedHealth.syncedLabel}
                  </span>
                </div>

                <div className="min-h-[188px] bg-[#f8fbff] p-3">
                  <div className="rounded-xl border border-[#e7edf5] bg-white p-2.5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Weekly trend
                      </span>
                      <ArrowUpRight size={14} className="text-slate-400" />
                    </div>
                    <div className="grid h-14 grid-cols-10 items-end gap-1">
                      {[32, 40, 36, 45, 49, 42, 58, 52, 61, 68].map((height, index) => (
                        <span
                          key={`health-bar-${index}`}
                          className={`rounded-sm ${
                            index > 6 ? 'bg-[#5b47ff]' : 'bg-[#d7e1ef]'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-3 gap-2">
                    {resolvedHealth.stats.slice(0, 2).map((stat, index) => (
                      <div
                        key={`${stat.label || 'stat'}-${index}`}
                        className="rounded-lg border border-[#e7edf5] bg-white px-2 py-2 text-center"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                          {stat.label}
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-slate-800">{stat.value}</p>
                      </div>
                    ))}
                    <div className="rounded-lg border border-[#e7edf5] bg-white px-2 py-2 text-center">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Goal
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-[#5b47ff]">92%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className={`${baseCardClass} lg:col-span-4`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e7edf5] bg-[#f8fbff] text-slate-500">
              <Play size={18} fill="currentColor" className="translate-x-[1px]" />
            </div>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {resolvedVideo.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-500">{resolvedVideo.body}</p>

            <div className="mt-auto pt-6">
              <div className="rounded-2xl border border-[#dbe5f1] bg-[#f8fbff] p-4">
                <DeferredVimeoEmbed videoId="999535716" title="one arm cable rows" />
              </div>
            </div>
          </article>
        </div>

        <div className="mt-12 text-center">
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 whitespace-nowrap text-base font-bold text-gray-900 transition-colors hover:text-purple-600"
          >
            {resolvedCtaLabel}
          </Link>
          <p className="mt-2 text-base text-gray-400 sm:whitespace-nowrap">{resolvedCtaHelperText}</p>
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;
