/**
 * 인증 상태 스토어 (Zustand) — 설계서 6.1
 * 토큰은 SecureStore, 사용자 정보는 메모리 보관.
 */
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants/config';
import { authApi, RegisterPayload } from '../api/auth';
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
  await SecureStore.deleteItemAsync(STORAGE_KEYS.accessToken);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.refreshToken);
}

async function persistTokens(tokens: AuthTokens) {
  await SecureStore.setItemAsync(STORAGE_KEYS.accessToken, tokens.accessToken);
  await SecureStore.setItemAsync(STORAGE_KEYS.refreshToken, tokens.refreshToken);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // 앱 시작 시 저장된 토큰 확인
  bootstrap: async () => {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.accessToken);
    set({ isAuthenticated: !!token, isLoading: false });
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
