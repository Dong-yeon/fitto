/**
 * axios 인스턴스 — 설계서 4.1 공통 규칙
 * - Bearer JWT 자동 첨부
 * - 401 시 refresh token 갱신 (4.4 AUTH-04) 후 재시도
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, STORAGE_KEYS } from '../constants/config';
import type { ApiResponse, AuthTokens } from '../types';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터: access token 첨부
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(STORAGE_KEYS.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 → refresh 후 1회 재시도
let isRefreshing = false;
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && original && !original._retry && !isRefreshing) {
      original._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.refreshToken);
        if (!refreshToken) throw error;
        const { data } = await axios.post<ApiResponse<AuthTokens>>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        );
        await SecureStore.setItemAsync(STORAGE_KEYS.accessToken, data.data.accessToken);
        await SecureStore.setItemAsync(STORAGE_KEYS.refreshToken, data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(original);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

/** ApiResponse 래퍼를 벗겨 data만 반환하는 헬퍼 */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const res = await promise;
  if (!res.data.success) {
    throw new Error(res.data.message ?? res.data.errorCode ?? 'API Error');
  }
  return res.data.data;
}
