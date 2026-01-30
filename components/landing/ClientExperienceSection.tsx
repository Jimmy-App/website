'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
   WifiOff,
   Activity,
   MessageCircle,
   Play,
   Smartphone,
   Zap,
   ThumbsUp,
   Mic,
   Lock
} from 'lucide-react';

type ClientExperienceContent = {
   badgeText?: string;
   title?: string;
   subtitle?: string;
   logging?: {
      title?: string;
      body?: string;
      tagLabel?: string;
      uiExerciseName?: string;
      uiSetLabel?: string;
      uiWeightLabel?: string;
      uiIntensityLowLabel?: string;
      uiIntensityHighLabel?: string;
      uiRpeLabel?: string;
      uiButtonLabel?: string;
   };
   timer?: {
      title?: string;
      body?: string;
      uiRestLabel?: string;
      uiTimerValue?: string;
      uiLockLabel?: string;
      uiLockValue?: string;
   };
   offline?: {
      title?: string;
      body?: string;
      uiStatusLabel?: string;
   };
   chat?: {
      title?: string;
      body?: string;
      uiVoiceNoteLabel?: string;
   };
   sync?: {
      title?: string;
      body?: string;
      stats?: { label?: string; value?: string }[];
      appleHealthAlt?: string;
      googleFitAlt?: string;
   };
   video?: {
      title?: string;
      body?: string;
   };
};

type ClientExperienceProps = {
   content?: ClientExperienceContent | null;
};

const ClientExperience = ({ content }: ClientExperienceProps) => {
   const resolvedBadgeText = content?.badgeText || 'The Client Experience';
   const resolvedTitle = content?.title || 'Frictionless, fun workout tracking.';
   const resolvedSubtitle = content?.subtitle || "Your clients don't want a spreadsheet on their phone. They want an experience.";

   const resolvedLogging = {
      title: content?.logging?.title || 'One thumb is enough.',
      body: content?.logging?.body || 'Big buttons, intuitive RPE sliders, and auto-advancing sets.',
      tagLabel: content?.logging?.tagLabel || 'Client favorite',
      uiExerciseName: content?.logging?.uiExerciseName || 'Bench Press',
      uiSetLabel: content?.logging?.uiSetLabel || 'Set 2 of 4',
      uiWeightLabel: content?.logging?.uiWeightLabel || '185 lbs',
      uiIntensityLowLabel: content?.logging?.uiIntensityLowLabel || 'Easy',
      uiIntensityHighLabel: content?.logging?.uiIntensityHighLabel || 'Hard',
      uiRpeLabel: content?.logging?.uiRpeLabel || 'RPE 8',
      uiButtonLabel: content?.logging?.uiButtonLabel || 'Log Set'
   };

   const resolvedTimer = {
      title: content?.timer?.title || 'The timer that follows them.',
      body: content?.timer?.body || 'Timer stays visible on the Lock Screen and Dynamic Island while they switch apps or change music.',
      uiRestLabel: content?.timer?.uiRestLabel || 'Rest',
      uiTimerValue: content?.timer?.uiTimerValue || '00:42',
      uiLockLabel: content?.timer?.uiLockLabel || 'Lock Screen',
      uiLockValue: content?.timer?.uiLockValue || 'Resting: 00:42'
   };

   const resolvedOffline = {
      title: content?.offline?.title || 'Works in the "Dungeon" Gyms.',
      body: content?.offline?.body || 'Zero loading spinners. Works fully offline in basement gyms and syncs when they surface.',
      uiStatusLabel: content?.offline?.uiStatusLabel || 'Auto-sync active'
   };

   const resolvedChat = {
      title: content?.chat?.title || 'Chat with your Coach.',
      body: content?.chat?.body || 'Need help with form? Send a video or voice note directly in the app. Clients can also join Community Groups to stay motivated with your team.',
      uiVoiceNoteLabel: content?.chat?.uiVoiceNoteLabel || 'Voice Note • 0:24'
   };

   const resolvedSyncStats = content?.sync?.stats?.length
      ? content.sync.stats
      : [
           { label: 'Steps', value: '10k+' },
           { label: 'Sleep', value: 'Synced' }
        ];

   const resolvedSync = {
      title: content?.sync?.title || 'Your watch talks to Jimmy.',
      body: content?.sync?.body || "Seamless integration with Apple Health & Google Fit. Steps, sleep, and cardio data sync automatically, so they don't have to enter it manually.",
      stats: resolvedSyncStats,
      appleHealthAlt: content?.sync?.appleHealthAlt || 'Apple Health',
      googleFitAlt: content?.sync?.googleFitAlt || 'Google Fit'
   };

   const resolvedVideo = {
      title: content?.video?.title || 'No more "What is this exercise?".',
      body: content?.video?.body || 'Every exercise comes with high-quality video demonstrations. Clients can watch, learn, and perform with confidence.'
   };
   const [isPreviewOpen, setIsPreviewOpen] = useState(false);

   return (
      <section className="py-12 md:py-24 bg-white relative overflow-hidden border-t border-gray-100" id="experience">

         {/* Background Decor */}
         <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-purple-50/40 rounded-full blur-3xl -mr-64 pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-3xl -ml-32 pointer-events-none" />

         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-bold uppercase tracking-wider mb-6">
                  <Smartphone size={12} className="fill-purple-700" />
                  {resolvedBadgeText}
               </div>
               <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
                  {resolvedTitle}
               </h2>
               <p className="text-xl text-gray-500 leading-relaxed">
                  {resolvedSubtitle}
               </p>
            </div>

            {/* BENTO GRID - ALL 6 FEATURES WITH ORIGINAL TEXTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">

               {/* Feature C: Zero-Friction Logging (Wide) */}
               <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20">
                  <div className="flex flex-col sm:flex-row gap-8 items-start h-full">
                     <div className="flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-600 transition-transform group-hover:scale-110 duration-300">
                           <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{resolvedLogging.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                           {resolvedLogging.body}
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                           <ThumbsUp size={12} className="text-purple-600" /> {resolvedLogging.tagLabel}
                        </div>
                     </div>

                     {/* UI Visual */}
                     <div
                        className="w-full sm:w-[260px] rounded-2xl bg-transparent overflow-hidden relative transition-colors self-center mt-auto sm:mt-0"
                        role="button"
                        tabIndex={0}
                        onClick={() => setIsPreviewOpen((prev) => !prev)}
                        onKeyDown={(event) => {
                           if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setIsPreviewOpen((prev) => !prev);
                           }
                        }}
                        aria-pressed={isPreviewOpen}
                     >
                        <Image
                           src="/assets/photo/mock/jimmy-screen-home.svg"
                           alt="Jimmy mobile home screen"
                           width={520}
                           height={1040}
                           className={`w-full h-[200px] sm:h-[220px] md:h-[240px] object-cover transition-[object-position] duration-700 ease-out group-hover:object-bottom ${
                              isPreviewOpen ? 'object-bottom' : 'object-top'
                           }`}
                           sizes="(max-width: 640px) 90vw, 260px"
                        />
                     </div>
                  </div>
               </div>

               {/* Feature B: Live Activities (USP) (Tall) */}
               <div className="lg:row-span-2 group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20 flex flex-col">
                  <div className="mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-600 transition-transform group-hover:scale-110 duration-300">
                        <Activity size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">{resolvedTimer.title}</h3>
                     <p className="text-gray-500 text-sm leading-relaxed">
                        {resolvedTimer.body}
                     </p>
                  </div>

                  <div className="mt-auto flex flex-col gap-4">
                     <div className="bg-gray-900 rounded-[24px] h-[44px] w-full flex items-center justify-between px-3 text-white shadow-md transform group-hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center">
                              <Zap size={12} fill="currentColor" />
                           </div>
                           <span className="text-[10px] font-medium text-gray-300">{resolvedTimer.uiRestLabel}</span>
                        </div>
                        <div className="text-lg font-bold text-purple-400 font-mono tracking-widest mr-1">{resolvedTimer.uiTimerValue}</div>
                     </div>

                     <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center gap-3 group-hover:bg-white group-hover:border-purple-100 transition-colors relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-gray-300"><Lock size={14} /></div>
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                           <Activity size={18} className="text-purple-600" />
                        </div>
                        <div>
                           <div className="text-[10px] text-gray-400 uppercase font-bold">{resolvedTimer.uiLockLabel}</div>
                           <div className="text-sm font-bold text-gray-900">{resolvedTimer.uiLockValue}</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Feature A: Offline-First Architecture */}
               <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/20">
                  <div className="flex flex-col h-full">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 text-emerald-600 transition-transform group-hover:scale-110 duration-300">
                        <WifiOff size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">{resolvedOffline.title}</h3>
                     <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        {resolvedOffline.body}
                     </p>
                     <div className="mt-auto flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg w-fit border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        {resolvedOffline.uiStatusLabel}
                     </div>
                  </div>
               </div>

               {/* Feature D: Always Connected */}
               <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-600 transition-transform group-hover:scale-110 duration-300">
                     <MessageCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{resolvedChat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                     {resolvedChat.body}
                  </p>
                  <div className="mt-auto bg-gray-50 rounded-xl p-3 border border-gray-100 group-hover:bg-white group-hover:border-purple-100 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                           <Mic size={14} />
                        </div>
                        <div className="flex-1">
                           <div className="h-1.5 w-2/3 bg-gray-200 rounded-full mb-1 relative overflow-hidden">
                              <div className="absolute left-0 top-0 h-full w-1/2 bg-purple-500 rounded-full"></div>
                           </div>
                           <div className="text-[9px] text-gray-400">{resolvedChat.uiVoiceNoteLabel}</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Feature E: Automated Health Sync (Wide) */}
               <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20">
                  <div className="flex flex-col h-full">
                     <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-600 transition-transform group-hover:scale-110 duration-300">
                        <Activity size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">{resolvedSync.title}</h3>
                     <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
                        {resolvedSync.body}
                     </p>

                     <div className="mt-auto flex items-center gap-6">
                        <div className="flex items-center gap-3">
                           <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl border border-gray-200 shadow-sm group-hover:border-purple-200 transition-all duration-300 group-hover:scale-105">
                              <Image src="/assets/logo/apple-health.svg" alt={resolvedSync.appleHealthAlt} width={20} height={20} className="w-5 h-5" />
                           </div>
                           <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl border border-gray-200 shadow-sm group-hover:border-purple-200 transition-all duration-300 group-hover:scale-105">
                              <Image src="/assets/logo/google-fit.svg" alt={resolvedSync.googleFitAlt} width={20} height={20} className="w-5 h-5" />
                           </div>
                        </div>

                        <div className="flex-1 h-px bg-gray-100 relative hidden sm:block">
                           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-200 group-hover:bg-purple-600 transition-colors"></div>
                        </div>

                        <div className="flex gap-2">
                           {resolvedSync.stats.slice(0, 2).map((stat, statIndex) => (
                              <div key={`${stat.label || 'stat'}-${statIndex}`} className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg text-center group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors">
                                 <div className="text-[9px] text-gray-400 uppercase font-bold">{stat.label}</div>
                                 <div className="text-xs font-bold text-gray-900">{stat.value}</div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Feature F: Visual Guidance */}
               <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20">
                  <div className="flex flex-col h-full justify-between">
                     <div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-5 shadow-md shadow-purple-200 transition-transform group-hover:scale-110 duration-300">
                           <Play size={20} fill="currentColor" className="ml-0.5" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{resolvedVideo.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                           {resolvedVideo.body}
                        </p>
                     </div>
                     <div className="mt-6 relative rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-200 group-hover:border-purple-100 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform">
                              <Play size={16} className="text-purple-600 ml-0.5" fill="currentColor" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>
   );
};

export default ClientExperience;
