'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

type DashboardMockupProps = {
  urlLabel?: string;
};

const DashboardMockup = ({ urlLabel }: DashboardMockupProps) => {
  const resolvedUrlLabel = urlLabel || 'app.jimmycoach.com';
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  const progress = useTransform(scrollYProgress, [0, 0.85], [0, 1], {
    clamp: true,
  });
  const rotateX = useTransform(progress, [0, 1], [18, 0]);
  const scale = useTransform(
    progress,
    [0, 1],
    isMobile ? [0.78, 0.94] : [1.05, 1]
  );
  const translateY = useTransform(progress, [0, 1], [60, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto -mb-16 md:-mb-24 perspective-1000 z-20"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          y: translateY,
          transformStyle: 'preserve-3d',
          boxShadow:
            '0 0 #0000002b, 0 9px 20px #00000024, 0 37px 37px #0000001f, 0 84px 50px #00000012, 0 149px 60px #00000006, 0 233px 65px #00000002',
        }}
        className="relative rounded-t-2xl bg-white border border-b-0 border-gray-200 overflow-hidden"
      >
        <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
          </div>
          <div className="bg-white px-3 py-0.5 rounded text-[10px] font-mono text-gray-400 border border-gray-200 shadow-sm flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {resolvedUrlLabel}
          </div>
          <div className="w-10"></div>
        </div>
        <div className="bg-gray-100 relative group min-h-0 md:min-h-[500px]">
          <Image 
            src="/assets/photo/dashboard.png" 
            alt="Jimmy Platform Dashboard" 
            width={1200}
            height={750}
            className="w-full h-auto object-cover block"
            priority
          />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardMockup;
