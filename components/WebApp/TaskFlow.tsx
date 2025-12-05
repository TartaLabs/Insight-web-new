import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, RotateCcw, Save } from 'lucide-react';
import { EmotionType, TaskRecord } from '../../types';

interface TaskFlowProps {
  emotion: EmotionType;
  initialTask?: TaskRecord;
  rewardAmount: number;
  onSave: (task: TaskRecord) => void;
  onSubmit: (task: TaskRecord) => void;
  onCancel: () => void;
}

const steps = ['example', 'capture', 'review', 'label'] as const;
type Step = typeof steps[number];

export const TaskFlow: React.FC<TaskFlowProps> = ({ emotion, initialTask, rewardAmount, onSave, onSubmit, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<Step>(initialTask?.imageUrl ? 'review' : 'example');
  
  // Data State
  const [photo, setPhoto] = useState<string | null>(initialTask?.imageUrl || null);
  
  // Label Form State
  const [isClear, setIsClear] = useState<boolean | null>(initialTask?.draftData?.isClear ?? null);
  const [intensity, setIntensity] = useState(initialTask?.draftData?.intensity ?? 50);
  const [isStaged, setIsStaged] = useState<boolean | null>(initialTask?.draftData?.isStaged ?? null);
  const [arousal, setArousal] = useState(initialTask?.draftData?.arousal ?? 50);

  // Handlers
  const handleStartCapture = () => setCurrentStep('capture');

  const handleCapture = () => {
     // Mocking a captured image
     const mockImage = `https://dummyimage.com/600x800/202020/fff&text=My+${emotion}+Face`;
     setPhoto(mockImage);
     setCurrentStep('review');
  };

  const handleRetake = () => {
      setPhoto(null);
      setCurrentStep('capture');
  };
  
  const handleSave = () => {
      if (!photo) return;
      
      const task: TaskRecord = {
          id: initialTask?.id || Date.now().toString(),
          emotion,
          imageUrl: photo,
          status: 'DRAFT',
          reward: rewardAmount,
          timestamp: Date.now(),
          draftData: {
              isClear: isClear ?? undefined,
              intensity,
              isStaged: isStaged ?? undefined,
              arousal
          }
      };
      onSave(task);
  };

  const handleConfirmPhoto = () => {
      setCurrentStep('label');
  };

  const handleSubmit = () => {
    if (isClear !== null && isStaged !== null && photo) {
        const task: TaskRecord = {
            id: initialTask?.id || Date.now().toString(),
            emotion,
            imageUrl: photo,
            status: 'AUDITING', // Initial status before WebApp logic takes over
            reward: rewardAmount,
            timestamp: Date.now(),
            draftData: { isClear, intensity, isStaged, arousal }
        };
        onSubmit(task);
    }
  };

  const canSubmit = isClear !== null && isStaged !== null;

  // --- Render Views ---
  
  const renderExample = () => (
    <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-bold mb-4">Target Emotion: <span className="text-tech-blue">{emotion}</span></h3>
        <div className="w-64 h-64 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mb-6">
            <span className="text-6xl">
                {emotion === 'Happy' && '😊'}
                {emotion === 'Anger' && '😡'}
                {emotion === 'Sad' && '😢'}
                {emotion === 'Fear' && '😱'}
                {emotion === 'Disgust' && '🤢'}
                {emotion === 'Surprise' && '😲'}
                {emotion === 'Neutral' && '😐'}
            </span>
        </div>
        <p className="text-gray-400 mb-8 max-w-sm">Please mimic the expression shown above. Ensure good lighting and that your face is centered.</p>
        <button onClick={handleStartCapture} className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-tech-blue transition-colors">
            Start Camera
        </button>
    </div>
  );

  const renderCapture = () => (
    <div className="flex flex-col items-center">
        <div className="w-full max-w-md aspect-[3/4] bg-black border border-white/20 rounded-xl relative overflow-hidden mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 animate-pulse">Camera Feed Active...</p>
            </div>
            <div className="absolute inset-0 border-2 border-white/20 rounded-[50%] scale-75 opacity-50 pointer-events-none" />
        </div>
        <button onClick={handleCapture} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-white rounded-full" />
        </button>
    </div>
  );

  const renderReview = () => (
      <div className="flex flex-col items-center">
          <div className="w-full max-w-md aspect-[3/4] bg-black border border-white/20 rounded-xl relative overflow-hidden mb-6">
              <img src={photo!} alt="Capture" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4 w-full max-w-md mb-4">
              <button onClick={handleRetake} className="flex-1 py-3 bg-white/10 rounded font-bold hover:bg-white/20 flex items-center justify-center gap-2 text-sm">
                 <RotateCcw size={16} /> Retake
              </button>
              <button onClick={handleSave} className="flex-1 py-3 bg-white/10 rounded font-bold hover:bg-white/20 flex items-center justify-center gap-2 text-sm">
                 <Save size={16} /> Save Draft
              </button>
          </div>
          <button onClick={handleConfirmPhoto} className="w-full max-w-md py-3 bg-white text-black font-bold rounded hover:bg-tech-blue transition-colors">
              Continue to Label
          </button>
      </div>
  );

  const renderLabel = () => (
    <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Label Data</h3>
            <button onClick={handleSave} className="text-sm flex items-center gap-1 text-gray-400 hover:text-white">
                <Save size={14} /> Save
            </button>
        </div>
        
        <div className="space-y-6">
            <div>
                <label className="block text-sm text-gray-400 mb-2">1. Is the face clearly visible?</label>
                <div className="flex gap-4">
                    <button onClick={() => setIsClear(true)} className={`flex-1 py-2 rounded border ${isClear === true ? 'bg-tech-blue border-tech-blue text-black' : 'border-white/20 text-gray-400'}`}>Yes</button>
                    <button onClick={() => setIsClear(false)} className={`flex-1 py-2 rounded border ${isClear === false ? 'bg-tech-blue border-tech-blue text-black' : 'border-white/20 text-gray-400'}`}>No</button>
                </div>
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-2">2. Emotion Type</label>
                <div className="w-full bg-white/5 border border-white/10 px-4 py-2 rounded text-gray-300 cursor-not-allowed">
                    {emotion} (Fixed)
                </div>
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-2">3. Intensity (0-100)</label>
                <input type="range" min="0" max="100" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full accent-tech-blue" />
                <div className="text-right text-xs text-tech-blue">{intensity}</div>
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-2">4. Is this staged (posed)?</label>
                <div className="flex gap-4">
                    <button onClick={() => setIsStaged(true)} className={`flex-1 py-2 rounded border ${isStaged === true ? 'bg-tech-blue border-tech-blue text-black' : 'border-white/20 text-gray-400'}`}>Yes</button>
                    <button onClick={() => setIsStaged(false)} className={`flex-1 py-2 rounded border ${isStaged === false ? 'bg-tech-blue border-tech-blue text-black' : 'border-white/20 text-gray-400'}`}>No</button>
                </div>
            </div>
            <div>
                <label className="block text-sm text-gray-400 mb-2">5. Arousal Level</label>
                <input type="range" min="0" max="100" value={arousal} onChange={(e) => setArousal(Number(e.target.value))} className="w-full accent-tech-blue" />
                <div className="text-right text-xs text-tech-blue">{arousal}</div>
            </div>
        </div>

        <button 
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full mt-8 py-3 rounded font-bold ${!canSubmit ? 'bg-white/10 text-gray-500' : 'bg-white text-black hover:bg-tech-blue'}`}
        >
            Submit for Audit
        </button>
    </div>
  );

  return (
    <motion.div 
        className="fixed inset-0 z-50 bg-[#050509] flex flex-col"
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '100%' }}
    >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
            <button onClick={onCancel} className="text-gray-400 hover:text-white">
                <ArrowLeft />
            </button>
            <h2 className="font-bold text-lg">{initialTask ? 'Resume Task' : 'New Task'}: {emotion}</h2>
            <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            {currentStep === 'example' && renderExample()}
            {currentStep === 'capture' && renderCapture()}
            {currentStep === 'review' && renderReview()}
            {currentStep === 'label' && renderLabel()}
        </div>
    </motion.div>
  );
};