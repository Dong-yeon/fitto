/** 관계(Relation) API — 설계서 v2.0 4.3 */
import { apiClient, unwrap } from './client';
import type { ApiResponse, InviteCode, Relation } from '../types';

export const relationApi = {
  // 커플
  createCoupleInvite: () =>
    unwrap(apiClient.post<ApiResponse<InviteCode>>('/relations/couple/invite')),
  connectCouple: (code: string) =>
    unwrap(apiClient.post<ApiResponse<Relation>>('/relations/couple/connect', { code })),

  // 공통 관계 조회/해제
  list: () => unwrap(apiClient.get<ApiResponse<Relation[]>>('/relations')),
  detail: (id: number) => unwrap(apiClient.get<ApiResponse<Relation>>(`/relations/${id}`)),
  end: (id: number) => unwrap(apiClient.delete<ApiResponse<void>>(`/relations/${id}`)),

  // 트레이너 (phase 6~7)
  registerTrainer: (payload: { specialty?: string; introduction?: string; career?: string }) =>
    unwrap(apiClient.post<ApiResponse<Relation>>('/relations/trainer/register', payload)),
  createTrainerInvite: () =>
    unwrap(apiClient.post<ApiResponse<InviteCode>>('/relations/trainer/invite')),
  connectMember: (code: string) =>
    unwrap(apiClient.post<ApiResponse<Relation>>('/relations/trainer/connect', { code })),
};
