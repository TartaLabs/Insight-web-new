import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EmotionType } from '../types';

const emotions: { type: EmotionType; hex: string; icon: string }[] = [
  { type: 'Happy', hex: '#E6D48A', icon: '😊' },
  { type: 'Anger', hex: '#FF6666', icon: '😡' },
  { type: 'Sad', hex: '#7373F7', icon: '😢' },
  { type: 'Fear', hex: '#7AC47A', icon: '😱' },
  { type: 'Disgust', hex: '#FF9CFF', icon: '🤢' },
  { type: 'Surprise', hex: '#7AB8FF', icon: '😲' },
  { type: 'Neutral', hex: '#D1D1D1', icon: '😐' },
];

export const EmotionShowcase: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="w-full container mx-auto px-6 lg:px-8 xl:px-10">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
          <span className="text-white">7 Core Dimensions</span>
        </h2>
        <p className="text-gray-400 max-w-4xl mx-auto text-base md:text-lg leading-relaxed">
          We collect and label the full spectrum of human expression. Select a task, capture the feeling, and contribute to the dataset.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {emotions.map((emotion, index) => (
          <motion.div
            key={emotion.type}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            className={`relative h-64 border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-colors duration-300 ${active === index ? 'bg-white/5 border-white/30' : 'bg-[#0a0a10]'}`}
            whileHover={{ y: -10 }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">
                {emotion.icon}
              </span>
              <span 
                className={`font-mono font-bold tracking-wider`}
                style={{ color: active === index ? emotion.hex : '#6b7280' }}
              >
                {emotion.type.toUpperCase()}
              </span>
            </div>

            {/* Background Glow Effect on Hover */}
            <motion.div
              className={`absolute inset-0 opacity-0`}
              style={{ backgroundColor: emotion.hex }}
              animate={{ opacity: active === index ? 0.1 : 0 }}
            />
            
            {/* Animated Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
               <motion.div 
                 className={`h-full`}
                 style={{ backgroundColor: emotion.hex }}
                 animate={{ width: active === index ? '100%' : '0%' }}
                 transition={{ duration: 0.4 }}
               />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
