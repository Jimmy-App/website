import { 
  ArrowRight, 
  Check, 
  LayoutGrid, 
  Settings, 
  Table2, 
  Menu, 
  MoreHorizontal, 
  ChevronDown, 
  Activity, 
  PieChart 
} from 'lucide-react';

const ProblemSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER - UPDATED with "Painful" style */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Why is fitness software so...{' '}
            {/* Зміни тут:
               1. inline-block: щоб працював нахил.
               2. bg-gradient... text-transparent: градієнтний текст (індиго -> рожевий).
               3. -rotate-2: легкий нахил, що створює напругу.
               4. transform-gpu: для плавнішого рендерингу.
            */}
            <span className="relative inline-block bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent -rotate-3 transform-gpu scale-105 origin-bottom px-1 font-extrabold">
              painful?
            </span>
          </h2>
          <p className="text-lg text-gray-500">
            Most tools force you to choose between chaos and complexity. We chose neither.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* 1. The Spreadsheet Hell */}
          <div className="group relative rounded-3xl bg-gray-50 border border-gray-200 p-8 flex flex-col transition-all duration-300 hover:bg-white hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/40">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Table2 className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">The "Spreadsheet" Hell</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                You spend Sunday nights copy-pasting cells instead of resting. Formulas break. Links expire. It&apos;s not scalable.
              </p>
            </div>
            
            {/* Visual: Clean but Broken Excel Table */}
            <div className="mt-auto relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
              <div className="flex border-b border-gray-100 bg-gray-50 px-3 py-2 gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-200"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-200"></div>
              </div>
              <div className="p-3 grid grid-cols-4 gap-px bg-gray-100 text-[6px] text-gray-400 font-mono">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`bg-white h-5 flex items-center px-1 ${i === 7 ? 'bg-red-50 text-red-500 font-bold border border-red-100 z-10' : ''}`}>
                    {i === 7 ? '#REF!' : '---'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. The Enterprise Overkill */}
          <div className="group relative rounded-3xl bg-gray-50 border border-gray-200 p-8 flex flex-col transition-all duration-300 hover:bg-white hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/40">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <LayoutGrid className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">The "Enterprise" Overkill</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Built for big box gyms. You don&apos;t need turnstile integrations, payroll systems, or 15 clicks just to assign a squat.
              </p>
            </div>

            {/* Visual: Bloated Dashboard UI */}
            <div className="mt-auto relative rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-36 opacity-70 group-hover:opacity-100 transition-opacity select-none">
              {/* 1. Busy Header Bar */}
              <div className="h-7 border-b border-gray-100 bg-gray-50/80 flex items-center px-2 justify-between gap-2">
                <div className="flex gap-1 items-center">
                   <div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200"></div>
                   <div className="w-8 h-2 rounded-sm bg-gray-200"></div>
                   <div className="flex gap-0.5 ml-2">
                      <div className="w-4 h-2 rounded-[2px] bg-gray-100 border border-gray-200 flex items-center justify-center"><ChevronDown size={4} className="text-gray-400"/></div>
                      <div className="w-4 h-2 rounded-[2px] bg-gray-100 border border-gray-200 flex items-center justify-center"><ChevronDown size={4} className="text-gray-400"/></div>
                   </div>
                </div>
                <div className="flex gap-1.5 items-center">
                   <div className="w-2 h-2 rounded-full bg-gray-200 relative"><div className="absolute top-0 right-0 w-1 h-1 bg-red-400 rounded-full border border-white"></div></div>
                   <Settings size={8} className="text-gray-300" />
                </div>
              </div>
              
              {/* 2. Multi-column layout (Chaos) */}
              <div className="flex flex-1 overflow-hidden">
                 <div className="w-10 border-r border-gray-100 bg-gray-50/50 flex flex-col py-2 px-1 gap-1">
                    {[...Array(5)].map((_,i) => (
                       <div key={i} className="flex items-center gap-1 opacity-60">
                          <ChevronDown size={4} className="text-gray-400 flex-shrink-0" style={{transform: i===1 ? '' : 'rotate(-90deg)'}}/>
                          <div className="h-1.5 w-full bg-gray-200 rounded-sm"></div>
                       </div>
                    ))}
                    <div className="ml-1.5 flex flex-col gap-1 pl-1 border-l border-gray-200">
                      <div className="h-1 w-4 bg-blue-100 rounded-sm"></div>
                      <div className="h-1 w-5 bg-gray-100 rounded-sm"></div>
                    </div>
                 </div>

                 <div className="flex-1 p-1.5 bg-white flex flex-col gap-1.5 overflow-hidden">
                    <div className="flex gap-1.5 h-10">
                       <div className="flex-1 border border-gray-100 rounded-[4px] p-1 flex flex-col">
                          <div className="h-1 w-8 bg-gray-200 rounded-sm mb-1"></div>
                          <div className="flex items-end gap-0.5 flex-1">
                             <div className="h-2/3 w-1 bg-blue-100 rounded-t-sm"></div>
                             <div className="h-full w-1 bg-blue-200 rounded-t-sm"></div>
                             <div className="h-1/2 w-1 bg-gray-100 rounded-t-sm"></div>
                             <div className="h-3/4 w-1 bg-blue-100 rounded-t-sm"></div>
                          </div>
                       </div>
                       <div className="w-1/3 border border-gray-100 rounded-[4px] p-1 flex flex-col justify-center gap-1">
                          <div className="h-1 w-6 bg-gray-200 rounded-sm"></div>
                          <div className="flex items-center gap-1">
                            <Activity size={6} className="text-blue-400"/>
                            <div className="h-2 w-4 bg-gray-300 rounded-sm"></div>
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 border border-gray-100 rounded-[4px] overflow-hidden flex flex-col">
                       <div className="bg-gray-50 h-3 flex items-center px-1 gap-2 border-b border-gray-100">
                          <div className="h-1 w-4 bg-gray-300 rounded-sm"></div>
                          <div className="h-1 w-4 bg-gray-300 rounded-sm"></div>
                          <div className="h-1 w-4 bg-gray-300 rounded-sm"></div>
                          <MoreHorizontal size={6} className="text-gray-300 ml-auto"/>
                       </div>
                       <div className="grid grid-cols-4 gap-px bg-gray-50 p-0.5 flex-1">
                          {[...Array(12)].map((_,i) => <div key={i} className="bg-white h-full rounded-[1px]"></div>)}
                       </div>
                    </div>
                 </div>
                 
                 <div className="w-8 border-l border-gray-100 bg-gray-50/30 flex flex-col p-1 gap-1.5">
                    <div className="h-1 w-4 bg-gray-200 rounded-sm mx-auto mb-1"></div>
                    <div className="flex flex-col gap-1">
                       <div className="h-4 border border-gray-100 rounded-[3px] bg-white flex items-center justify-center"><PieChart size={6} className="text-gray-300"/></div>
                       <div className="h-4 border border-gray-100 rounded-[3px] bg-white flex items-center justify-center"><Menu size={6} className="text-gray-300"/></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* 3. The Jimmy Way (HERO) */}
          <div className="group relative rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 p-8 flex flex-col shadow-xl shadow-indigo-200 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-400/40 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none mix-blend-overlay"></div>
            
            <div className="relative z-10 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                  New
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">The Jimmy Way</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Just Coaching. Fast, intuitive, and built for the workflow of a solo business owner.
              </p>
            </div>

            {/* Visual: White Card UI */}
            <div className="mt-auto relative z-10">
              <div className="rounded-xl bg-white shadow-lg shadow-purple-900/20 p-4 transform transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold ring-2 ring-indigo-50">JD</div>
                      <div>
                         <div className="h-2 w-20 bg-gray-800 rounded-full mb-1"></div>
                         <div className="h-1.5 w-12 bg-gray-300 rounded-full"></div>
                      </div>
                   </div>
                   <div className="bg-green-100 px-2 py-0.5 rounded text-[10px] text-green-700 font-medium border border-green-200">Active</div>
                </div>
                
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-colors cursor-pointer group/item">
                  <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center bg-white group-hover/item:bg-indigo-600 group-hover/item:border-indigo-600 transition-colors">
                        <Check className="w-2.5 h-2.5 text-white opacity-0 group-hover/item:opacity-100" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover/item:text-gray-900">Update Program</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center text-white font-semibold text-sm cursor-pointer hover:text-indigo-100 transition-colors group/link">
                See how it works <ArrowRight size={16} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSection;