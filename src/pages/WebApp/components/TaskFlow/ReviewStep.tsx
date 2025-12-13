import React from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { Button } from '../Button';

interface ReviewStepProps {
  photo: string;
  onRetake: () => void;
  onSaveDraft: () => void;
  onConfirm: () => void;
}

/**
 * 任务流程 - 预览步骤
 * 显示拍摄的照片和操作按钮
 */
export const ReviewStep: React.FC<ReviewStepProps> = ({
  photo,
  onRetake,
  onSaveDraft,
  onConfirm,
}) => {
  return (
    <div className="flex flex-col items-center w-full z-10">
      <div className="relative w-full max-w-sm aspect-[3/4] bg-black border border-tech-blue/50 mb-6 overflow-hidden">
        <img src={photo} alt="Capture" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full bg-black/60 p-2 text-center text-[10px] text-tech-blue border-t border-tech-blue/30">
          IMAGE_CAPTURED
        </div>
      </div>
      <div className="flex gap-4 w-full max-w-sm mb-6">
        <Button variant="ghost" onClick={onRetake} className="flex-1">
          <RotateCcw size={14} /> Retake
        </Button>
        <Button variant="secondary" onClick={onSaveDraft} className="flex-1">
          <Save size={14} /> Save Draft
        </Button>
      </div>
      <Button onClick={onConfirm} className="w-full max-w-sm">
        Proceed to Analysis
      </Button>
    </div>
  );
};

