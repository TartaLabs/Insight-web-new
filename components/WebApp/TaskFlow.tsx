import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Check, RotateCcw, Save, Scan, Zap } from 'lucide-react';
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
     const mockImage = `https://dummyimage.com/600x800/000/fff&text=${emotion}`;
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
            status: 'AUDITING', 
            reward: rewardAmount,
            timestamp: Date.now(),
            draftData: { isClear, intensity, isStaged, arousal }
        };
        onSubmit(task);
    }
  };

  const canSubmit = isClear !== null && isStaged !== null;

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
                        <h2 className="font-bold text-white tracking-widest uppercase">Mission: {emotion} Protocol</h2>
                        <div className="text-[10px] text-tech-blue">REWARD: {rewardAmount} $mEMO</div>
                    </div>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                    STEP: {currentStep.toUpperCase()}
                </div>
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
                    <div className="flex flex-col items-center text-center max-w-md z-10">
                        <div className="w-48 h-48 bg-tech-blue/10 border border-tech-blue/30 rounded-lg flex items-center justify-center mb-8 relative group">
                            <span className="text-6xl group-hover:scale-110 transition-transform">
                                {emotion === 'Happy' && '😊'}
                                {emotion === 'Anger' && '😡'}
                                {emotion === 'Sad' && '😢'}
                                {emotion === 'Fear' && '😱'}
                                {emotion === 'Disgust' && '🤢'}
                                {emotion === 'Surprise' && '😲'}
                                {emotion === 'Neutral' && '😐'}
                            </span>
                            <Scan className="absolute text-tech-blue opacity-50 animate-pulse w-full h-full p-4" />
                        </div>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Initialize facial capture sequence. Replicate the target emotion <span className="text-tech-blue font-bold">{emotion.toUpperCase()}</span>. Ensure optimal lighting conditions.
                        </p>
                        <button 
                            onClick={handleStartCapture}
                            className="px-8 py-3 bg-tech-blue text-black font-bold uppercase tracking-widest hover:bg-white transition-colors clip-path-polygon-[10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px]"
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            Activate Camera
                        </button>
                    </div>
                )}

                {currentStep === 'capture' && (
                    <div className="flex flex-col items-center w-full z-10">
                        <div className="relative w-full max-w-sm aspect-[3/4] bg-black border border-white/20 mb-8 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-tech-blue animate-pulse font-mono text-xs">VIDEO_FEED_ACTIVE</p>
                            </div>
                            {/* Face Frame UI */}
                            <div className="absolute inset-0 border-2 border-tech-blue/30 m-8 rounded-[40%]" />
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-tech-blue/20" />
                            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-tech-blue/20" />
                        </div>
                        <button onClick={handleCapture} className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center hover:scale-105 transition-transform group">
                            <div className="w-16 h-16 bg-white rounded-full group-hover:bg-tech-blue transition-colors" />
                        </button>
                    </div>
                )}

                {currentStep === 'review' && (
                    <div className="flex flex-col items-center w-full z-10">
                        <div className="relative w-full max-w-sm aspect-[3/4] bg-black border border-tech-blue/50 mb-6 overflow-hidden">
                            <img src={photo!} alt="Capture" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 w-full bg-black/60 p-2 text-center text-[10px] text-tech-blue border-t border-tech-blue/30">
                                IMAGE_CAPTURED
                            </div>
                        </div>
                        <div className="flex gap-4 w-full max-w-sm mb-6">
                            <button onClick={handleRetake} className="flex-1 py-3 border border-white/20 hover:bg-white/10 text-gray-300 font-bold text-xs uppercase flex items-center justify-center gap-2 transition-colors">
                               <RotateCcw size={14} /> Retake
                            </button>
                            <button onClick={handleSave} className="flex-1 py-3 border border-white/20 hover:bg-white/10 text-gray-300 font-bold text-xs uppercase flex items-center justify-center gap-2 transition-colors">
                               <Save size={14} /> Save Draft
                            </button>
                        </div>
                        <button 
                            onClick={handleConfirmPhoto} 
                            className="w-full max-w-sm py-3 bg-tech-blue text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
                        >
                            Proceed to Analysis
                        </button>
                    </div>
                )}

                {currentStep === 'label' && (
                    <div className="w-full max-w-md z-10 space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <h3 className="font-bold text-white uppercase tracking-wider">Data Annotation</h3>
                            <button onClick={handleSave} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
                                <Save size={12} /> SAVE PROGRESS
                            </button>
                        </div>
                        
                        <div>
                            <label className="block text-xs text-tech-blue mb-2 font-bold uppercase">1. Visibility Check</label>
                            <div className="flex gap-4">
                                <button onClick={() => setIsClear(true)} className={`flex-1 py-3 border ${isClear === true ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/20 text-gray-500 hover:border-white'}`}>CLEAR</button>
                                <button onClick={() => setIsClear(false)} className={`flex-1 py-3 border ${isClear === false ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/20 text-gray-500 hover:border-white'}`}>OBSTRUCTED</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-tech-blue mb-2 font-bold uppercase">2. Emotion Class</label>
                            <div className="w-full bg-white/5 border border-white/10 px-4 py-3 text-gray-300 cursor-not-allowed font-mono">
                                {emotion.toUpperCase()} [LOCKED]
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-tech-blue mb-2 font-bold uppercase">3. Intensity Scalar</label>
                            <div className="flex items-center gap-4">
                                <input type="range" min="0" max="100" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="flex-1 accent-tech-blue h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                <span className="font-mono text-tech-blue w-8 text-right">{intensity}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-tech-blue mb-2 font-bold uppercase">4. Authenticity</label>
                            <div className="flex gap-4">
                                <button onClick={() => setIsStaged(true)} className={`flex-1 py-3 border ${isStaged === true ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/20 text-gray-500 hover:border-white'}`}>STAGED</button>
                                <button onClick={() => setIsStaged(false)} className={`flex-1 py-3 border ${isStaged === false ? 'bg-tech-blue text-black border-tech-blue' : 'border-white/20 text-gray-500 hover:border-white'}`}>NATURAL</button>
                            </div>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className={`w-full mt-8 py-4 font-bold uppercase tracking-widest transition-all ${!canSubmit ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-tech-blue text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]'}`}
                        >
                            Submit to Consensus
                        </button>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
  );
};