/** 채팅 API — 설계서 v2.0 4.5 (관계별 채팅방, WebSocket 연결은 phase 4) */
import { apiClient, unwrap } from './client';
import type { ApiResponse, ChatMessage, ChatRoom } from '../types';

export const chatApi = {
  rooms: () => unwrap(apiClient.get<ApiResponse<ChatRoom[]>>('/chat/rooms')),
  messages: (relationId: number, cursor?: number) =>
    unwrap(
      apiClient.get<ApiResponse<ChatMessage[]>>(`/chat/rooms/${relationId}/messages`, {
        params: { cursor },
      }),
    ),
  sendImage: (relationId: number, form: FormData) =>
    unwrap(
      apiClient.post<ApiResponse<ChatMessage>>(`/chat/rooms/${relationId}/image`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    ),
  markRead: (messageId: number) =>
    unwrap(apiClient.put<ApiResponse<void>>(`/chat/read/${messageId}`)),
};
