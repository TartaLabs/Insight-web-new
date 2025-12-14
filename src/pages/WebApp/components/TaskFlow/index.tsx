import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ExampleStep } from './ExampleStep';
import { CaptureStep } from './CaptureStep';
import { ReviewStep } from './ReviewStep';
import { LabelStep } from './LabelStep';
import type { QuestionAnswer } from '../../../../services/model/types';
import {
  useTaskStore,
  getEmotionFromTaskFlow,
  getQuestionsFromTaskFlow,
  type ActiveTaskFlow,
} from '../../../../store/taskStore';
import { useProStore } from '@/store/proStore';

type Step = 'example' | 'capture' | 'review' | 'label';

/**
 * 任务流程内部组件
 * 接收确定存在的 activeTaskFlow，处理所有 hooks 和渲染逻辑
 */
const TaskFlowContent: React.FC<{ flow: ActiveTaskFlow; onSubmitSuccess?: () => void }> = ({
  flow,
  onSubmitSuccess,
}) => {
  const { saveDraft, submitTask, cancelTask, submitLoading } = useTaskStore();
  const pro = useProStore((state) => state.pro);

  // 从 activeTaskFlow 获取数据
  const emotion = getEmotionFromTaskFlow(flow);
  const questions = getQuestionsFromTaskFlow(flow);
  const rewardAmount = pro.benefits.points_per_annotation;
  const initialDraft = flow.draft;

  const [currentStep, setCurrentStep] = useState<Step>(
    initialDraft?.imageUrl ? 'review' : 'example',
  );

  // Data State
  const [photo, setPhoto] = useState<string | null>(initialDraft?.imageUrl || null);

  // 问题答案状态: question_id -> answer
  const [answers, setAnswers] = useState<Record<number, string | number>>(() => {
    // 如果有草稿数据，尝试恢复答案
    if (initialDraft?.answers) {
      return initialDraft.answers;
    }

    // 初始化答案状态
    const initialAnswers: Record<number, string | number> = {};

    // 为 RATING 类型问题设置默认值 50
    questions.forEach((q) => {
      if (q.type === 'RATING') {
        initialAnswers[q.id] = 50;
      }
      // 自动锁定情绪类型问题
      if (q.type === 'SINGLE_CHOICE' && q.title.toLowerCase().includes('type of emotion')) {
        initialAnswers[q.id] = emotion;
      }
    });

    return initialAnswers;
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

    saveDraft({
      imageUrl: photo,
      answers,
    });
  };

  const handleConfirmPhoto = () => {
    setCurrentStep('label');
  };

  const handleAnswerChange = (questionId: number, answer: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = (answerList: QuestionAnswer[]) => {
    if (photo) {
      // 先更新 draft 中的数据，然后提交
      useTaskStore.setState((state) => ({
        activeTaskFlow: state.activeTaskFlow
          ? {
              ...state.activeTaskFlow,
              draft: { imageUrl: photo, answers },
            }
          : null,
      }));
      submitTask(answerList, onSubmitSuccess);
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
            <button
              onClick={cancelTask}
              className="text-gray-400 hover:text-white transition-colors"
            >
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
              submitLoading={submitLoading}
              emotion={emotion}
              questions={questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * 任务流程容器组件
 * 管理任务执行的各个步骤
 * 所有数据从 store 的 activeTaskFlow 中获取
 */
export const TaskFlow: React.FC = () => {
  const { activeTaskFlow } = useTaskStore();

  // 如果没有 activeTaskFlow，不渲染
  if (!activeTaskFlow) return null;

  return <TaskFlowContent flow={activeTaskFlow} />;
};

export { ExampleStep } from './ExampleStep';
export { CaptureStep } from './CaptureStep';
export { ReviewStep } from './ReviewStep';
export { LabelStep } from './LabelStep';
