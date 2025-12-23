import Image from 'next/image';

const DashboardMockup = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto -mb-16 md:-mb-24 perspective-1000 z-20">
      <div className="relative rounded-t-2xl bg-white border border-b-0 border-gray-200 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
          </div>
          <div className="bg-white px-3 py-0.5 rounded text-[10px] font-mono text-gray-400 border border-gray-200 shadow-sm flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            app.jimmycoach.com
          </div>
          <div className="w-10"></div>
        </div>
        <div className="bg-gray-100 relative group min-h-[300px] md:min-h-[500px]">
          <Image 
            src="/assets/photo/dashboard.svg" 
            alt="Jimmy Platform Dashboard" 
            width={1200}
            height={750}
            className="w-full h-auto object-cover block"
            priority
          />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
