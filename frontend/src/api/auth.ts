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
  refresh: (refreshToken: string) =>
    unwrap(
      apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }),
    ),
  // v2.0: 로그아웃 엔드포인트 없음 — 클라이언트에서 토큰 삭제로 처리
  withdraw: () => unwrap(apiClient.delete<ApiResponse<void>>('/auth/withdraw')),
};
