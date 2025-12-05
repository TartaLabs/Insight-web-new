import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useVelocity, useTransform } from 'framer-motion';

export const GlobalScrollEffects: React.FC = () => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const [windowHeight, setWindowHeight] = useState(0);

  // Smooth out the velocity for less jittery effects
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Map velocity to opacity and scale of warp lines
  const warpOpacity = useTransform(smoothVelocity, [-1000, 0, 1000], [0.4, 0, 0.4]);
  const warpHeight = useTransform(smoothVelocity, [-2000, 0, 2000], ["50%", "0%", "50%"]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Warp Speed Lines (Triggered by Scroll Velocity) */}
      <div className="absolute inset-0 flex justify-between px-[10%] opacity-50">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`warp-${i}`}
            className="w-px bg-gradient-to-b from-transparent via-tech-blue to-transparent"
            style={{
              height: warpHeight,
              opacity: warpOpacity,
              y: useTransform(scrollY, (v) => v * (0.1 + i * 0.05)) // Parallax
            }}
          />
        ))}
      </div>

      {/* 2. Side HUD Ruler (Right Side) */}
      <div className="absolute right-0 top-0 h-full w-12 flex flex-col justify-center items-end pr-2 gap-1 mix-blend-screen">
         <motion.div 
            className="flex flex-col gap-8 opacity-30"
            style={{ y: useTransform(scrollY, (y) => -y * 0.2) }}
         >
            {[...Array(20)].map((_, i) => (
               <div key={`ruler-${i}`} className="flex items-center gap-2 justify-end">
                  <span className="text-[9px] font-mono text-tech-blue">{i * 100}</span>
                  <div className={`h-px bg-tech-blue ${i % 5 === 0 ? 'w-4' : 'w-2'}`} />
               </div>
            ))}
         </motion.div>
         
         {/* Current Position Marker */}
         <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-[10px] font-mono text-white bg-tech-blue/20 px-1 rounded">Y-AXIS</span>
            <div className="w-8 h-px bg-white" />
         </div>
      </div>

      {/* 3. Subtle Background Grid Parallax */}
      <motion.div 
        className="absolute inset-0 z-[-1]"
        style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            y: useTransform(scrollY, (v) => v * 0.05)
        }}
      />
      
      {/* 4. Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050509_100%)] opacity-80" />
    </div>
  );
};