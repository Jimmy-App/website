'use client';

import Image from 'next/image';
import {
   WifiOff,
   Activity,
   MessageCircle,
   Play,
   Check,
   Smartphone,
   Zap,
   ThumbsUp,
   Mic,
   Lock
} from 'lucide-react';

const ClientExperience = () => {
   return (
      <section className="py-12 md:py-24 bg-white relative overflow-hidden border-t border-gray-100">

         {/* Background Decor */}
         <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-purple-50/40 rounded-full blur-3xl -mr-64 pointer-events-none" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-3xl -ml-32 pointer-events-none" />

         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-bold uppercase tracking-wider mb-6">
                  <Smartphone size={12} className="fill-purple-700" />
                  The Client Experience
               </div>
               <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
                  Frictionless, fun workout tracking.
               </h2>
               <p className="text-xl text-gray-500 leading-relaxed">
                  Your clients don&apos;t want a spreadsheet on their phone. They want an experience.
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">One thumb is enough.</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                           Big buttons, intuitive RPE sliders, and auto-advancing sets.
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                           <ThumbsUp size={12} className="text-purple-600" /> Client favorite
                        </div>
                     </div>

                     {/* UI Visual */}
                     <div className="w-full sm:w-[260px] bg-gray-50 rounded-2xl border border-gray-100 p-5 relative group-hover:bg-white group-hover:border-purple-100 transition-colors self-center mt-auto sm:mt-0">
                        <div className="flex justify-between items-center mb-4">
                           <div>
                              <div className="text-sm font-bold text-gray-900">Bench Press</div>
                              <div className="text-[10px] text-gray-400">Set 2 of 4</div>
                           </div>
                           <div className="bg-white border border-gray-200 text-gray-900 text-xs font-bold px-2 py-1 rounded">185 lbs</div>
                        </div>

                        <div className="mb-5">
                           <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2">
                              <span>Easy</span>
                              <span className="text-purple-600">RPE 8</span>
                              <span>Hard</span>
                           </div>
                           <div className="h-2 bg-gray-200 rounded-full relative overflow-hidden">
                              <div className="absolute top-0 left-0 h-full w-3/4 bg-purple-500 rounded-full"></div>
                           </div>
                        </div>

                        <div className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 group-hover:bg-purple-600 group-hover:shadow-purple-200 transition-all">
                           <Check size={14} /> Log Set
                        </div>
                     </div>
                  </div>
               </div>

               {/* Feature B: Live Activities (USP) (Tall) */}
               <div className="lg:row-span-2 group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20 flex flex-col">
                  <div className="mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-600 transition-transform group-hover:scale-110 duration-300">
                        <Activity size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">The timer that follows them.</h3>
                     <p className="text-gray-500 text-sm leading-relaxed">
                        Timer stays visible on the Lock Screen and Dynamic Island while they switch apps or change music.
                     </p>
                  </div>

                  <div className="mt-auto flex flex-col gap-4">
                     <div className="bg-gray-900 rounded-[24px] h-[44px] w-full flex items-center justify-between px-3 text-white shadow-md transform group-hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center">
                              <Zap size={12} fill="currentColor" />
                           </div>
                           <span className="text-[10px] font-medium text-gray-300">Rest</span>
                        </div>
                        <div className="text-lg font-bold text-purple-400 font-mono tracking-widest mr-1">00:42</div>
                     </div>

                     <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center gap-3 group-hover:bg-white group-hover:border-purple-100 transition-colors relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-gray-300"><Lock size={14} /></div>
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                           <Activity size={18} className="text-purple-600" />
                        </div>
                        <div>
                           <div className="text-[10px] text-gray-400 uppercase font-bold">Lock Screen</div>
                           <div className="text-sm font-bold text-gray-900">Resting: 00:42</div>
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
                     <h3 className="text-xl font-bold text-gray-900 mb-2">Works in the &quot;Dungeon&quot; Gyms.</h3>
                     <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Zero loading spinners. Works fully offline in basement gyms and syncs when they surface.
                     </p>
                     <div className="mt-auto flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg w-fit border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Auto-sync active
                     </div>
                  </div>
               </div>

               {/* Feature D: Always Connected */}
               <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-600 transition-transform group-hover:scale-110 duration-300">
                     <MessageCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Chat with your Coach.</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                     Need help with form? Send a video or voice note directly in the app. Clients can also join Community Groups to stay motivated with your team.
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
                           <div className="text-[9px] text-gray-400">Voice Note • 0:24</div>
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
                     <h3 className="text-xl font-bold text-gray-900 mb-2">Your watch talks to Jimmy.</h3>
                     <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
                        Seamless integration with Apple Health & Google Fit. Steps, sleep, and cardio data sync automatically, so they don&apos;t have to enter it manually.
                     </p>

                     <div className="mt-auto flex items-center gap-6">
                        <div className="flex items-center gap-3">
                           <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl border border-gray-200 shadow-sm group-hover:border-purple-200 transition-all duration-300 group-hover:scale-105">
                              <Image src="/assets/logo/apple-health.svg" alt="Apple Health" width={20} height={20} className="w-5 h-5" />
                           </div>
                           <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl border border-gray-200 shadow-sm group-hover:border-purple-200 transition-all duration-300 group-hover:scale-105">
                              <Image src="/assets/logo/google-fit.svg" alt="Google Fit" width={20} height={20} className="w-5 h-5" />
                           </div>
                        </div>

                        <div className="flex-1 h-px bg-gray-100 relative hidden sm:block">
                           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-200 group-hover:bg-purple-600 transition-colors"></div>
                        </div>

                        <div className="flex gap-2">
                           <div className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg text-center group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors">
                              <div className="text-[9px] text-gray-400 uppercase font-bold">Steps</div>
                              <div className="text-xs font-bold text-gray-900">10k+</div>
                           </div>
                           <div className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg text-center group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors">
                              <div className="text-[9px] text-gray-400 uppercase font-bold">Sleep</div>
                              <div className="text-xs font-bold text-gray-900">Synced</div>
                           </div>
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No more &quot;What is this exercise?&quot;.</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                           Every exercise comes with high-quality video demonstrations. Clients can watch, learn, and perform with confidence.
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
