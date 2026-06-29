/** 채팅 REST API — 설계서 v2.0 4.5 (실시간 송수신은 chatSocket.ts) */
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
  markRead: (messageId: number) =>
    unwrap(apiClient.put<ApiResponse<void>>(`/chat/read/${messageId}`)),
};
