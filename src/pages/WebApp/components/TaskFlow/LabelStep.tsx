import React from 'react';
import { Save } from 'lucide-react';
import { EmotionType } from '../../types';
import { Button } from '../Button';
import type { Question, QuestionAnswer } from '../../../../services/model/types';

interface LabelStepProps {
  submitLoading: boolean;
  emotion: EmotionType;
  questions: Question[];
  answers: Record<number, string | number>; // question_id -> answer
  onAnswerChange: (questionId: number, answer: string | number) => void;
  onSaveDraft: () => void;
  onSubmit: (answers: QuestionAnswer[]) => void;
}

/**
 * 任务流程 - 标注步骤
 * 根据 API 返回的 questions 动态渲染表单
 */
export const LabelStep: React.FC<LabelStepProps> = ({
  submitLoading,
  emotion,
  questions,
  answers,
  onAnswerChange,
  onSaveDraft,
  onSubmit,
}) => {
  // 按 order 排序问题
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  // 检查是否所有必填问题都已回答
  const canSubmit = sortedQuestions.every((q) => {
    if (!q.required) return true;
    const answer = answers[q.id];
    return answer !== undefined && answer !== null && answer !== '';
  });

  // 处理提交
  const handleSubmit = () => {
    const answerList: QuestionAnswer[] = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: Number(questionId),
      answer: answer as string | number,
    }));
    onSubmit(answerList);
  };

  // 渲染单选题
  const renderSingleChoice = (question: Question) => {
    const currentAnswer = answers[question.id];

    // 特殊处理情绪类型问题（锁定显示）
    if (question.title.toLowerCase().includes('type of emotion')) {
      return (
        <div className="w-full bg-white/5 border border-white/10 px-4 py-3 text-gray-300 cursor-not-allowed font-mono">
          {emotion.toUpperCase()} [Locked]
        </div>
      );
    }

    // 普通单选题
    return (
      <div className="flex gap-4 flex-wrap">
        {question.options?.map((option) => (
          <Button
            key={option}
            variant={currentAnswer === option ? 'primary' : 'ghost'}
            className="flex-1 min-w-[100px]"
            onClick={() => onAnswerChange(question.id, option)}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  };

  // 渲染评分题
  const renderRating = (question: Question) => {
    const currentValue = (answers[question.id] as number) ?? 50;

    return (
      <>
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
          <span>Lowest</span>
          <span>Highest</span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={currentValue}
            onChange={(e) => onAnswerChange(question.id, Number(e.target.value))}
            className="flex-1 accent-tech-blue h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="font-mono text-tech-blue w-8 text-right">{currentValue}</span>
        </div>
      </>
    );
  };

  // 根据问题类型渲染不同组件
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'SINGLE_CHOICE':
        return renderSingleChoice(question);
      case 'RATING':
        return renderRating(question);
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md z-10 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <h3 className="font-bold text-white uppercase tracking-wider">Data Annotation</h3>
        <button
          onClick={onSaveDraft}
          className="text-xs text-gray-500 hover:text-white flex items-center gap-1"
        >
          <Save size={12} /> SAVE PROGRESS
        </button>
      </div>

      {sortedQuestions.map((question) => (
        <div key={question.id}>
          <label className="block text-xs text-tech-blue mb-2 font-bold uppercase">
            {question.title} {question.required && '*'}
          </label>
          {question.description && (
            <p className="text-[10px] text-gray-500 mb-2">{question.description}</p>
          )}
          {renderQuestion(question)}
        </div>
      ))}

      <Button
        loading={submitLoading}
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full mt-8"
      >
        Submit to Consensus
      </Button>
    </div>
  );
};
