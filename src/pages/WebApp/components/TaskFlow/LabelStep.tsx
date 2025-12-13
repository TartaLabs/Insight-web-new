import React from 'react';
import { Save } from 'lucide-react';
import { EmotionType } from '../../types';
import { Button } from '../Button';

interface LabelData {
  isClear: boolean | null;
  intensity: number;
  isStaged: boolean | null;
  arousal: number;
}

interface LabelStepProps {
  emotion: EmotionType;
  labelData: LabelData;
  onLabelChange: (data: Partial<LabelData>) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

/**
 * 任务流程 - 标注步骤
 * 收集用户对情绪图片的标注数据
 */
export const LabelStep: React.FC<LabelStepProps> = ({
  emotion,
  labelData,
  onLabelChange,
  onSaveDraft,
  onSubmit,
}) => {
  const canSubmit = labelData.isClear !== null && labelData.isStaged !== null;

  return (
    <div className="w-full max-w-md z-10 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <h3 className="font-bold text-white uppercase tracking-wider">
          Data Annotation
        </h3>
        <button
          onClick={onSaveDraft}
          className="text-xs text-gray-500 hover:text-white flex items-center gap-1"
        >
          <Save size={12} /> SAVE PROGRESS
        </button>
      </div>

      {/* Is Clear */}
      <div>
        <label className="block text-xs text-tech-blue mb-2 font-bold uppercase">
          Is there a clear human face? *
        </label>
        <div className="flex gap-4">
          <Button
            variant={labelData.isClear === true ? 'primary' : 'ghost'}
            className="flex-1"
            onClick={() => onLabelChange({ isClear: true })}
          >
            Yes
          </Button>
          <Button
            variant={labelData.isClear === false ? 'primary' : 'ghost'}
            className="flex-1"
            onClick={() => onLabelChange({ isClear: false })}
          >
            No
          </Button>
        </div>
      </div>

      {/* Emotion Type (locked) */}
      <div>
        <label className="block text-xs text-tech-blue mb-2 font-bold uppercase">
          Please select the type of emotion? *
        </label>
        <div className="w-full bg-white/5 border border-white/10 px-4 py-3 text-gray-300 cursor-not-allowed font-mono">
          {emotion.toUpperCase()} [Locked]
        </div>
      </div>

      {/* Intensity */}
      <div>
        <label className="block text-xs text-tech-blue mb-2 font-bold uppercase">
          How strong do you think the emotion in this photo is? *
        </label>
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
          <span>Lowest</span>
          <span>Highest</span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={labelData.intensity}
            onChange={(e) =>
              onLabelChange({ intensity: Number(e.target.value) })
            }
            className="flex-1 accent-tech-blue h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="font-mono text-tech-blue w-8 text-right">
            {labelData.intensity}
          </span>
        </div>
      </div>

      {/* Is Staged */}
      <div>
        <label className="block text-xs text-tech-blue mb-2 font-bold uppercase">
          How natural do you think this photo is? *
        </label>
        <div className="flex gap-4">
          <Button
            variant={labelData.isStaged === false ? 'primary' : 'ghost'}
            className="flex-1"
            onClick={() => onLabelChange({ isStaged: false })}
          >
            Natural
          </Button>
          <Button
            variant={labelData.isStaged === true ? 'primary' : 'ghost'}
            className="flex-1"
            onClick={() => onLabelChange({ isStaged: true })}
          >
            Pose
          </Button>
        </div>
      </div>

      {/* Arousal */}
      <div>
        <label className="block text-xs text-tech-blue mb-2 font-bold uppercase">
          How would you rate your emotional continuity? *
        </label>
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
          <span>Lowest</span>
          <span>Highest</span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={labelData.arousal}
            onChange={(e) => onLabelChange({ arousal: Number(e.target.value) })}
            className="flex-1 accent-tech-blue h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="font-mono text-tech-blue w-8 text-right">
            {labelData.arousal}
          </span>
        </div>
      </div>

      <Button onClick={onSubmit} disabled={!canSubmit} className="w-full mt-8">
        Submit to Consensus
      </Button>
    </div>
  );
};

