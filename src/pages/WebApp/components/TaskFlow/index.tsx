import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { EmotionType, TaskRecord } from '../../types';
import { ExampleStep } from './ExampleStep';
import { CaptureStep } from './CaptureStep';
import { ReviewStep } from './ReviewStep';
import { LabelStep } from './LabelStep';

interface TaskFlowProps {
  emotion: EmotionType;
  initialTask?: TaskRecord;
  rewardAmount: number;
  onSave: (task: TaskRecord) => void;
  onSubmit: (task: TaskRecord) => void;
  onCancel: () => void;
}

type Step = 'example' | 'capture' | 'review' | 'label';

/**
 * 任务流程容器组件
 * 管理任务执行的各个步骤
 */
export const TaskFlow: React.FC<TaskFlowProps> = ({
  emotion,
  initialTask,
  rewardAmount,
  onSave,
  onSubmit,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(
    initialTask?.imageUrl ? 'review' : 'example',
  );

  // Data State
  const [photo, setPhoto] = useState<string | null>(initialTask?.imageUrl || null);

  // Label Form State
  const [labelData, setLabelData] = useState({
    isClear: initialTask?.draftData?.isClear ?? null,
    intensity: initialTask?.draftData?.intensity ?? 50,
    isStaged: initialTask?.draftData?.isStaged ?? null,
    arousal: initialTask?.draftData?.arousal ?? 50,
  });

  // Handlers
  const handleStartCapture = () => {
    setCurrentStep('capture');
  };

  const handleCapture = (photoDataUrl: string) => {
    setPhoto(photoDataUrl);
    setCurrentStep('review');
  };

  const handleRetake = () => {
    setPhoto(null);
    setCurrentStep('capture');
  };

  const handleSaveDraft = () => {
    if (!photo) return;

    const task: TaskRecord = {
      id: initialTask?.id || Date.now().toString(),
      emotion,
      imageUrl: photo,
      status: 'DRAFT',
      reward: rewardAmount,
      timestamp: Date.now(),
      draftData: {
        isClear: labelData.isClear ?? undefined,
        intensity: labelData.intensity,
        isStaged: labelData.isStaged ?? undefined,
        arousal: labelData.arousal,
      },
    };
    onSave(task);
  };

  const handleConfirmPhoto = () => {
    setCurrentStep('label');
  };

  const handleLabelChange = (data: Partial<typeof labelData>) => {
    setLabelData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    if (labelData.isClear !== null && labelData.isStaged !== null && photo) {
      const task: TaskRecord = {
        id: initialTask?.id || Date.now().toString(),
        emotion,
        imageUrl: photo,
        status: 'AUDITING',
        reward: rewardAmount,
        timestamp: Date.now(),
        draftData: {
          isClear: labelData.isClear,
          intensity: labelData.intensity,
          isStaged: labelData.isStaged,
          arousal: labelData.arousal,
        },
      };
      onSubmit(task);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#020205]/95 backdrop-blur-sm flex items-center justify-center p-4 font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-2xl bg-[#0a0a0f] border border-tech-blue/30 relative overflow-hidden flex flex-col h-[80vh] md:h-auto md:max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-tech-blue/20 bg-tech-blue/5">
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="font-bold text-white tracking-widest uppercase">Emotion Labeling</h2>
              <div className="text-[10px] text-tech-blue">Reward: {rewardAmount} $mEMO</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-mono">STEP: {currentStep.toUpperCase()}</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center relative">
          {/* HUD Overlay Lines */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[90%] h-[90%] border border-white/5" />
            </div>
          </div>

          {currentStep === 'example' && (
            <ExampleStep emotion={emotion} onStartCapture={handleStartCapture} />
          )}

          {currentStep === 'capture' && <CaptureStep onCapture={handleCapture} />}

          {currentStep === 'review' && photo && (
            <ReviewStep
              photo={photo}
              onRetake={handleRetake}
              onSaveDraft={handleSaveDraft}
              onConfirm={handleConfirmPhoto}
            />
          )}

          {currentStep === 'label' && (
            <LabelStep
              emotion={emotion}
              labelData={labelData}
              onLabelChange={handleLabelChange}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export { ExampleStep } from './ExampleStep';
export { CaptureStep } from './CaptureStep';
export { ReviewStep } from './ReviewStep';
export { LabelStep } from './LabelStep';
