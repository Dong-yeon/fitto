/** 푸시 토큰 API — 설계서 CHAT-06 */
import { apiClient, unwrap } from './client';
import type { ApiResponse } from '../types';

export const notificationApi = {
  registerToken: (token: string, platform: string) =>
    unwrap(apiClient.post<ApiResponse<void>>('/notifications/token', { token, platform })),
};
