/** 토스트(짧은 알림) 상태 — 어디서든 toast.show('메시지') 로 호출 */
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastState {
  toast: ToastData | null;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  show: (message, type = 'success') => set({ toast: { id: ++counter, message, type } }),
  hide: () => set({ toast: null }),
}));

/** 컴포넌트 밖에서도 쓰기 위한 헬퍼 */
export const toast = {
  success: (m: string) => useToastStore.getState().show(m, 'success'),
  error: (m: string) => useToastStore.getState().show(m, 'error'),
  info: (m: string) => useToastStore.getState().show(m, 'info'),
};
