import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className = "", id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-10% 0px -10% 0px", once: true });

  return (
    <section id={id} ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Tech Reveal Effect */}
      <motion.div
        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 50, filter: 'blur(10px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
      
      {/* Scanline decoration that runs once on enter */}
      <motion.div 
         className="absolute top-0 left-0 w-full h-1 bg-tech-blue/30 z-50 pointer-events-none"
         initial={{ scaleX: 0 }}
         animate={isInView ? { scaleX: 1, opacity: 0 } : { scaleX: 0, opacity: 1 }}
         transition={{ duration: 1.5, ease: "easeInOut" }}
         style={{ originX: 0 }}
      />
    </section>
  );
};