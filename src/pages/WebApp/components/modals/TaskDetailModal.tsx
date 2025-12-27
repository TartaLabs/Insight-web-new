import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Timer, XCircle } from 'lucide-react';
import type { Task, MediaInfo } from '@/services/model/types';
import { useProStore } from '@/store/proStore';

/**
 * 任务详情弹窗数据，基于 API 返回的 Task 结构
 */
export interface TaskDetailData {
  mediaUrl: string;
  mediaInfo: MediaInfo;
  task: Task;
}

interface TaskDetailModalProps {
  data: TaskDetailData;
  onClose: () => void;
}

/**
 * 任务详情弹窗组件
 */
export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ data, onClose }) => {
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const pro = useProStore((state) => state.pro);

  const { task, mediaInfo, mediaUrl } = data;

  // 根据 mediaInfo.status 计算显示状态
  const displayStatus =
    mediaInfo.status === 'VALID'
      ? 'ACCEPTED'
      : mediaInfo.status === 'INVALID'
        ? 'REJECTED'
        : 'VERIFYING';

  // Reset photo reveal when task changes
  const prevTaskId = useRef(task.id);
  useEffect(() => {
    if (prevTaskId.current !== task.id) {
      setPhotoRevealed(false);
      prevTaskId.current = task.id;
    }
  }, [task.id]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden border border-tech-blue/50 rounded-lg bg-[#0a0d14] shadow-[0_0_30px_rgba(0,243,255,0.25)]">
        <div className="absolute inset-3 border border-white/10 rounded pointer-events-none" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white z-10"
          aria-label="Close details modal"
        >
          <X size={16} />
        </button>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[90vh]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-tech-blue uppercase tracking-[0.2em]">
                Submission Details
              </div>
              <div className="text-[11px] text-gray-400 font-mono mt-1">ID: {task.id}</div>
            </div>
            <div className="text-[11px] text-gray-500 font-mono">
              {new Date(mediaInfo.submit_time * 1000).toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Label Summary */}
            <div className="lg:col-span-2 bg-[#0c111a] border border-white/10 rounded-md p-5 shadow-inner space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                  Label Summary
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                  {displayStatus === 'ACCEPTED' && (
                    <span className="text-green-500 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Accepted
                    </span>
                  )}
                  {displayStatus === 'VERIFYING' && (
                    <span className="text-yellow-500 font-bold flex items-center gap-1">
                      <Timer size={12} className="animate-spin" /> Verifying
                    </span>
                  )}
                  {displayStatus === 'REJECTED' && (
                    <span className="text-red-500 font-bold flex items-center gap-1">
                      <XCircle size={12} /> Rejected
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-white">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Emotion</div>
                  <div className="font-bold text-lg">{task.emotion_type}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Status</div>
                  <div className="text-[13px] font-bold">
                    {displayStatus === 'ACCEPTED' && (
                      <span className="text-green-500">Accepted</span>
                    )}
                    {displayStatus === 'VERIFYING' && (
                      <span className="text-yellow-500">Verifying</span>
                    )}
                    {displayStatus === 'REJECTED' && <span className="text-red-500">Rejected</span>}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] text-gray-500 uppercase">Task Info</div>
                <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-300">
                  <div>
                    Task Type: <span className="text-white font-bold">{task.task_type}</span>
                  </div>
                  <div>
                    Reward:{' '}
                    <span className="text-white font-bold">
                      {pro.benefits.points_per_annotation}
                    </span>
                  </div>
                  <div>
                    Media Type: <span className="text-white font-bold">{task.media_type}</span>
                  </div>
                  {mediaInfo.validate_time > 0 && (
                    <div>
                      Validated:{' '}
                      <span className="text-white font-bold">
                        {new Date(mediaInfo.validate_time * 1000).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Answers Section */}
              {mediaInfo.answers && mediaInfo.answers.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase">Your Answers</div>
                  <div className="space-y-3">
                    {mediaInfo.answers.map((answer) => {
                      const question = task.questions.find((q) => q.id === answer.question_id);
                      if (!question) return null;
                      return (
                        <div
                          key={answer.question_id}
                          className="bg-black/30 border border-white/5 rounded-md p-3"
                        >
                          <div className="text-[11px] text-gray-400 mb-1">{question.title}</div>
                          <div className="text-sm text-white font-medium">
                            {question.type === 'RATING'
                              ? `${answer.answer} / 100`
                              : String(answer.answer)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Photo Preview */}
            <div className="w-full bg-[#0c111a] border border-white/10 p-4 rounded-md shadow-inner flex flex-col gap-3">
              <div className="text-[10px] text-gray-500 uppercase">Photo Preview</div>
              <div
                className={`flex-1 border border-dashed border-white/15 bg-black/40 rounded-md flex items-center justify-center min-h-[280px] text-gray-500 text-xs overflow-hidden relative ${mediaUrl ? 'cursor-pointer' : ''}`}
                onClick={() => setPhotoRevealed(true)}
              >
                {mediaUrl ? (
                  <>
                    <img
                      src={mediaUrl}
                      alt="Captured"
                      className={`w-full h-full object-contain rounded-md transition-all duration-300 ${photoRevealed ? 'blur-0 opacity-100' : 'blur-sm scale-105 opacity-80'}`}
                    />
                    {!photoRevealed && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white text-[11px] bg-black/30">
                        <div className="px-3 py-1 bg-black/60 rounded-full border border-white/15">
                          Blurred for privacy
                        </div>
                        <div className="text-gray-300">Tap to reveal full photo</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-10">
                    <div className="w-12 h-12 rounded-full border border-white/10" />
                    <span>Image loading...</span>
                  </div>
                )}
              </div>
              {mediaUrl && !photoRevealed && (
                <button
                  onClick={() => setPhotoRevealed(true)}
                  className="text-[11px] text-tech-blue underline hover:text-white text-left"
                >
                  Show full photo (current modal)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
