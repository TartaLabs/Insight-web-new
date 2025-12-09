import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Stats } from './Stats';
import { Workflow } from './Workflow';
import { EmotionShowcase } from './EmotionShowcase';
import { TokenSystem } from './TokenSystem';

interface StorySliderProps {
  onExitDown?: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 60 : -60,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -60 : 60,
    scale: 0.98,
    transition: { duration: 0.4, ease: 'easeIn' },
  }),
};

export const StorySlider: React.FC<StorySliderProps> = ({ onExitDown }) => {
  const slides = useRef([
    { key: 'stats', node: <Stats /> },
    { key: 'workflow', node: <Workflow /> },
    { key: 'emotion', node: <EmotionShowcase /> },
    { key: 'dual', node: <TokenSystem /> },
  ]);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const isAnimatingRef = useRef(false);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (isAnimatingRef.current) return;
      if (e.deltaY > 0) {
        // down
        if (index === slides.current.length - 1) {
          onExitDown?.();
          return;
        }
        isAnimatingRef.current = true;
        setDirection(1);
        setIndex((i) => Math.min(i + 1, slides.current.length - 1));
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 700);
      } else if (e.deltaY < 0) {
        if (index === 0) return;
        isAnimatingRef.current = true;
        setDirection(-1);
        setIndex((i) => Math.max(i - 1, 0));
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 700);
      }
    },
    [index, onExitDown]
  );

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.05),transparent_55%)] pointer-events-none" />
      <div className="w-full max-w-6xl mx-auto px-6">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={slides.current[index].key}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {slides.current[index].node}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {slides.current.map((s, i) => (
          <button
            key={s.key}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`w-2 h-8 rounded-full transition ${
              i === index ? 'bg-tech-blue shadow-[0_0_12px_rgba(0,243,255,0.6)]' : 'bg-white/15 hover:bg-white/40'
            }`}
            aria-label={`Go to ${s.key}`}
          />
        ))}
      </div>
    </div>
  );
};
