import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Feature } from '../types';

interface FeatureRowProps {
  feature: Feature;
  index: number;
}

export const FeatureRow: React.FC<FeatureRowProps> = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });
  const isEven = index % 2 === 0;

  return (
    <section 
      ref={ref}
      className="min-h-[60vh] flex items-center justify-center py-20 relative"
    >
      <div className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>
        
        {/* Text Content */}
        <motion.div
          className={`space-y-8 ${isEven ? 'lg:pr-12' : 'lg:pl-12 lg:col-start-2'}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-mono tracking-[0.2em] uppercase ${feature.color}`}>
                0{index + 1} — {feature.id}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold font-sans leading-tight text-white">
              {feature.title}
            </h2>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              {feature.description}
            </p>

            <ul className="space-y-3 pt-4">
              {feature.details.map((detail, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center gap-3 text-sm font-mono text-gray-300"
                >
                  <div className={`w-1 h-1 ${feature.color.replace('text-', 'bg-')}`} />
                  {detail}
                </motion.li>
              ))}
            </ul>
        </motion.div>

        {/* Visual Area - Anime.js style card */}
        <motion.div
          className={`relative h-[450px] w-full bg-[#111116] rounded-xl overflow-hidden shadow-2xl ${isEven ? 'lg:col-start-2' : 'lg:col-start-1'}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
        >
          {/* Top Bar Decoration */}
          <div className="absolute top-0 left-0 w-full h-8 bg-white/5 flex items-center px-4 gap-2 z-20 border-b border-white/5">
             <div className="w-2 h-2 rounded-full bg-red-500/20" />
             <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
             <div className="w-2 h-2 rounded-full bg-green-500/20" />
          </div>

          <div className="relative w-full h-full pt-8">
             {feature.visual}
          </div>

          {/* Corner Accents */}
          <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-${feature.color.replace('text-', '')}/10 to-transparent`} />
        </motion.div>
      </div>
    </section>
  );
};