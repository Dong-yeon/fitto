/** 운동 기록 상태 스토어 — 설계서 3.3 / 4.4 */
import { create } from 'zustand';
import { workoutApi, SaveWorkoutPayload } from '../api/workout';
import type { Workout } from '../types';

const PAGE_SIZE = 20;

interface WorkoutState {
  today: Workout[];
  history: Workout[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  fetchToday: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  loadMoreHistory: () => Promise<void>;
  save: (payload: SaveWorkoutPayload) => Promise<Workout>;
  remove: (id: number) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  today: [],
  history: [],
  loading: false,
  loadingMore: false,
  hasMore: true,

  fetchToday: async () => {
    const today = await workoutApi.today();
    set({ today });
  },

  fetchHistory: async () => {
    set({ loading: true });
    try {
      const history = await workoutApi.history();
      set({ history, hasMore: history.length === PAGE_SIZE });
    } finally {
      set({ loading: false });
    }
  },

  loadMoreHistory: async () => {
    const { history, hasMore, loadingMore } = get();
    if (!hasMore || loadingMore || history.length === 0) return;
    set({ loadingMore: true });
    try {
      const cursor = history[history.length - 1].id;
      const next = await workoutApi.history(cursor);
      set({ history: [...history, ...next], hasMore: next.length === PAGE_SIZE });
    } finally {
      set({ loadingMore: false });
    }
  },

  save: async (payload) => {
    const saved = await workoutApi.save(payload);
    await get().fetchToday();
    await get().fetchHistory();
    return saved;
  },

  remove: async (id) => {
    await workoutApi.remove(id);
    set({
      today: get().today.filter((w) => w.id !== id),
      history: get().history.filter((w) => w.id !== id),
    });
  },
}));
