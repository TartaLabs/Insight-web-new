import { create } from 'zustand';
import type { Task, QuestionAnswer } from '../services/model/types';
import type { TaskRecord, TaskDraftData, EmotionType } from '../types';
import { apiTask } from '../services/api';
import { dataUrlToFile } from '@/utils';
import toast from 'react-hot-toast';

/**
 * 统一的任务流状态：当用户正在进行任务时，此对象存在
 * - task: 服务端任务实例（始终存在）
 * - draft: 用户本地未提交的数据（图片、答案等）
 */
export interface ActiveTaskFlow {
  task: Task; // 服务端任务实例，始终存在
  draft: TaskDraftData; // 用户本地未提交的数据
}

// 从 activeTaskFlow 获取 emotion
export const getEmotionFromTaskFlow = (flow: ActiveTaskFlow): EmotionType => {
  return flow.task.emotion_type;
};

// 从 activeTaskFlow 获取 questions
export const getQuestionsFromTaskFlow = (flow: ActiveTaskFlow) => {
  return flow.task.questions;
};

// 从 activeTaskFlow 获取 rewardAmount
export const getRewardAmountFromTaskFlow = (flow: ActiveTaskFlow): number => {
  return flow.task.reward_amount;
};

interface TaskState {
  // API Tasks (from server)
  tasks: Task[];
  claimedAt: number;

  // Local Task Records (drafts, submitted, etc.)
  // 以 task_id 作为唯一标识
  taskRecords: TaskRecord[];

  // Active task flow state
  activeTaskFlow: ActiveTaskFlow | null;

  // Loading state
  loading: boolean;
  submitLoading: boolean;
  error: string | null;
  initialized: boolean;

  // API methods
  fetchDailyTasks: () => Promise<void>;
  updateTasks: (tasks: Task[], claimedAt: number) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Task flow handlers
  startTask: (task: Task) => void;
  resumeTask: (record: TaskRecord) => void;
  cancelTask: () => void;
  saveDraft: (draft: TaskDraftData) => void;
  submitTask: (answers: QuestionAnswer[], onSubmitSuccess?: () => void) => Promise<void>;
  deleteTaskRecord: (taskId: string) => void;
  refreshList: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // API Tasks
  tasks: [],
  claimedAt: 0,

  // Local Task Records
  taskRecords: [],

  // Active task flow state (简化为单一状态)
  activeTaskFlow: null,

  // Loading state
  loading: false,
  error: null,
  initialized: false,

  submitLoading: false,

  fetchDailyTasks: async () => {
    // 避免重复请求
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const response = await apiTask.getDailyTasks();
      set({
        tasks: response.data.tasks.filter((task) => task.task_type === 'DAILY'),
        claimedAt: response.data.claimed_at,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch daily tasks';
      set({ error: errorMessage, loading: false, initialized: true });
    }
  },

  refreshList: async () => {
    try {
      const response = await apiTask.getDailyTasks();
      set({
        tasks: response.data.tasks.filter((task) => task.task_type === 'DAILY'),
      });
    } catch (error) {
      console.error('Failed to refresh task list:', error);
    }
  },

  updateTasks: (tasks: Task[], claimedAt: number) => set({ tasks, claimedAt }),

  addTask: (task: Task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (taskId: string, updates: Partial<Task>) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
    })),

  removeTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  reset: () =>
    set({
      tasks: [],
      claimedAt: 0,
      taskRecords: [],
      activeTaskFlow: null,
      loading: false,
      error: null,
      initialized: false,
    }),

  // Task flow handlers
  startTask: (task: Task) => {
    set({
      activeTaskFlow: {
        task,
        draft: {},
      },
    });
  },

  resumeTask: (record: TaskRecord) => {
    set({
      activeTaskFlow: {
        task: record.task,
        draft: record.draft,
      },
    });
  },

  cancelTask: () => {
    set({ activeTaskFlow: null });
  },

  saveDraft: (draft: TaskDraftData) => {
    const { activeTaskFlow } = get();
    if (!activeTaskFlow) return;

    const taskId = activeTaskFlow.task.id;
    const record: TaskRecord = {
      task_id: taskId,
      task: activeTaskFlow.task,
      draft,
      status: 'DRAFT',
      timestamp: Date.now(),
    };

    set((state) => {
      const existing = state.taskRecords.findIndex((t) => t.task_id === taskId);
      if (existing !== -1) {
        const updated = [...state.taskRecords];
        updated[existing] = record;
        return {
          taskRecords: updated,
          activeTaskFlow: null,
        };
      }
      return {
        taskRecords: [record, ...state.taskRecords],
        activeTaskFlow: null,
      };
    });
  },

  submitTask: async (answers: QuestionAnswer[], onSubmitSuccess?: () => void) => {
    const { activeTaskFlow, refreshList, deleteTaskRecord } = get();
    if (!activeTaskFlow || !activeTaskFlow.draft.imageUrl) return;

    const task = activeTaskFlow.task;
    const taskId = task.id; // 任务唯一 ID，用于删除草稿
    const apiTaskId = task.task_id; // 任务类型 ID，用于 API 调用 (number)
    const imageUrl = activeTaskFlow.draft.imageUrl;

    try {
      set({ submitLoading: true });
      // 将 imageUrl 转为 File 结构，并上传到服务器
      const file = dataUrlToFile(imageUrl, 'image.png');
      const mediaUrl = await apiTask.uploadTaskImage(apiTaskId, file);

      if (mediaUrl) {
        await apiTask.submissionTask(apiTaskId, [{ url: mediaUrl, answers }]);
        await refreshList();
        // 删除对应的草稿记录（如果是从草稿恢复的）
        deleteTaskRecord(taskId);
        set({ activeTaskFlow: null });
        onSubmitSuccess?.();
      }
      toast.success('Task submitted successfully');
    } catch (error) {
      toast.error('Failed to submit task');
      console.error('Failed to submit task:', error);
      // 保持 activeTaskFlow 状态，让用户可以重试
    } finally {
      set({ submitLoading: false });
    }
  },

  deleteTaskRecord: (taskId: string) => {
    set((state) => ({
      taskRecords: state.taskRecords.filter((t) => t.task_id !== taskId),
    }));
  },
}));
