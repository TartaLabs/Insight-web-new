import React from 'react';
import { Zap } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { EmotionType } from '@/types';

const emotionEmojis: Record<EmotionType, string> = {
  HAPPY: '😊',
  ANGRY: '😡',
  SAD: '😢',
  FEAR: '😱',
  DISGUST: '🤢',
  SURPRISE: '😲',
  NEUTRAL: '😐',
};

/**
 * 任务列表卡片组件
 * 显示各情绪类型的任务进度和启动按钮
 */
export const TaskListCard: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const startTask = useTaskStore((state) => state.startTask);

  return (
    <div className="col-span-1 lg:col-span-3">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-bold text-tech-blue uppercase tracking-widest flex items-center gap-2">
          <Zap size={14} /> Active Missions
        </h3>
        <div className="text-[10px] text-gray-500 font-mono">REFRESH: 00:00 UTC</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {tasks.map((task) => {
          const count = Object.keys(task.medias || {}).length || 0;
          const isCompleted = count >= task.media_nums;

          return (
            <button
              key={task.id}
              onClick={() => !isCompleted && startTask(task)}
              disabled={isCompleted}
              className={`
                relative p-3 h-32 flex flex-col items-center justify-center gap-3 transition-all duration-300
                border border-white/10 hover:border-tech-blue/50 bg-[#0f0f15] hover:bg-[#151520]
                ${isCompleted ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                clipPath:
                  'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
              }}
            >
              <div className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {emotionEmojis[task.emotion_type]}
              </div>
              <div className="w-full px-2">
                <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-400">
                  <span>{task.emotion_type}</span>
                  <span className={isCompleted ? 'text-green-500' : 'text-tech-blue'}>
                    {count}/{task.media_nums}
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full shadow-[0_0_5px_currentColor] ${isCompleted ? 'bg-green-500 text-green-500' : 'bg-tech-blue text-tech-blue'}`}
                    style={{ width: `${(count / task.media_nums) * 100}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
