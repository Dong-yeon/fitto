/** 인증 API — 설계서 4.2 */
import { apiClient, unwrap } from './client';
import type { ApiResponse, AuthTokens, Gender } from '../types';

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  birthDate?: string;
  gender?: Gender;
  weeklyGoal?: number; // 목표 운동 횟수/주
}

export const authApi = {
  kakaoLogin: (accessToken: string) =>
    unwrap(apiClient.post<ApiResponse<AuthTokens>>('/auth/kakao', { accessToken })),
  appleLogin: (identityToken: string) =>
    unwrap(apiClient.post<ApiResponse<AuthTokens>>('/auth/apple', { identityToken })),
  login: (email: string, password: string) =>
    unwrap(apiClient.post<ApiResponse<AuthTokens>>('/auth/login', { email, password })),
  register: (payload: RegisterPayload) =>
    unwrap(apiClient.post<ApiResponse<AuthTokens>>('/auth/register', payload)),
  logout: () => unwrap(apiClient.post<ApiResponse<void>>('/auth/logout')),
  withdraw: () => unwrap(apiClient.delete<ApiResponse<void>>('/auth/withdraw')),
};
