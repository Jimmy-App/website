import Image from 'next/image';
import { 
  Activity, 
  CreditCard, 
  MessageSquare, 
  Layers, 
  Plus, 
  Play, 
  CheckCircle2,
  Zap,
  ArrowUpRight,
  TrendingUp,
  GripVertical
} from 'lucide-react';

const CoachFeatures = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
      {/* Background decoration - Simplified Purple Tones */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-50/30 rounded-full blur-3xl -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header - CENTERED */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-bold uppercase tracking-wider mb-6">
            <Zap size={12} className="fill-purple-700" />
            The Coach Experience
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Program at the <span className="text-purple-600">speed of thought.</span>
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed mx-auto">
            We stripped away the clunky menus and slow loading times. 
            Everything you need to run your business is one click away.
          </p>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* FEATURE A: Rapid Flow Builder */}
          <div className="lg:col-span-7 group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20">
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-600 transition-transform group-hover:scale-105 duration-300">
                  <Layers size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Drag-and-drop with Video</h3>
                <p className="text-gray-500 leading-relaxed">
                  Create programs in seconds. Attach videos, save templates, and automate progressions faster than writing on paper.
                </p>
              </div>

              {/* UI Visualization */}
              <div className="mt-auto bg-gray-50 rounded-2xl border border-gray-200 p-5 relative overflow-hidden group-hover:bg-white group-hover:border-purple-100 transition-colors duration-300">
                 <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Week 1: Strength Block</span>
                    <div className="flex gap-2">
                       <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-purple-600 group-hover:border-purple-200 transition-colors cursor-pointer hover:bg-purple-50"><Plus size={14}/></div>
                    </div>
                 </div>
                 <div className="space-y-2 relative">
                    {['Back Squat', 'Romanian Deadlift', 'Walking Lunges'].map((ex, i) => (
                       <div key={i} 
                            className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm group-hover:border-purple-100 transition-all duration-300 relative z-10"
                            style={{ transitionDelay: `${i * 50}ms` }}
                       >
                          <GripVertical size={16} className="text-gray-300 cursor-grab group-hover:text-purple-500 transition-colors" />
                          <div className="flex-1">
                             <div className="text-sm font-bold text-gray-800">{ex}</div>
                             <div className="text-[10px] text-gray-400">3 sets x 8 reps @ RPE 8</div>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                             <Play size={12} className="text-gray-400 fill-gray-400 group-hover:text-purple-600 group-hover:fill-purple-600 transition-colors" />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* FEATURE B: Payments */}
          <div className="lg:col-span-5 group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20">
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-600 transition-transform group-hover:scale-105 duration-300">
                <CreditCard size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get paid while you sleep</h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                Automate your income. Charge clients directly through the app and track revenue without chasing transfers.
              </p>

              {/* UI Visualization */}
              <div className="mt-auto relative">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm relative z-10 overflow-hidden group-hover:border-purple-100 transition-colors">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Monthly Revenue</span>
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <TrendingUp size={12} /> +12%
                      </span>
                   </div>
                   <div className="text-3xl font-extrabold text-gray-900 mb-4">$4,250.00</div>
                   
                   <div className="relative h-16 overflow-hidden rounded-lg">
                     <svg className="w-full h-full absolute bottom-0" viewBox="0 0 100 40" preserveAspectRatio="none">
                       <defs>
                         <linearGradient id="purpleGradientSimple" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#9333ea" stopOpacity="0.2"/>
                           <stop offset="100%" stopColor="#9333ea" stopOpacity="0"/>
                         </linearGradient>
                       </defs>
                       <path d="M0,35 Q10,30 20,34 Q30,38 40,25 Q50,15 60,22 Q70,28 80,15 Q90,5 100,18 V40 H0 Z" fill="url(#purpleGradientSimple)" className="opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                       <path d="M0,35 Q10,30 20,34 Q30,38 40,25 Q50,15 60,22 Q70,28 80,15 Q90,5 100,18" fill="none" stroke="#9333ea" strokeWidth="2" className="transition-all duration-500"/>
                     </svg>
                   </div>

                   <div className="absolute bottom-2 left-2 right-2 bg-purple-900 text-white p-3 rounded-xl shadow-lg transform translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-xs">$</div>
                      <div>
                        <div className="text-xs font-bold text-white">New Subscription</div>
                        <div className="text-[10px] text-purple-200">Anna K. just paid $150</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE C: Communication */}
          <div className="lg:col-span-6 group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20">
             <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-600 transition-transform group-hover:scale-105 duration-300">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">1:1 & Group Chat</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Direct real-time chat included. Send voice notes, videos, and feedback instantly. Group chats for community.
                </p>
             </div>

             {/* UI Visualization */}
             <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 h-52 flex flex-col justify-end gap-4 relative overflow-hidden group-hover:bg-white group-hover:border-purple-100 transition-colors">
                <div className="flex gap-3 max-w-[85%]">
                   <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 border-2 border-white shadow-sm"></div>
                   <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-sm text-xs text-gray-600 shadow-sm leading-relaxed">
                      Form felt way better today! Should I increase weight?
                   </div>
                </div>
                <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                   <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold shadow-sm border-2 border-white">JD</div>
                   <div className="bg-purple-600 text-white p-3 rounded-2xl rounded-tr-sm text-xs shadow-sm shadow-purple-200/50">
                      <div className="flex items-center gap-3">
                         <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"><Play size={10} fill="currentColor"/></div>
                         <div className="flex gap-0.5 h-3 items-center opacity-80">
                            {[3, 7, 4, 10, 6, 8, 5, 3].map((h, i) => (
                               <div key={i} className="w-0.5 bg-white rounded-full" style={{height: `${h*8}%`}}></div>
                            ))}
                         </div>
                         <span className="text-[10px] text-purple-100 font-medium ml-1">0:24</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* FEATURE D: Health Integrations */}
          <div className="lg:col-span-6 group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/20">
             <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5 text-purple-600 transition-transform group-hover:scale-105 duration-300">
                  <Activity size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Full Picture</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We sync with Apple Health & Google Fit. See steps, sleep, and activity data automatically.
                </p>
             </div>

             {/* UI Visualization */}
             <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 h-52 flex flex-col justify-between relative overflow-hidden group-hover:bg-white group-hover:border-purple-100 transition-colors">
                
                {/* LOGOS SECTION - EDITED */}
                <div className="flex items-center gap-4 relative z-10">
                  {/* Apple Health Image - BARE LOGO WITH SHADOW */}
                  <Image
                    src="/assets/logo/apple-health.svg"
                    alt="Apple Health"
                    width={40}
                    height={40}
                    className="w-10 h-10 drop-shadow-sm transition-transform group-hover:scale-110 duration-300"
                  />

                  {/* Google Fit Image - IN CONTAINER */}
                  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl border border-gray-200 shadow-sm group-hover:border-purple-200 transition-all duration-300">
                    <Image src="/assets/logo/google-fit.svg" alt="Google Fit" width={24} height={24} className="w-6 h-6" />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 relative z-10">
                   <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-center group-hover:border-purple-100 transition-colors">
                      <div className="text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-wider">Steps</div>
                      <div className="text-sm font-extrabold text-gray-900 group-hover:text-purple-600 transition-colors">12,403</div>
                   </div>
                   <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-center group-hover:border-purple-100 transition-colors">
                      <div className="text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-wider">Sleep</div>
                      <div className="text-sm font-extrabold text-gray-900 group-hover:text-purple-600 transition-colors">7h 42m</div>
                   </div>
                   <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-center group-hover:border-purple-100 transition-colors flex flex-col items-center justify-center">
                      <div className="flex flex-col items-center gap-1 text-purple-600">
                         <CheckCircle2 size={16} className="fill-purple-100"/>
                         <span className="text-[9px] font-bold uppercase tracking-wider">Synced</span>
                      </div>
                   </div>
                </div>

                <div className="absolute top-5 right-5 text-gray-300 group-hover:text-purple-400 group-hover:rotate-45 transition-all duration-300">
                  <ArrowUpRight size={20} />
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CoachFeatures;
