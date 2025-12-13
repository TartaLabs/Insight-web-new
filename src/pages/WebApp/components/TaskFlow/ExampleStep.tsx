import React from 'react';
import { Scan } from 'lucide-react';
import { EmotionType } from '../../types';
import { Button } from '../Button';

interface ExampleStepProps {
  emotion: EmotionType;
  onStartCapture: () => void;
}

const emotionEmojis: Record<EmotionType, string> = {
  Happy: '😊',
  Anger: '😡',
  Sad: '😢',
  Fear: '😱',
  Disgust: '🤢',
  Surprise: '😲',
  Neutral: '😐',
};

/**
 * 任务流程 - 示例步骤
 * 显示目标情绪和启动相机按钮
 */
export const ExampleStep: React.FC<ExampleStepProps> = ({
  emotion,
  onStartCapture,
}) => {
  return (
    <div className="flex flex-col items-center text-center max-w-md z-10">
      <div className="w-48 h-48 bg-tech-blue/10 border border-tech-blue/30 rounded-lg flex items-center justify-center mb-8 relative group">
        <span className="text-6xl group-hover:scale-110 transition-transform">
          {emotionEmojis[emotion]}
        </span>
        <Scan className="absolute text-tech-blue opacity-50 animate-pulse w-full h-full p-4" />
      </div>
      <p className="text-gray-300 mb-8 leading-relaxed">
        Initialize facial capture sequence. Replicate the target emotion{' '}
        <span className="text-tech-blue font-bold">{emotion.toUpperCase()}</span>
        . Ensure optimal lighting conditions.
      </p>
      <Button onClick={onStartCapture} className="mt-2">
        Activate Camera
      </Button>
    </div>
  );
};

