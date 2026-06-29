/** 트레이너 API — 설계서 v2.0 4.6 (TRAINER 전용, phase 6~7) */
import { apiClient, unwrap } from './client';
import type { ApiResponse, TrainerProfile, User, Workout } from '../types';

export interface MemberSummary {
  member: User;
  todayCompleted: boolean;
  lastWorkoutDate?: string | null;
}

export interface TrainerDashboard {
  totalMembers: number;
  completedToday: number;
  members: MemberSummary[];
}

export const trainerApi = {
  members: () => unwrap(apiClient.get<ApiResponse<User[]>>('/trainer/members')),
  memberSummary: (userId: number) =>
    unwrap(apiClient.get<ApiResponse<Workout[]>>(`/trainer/members/${userId}/summary`)),
  dashboard: () => unwrap(apiClient.get<ApiResponse<TrainerDashboard>>('/trainer/dashboard')),
  updateProfile: (payload: Partial<TrainerProfile>) =>
    unwrap(apiClient.put<ApiResponse<TrainerProfile>>('/trainer/profile', payload)),
};
