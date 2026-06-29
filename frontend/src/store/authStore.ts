/**
 * 인증 상태 스토어 (Zustand) — 설계서 6.1
 * 토큰은 SecureStore, 사용자 정보는 메모리 보관.
 */
import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants/config';
import { authApi, RegisterPayload } from '../api/auth';
import { setAuthFailureHandler } from '../api/client';
import { storage } from '../utils/storage';
import { useChatStore } from './chatStore';
import type { AuthTokens, User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  withdraw: () => Promise<void>;
  setSession: (tokens: AuthTokens) => Promise<void>;
}

async function clearTokens() {
  await storage.removeItem(STORAGE_KEYS.accessToken);
  await storage.removeItem(STORAGE_KEYS.refreshToken);
  // 세션 종료 시 채팅 소켓 정리
  useChatStore.getState().teardown();
}

async function persistTokens(tokens: AuthTokens) {
  await storage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
  await storage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // 앱 시작 시 저장된 토큰 확인 후 프로필 복원
  bootstrap: async () => {
    const token = await storage.getItem(STORAGE_KEYS.accessToken);
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      // 토큰 만료 시 client 인터셉터가 refresh 를 시도. 실패하면 catch 로 이동.
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      await clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setSession: async (tokens) => {
    await persistTokens(tokens);
    set({ user: tokens.user, isAuthenticated: true });
  },

  login: async (email, password) => {
    const tokens = await authApi.login(email, password);
    await get().setSession(tokens);
  },

  register: async (payload) => {
    const tokens = await authApi.register(payload);
    await get().setSession(tokens);
  },

  // v2.0: 로그아웃은 클라이언트에서 토큰만 삭제
  logout: async () => {
    await clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  withdraw: async () => {
    try {
      await authApi.withdraw();
    } finally {
      await clearTokens();
      set({ user: null, isAuthenticated: false });
    }
  },
}));

// refresh 실패 시(client 인터셉터) 세션을 비인증으로 전환. 토큰은 이미 정리됨.
setAuthFailureHandler(() => {
  useChatStore.getState().teardown();
  useAuthStore.setState({ user: null, isAuthenticated: false });
});
