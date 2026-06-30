/**
 * 공통 도메인 타입 — 설계서 v2.0 (5. DB 설계 / 3. 기능 명세 기준)
 */

// 4.1 공통 응답 형식: { success, data, message, errorCode }
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errorCode: string | null;
}

export type SocialType = 'KAKAO' | 'APPLE' | 'EMAIL';
export type Gender = 'MALE' | 'FEMALE';

// 1.3 사용자 역할
export type Role = 'USER' | 'TRAINER' | 'ADMIN';

// 5.2 users
export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  birthDate?: string | null;
  gender?: Gender | null;
  profileImageUrl?: string | null;
  socialType?: SocialType | null;
}

// 5.3 relations — COUPLE / TRAINER_MEMBER
export type RelationType = 'COUPLE' | 'TRAINER_MEMBER';
export type RelationStatus = 'PENDING' | 'ACTIVE' | 'ENDED';

export interface Relation {
  id: number;
  relationType: RelationType;
  status: RelationStatus;
  // 상대방(커플 파트너 / 트레이너 입장에선 회원, 회원 입장에선 트레이너)
  partner: User | null;
  connectedAt?: string | null;
  backgroundImageUrl?: string | null;
  anniversaryDate?: string | null;
}

export interface InviteCode {
  code: string;
  expiresAt: string;
}

// 5.4 trainer_profiles
export interface TrainerProfile {
  id: number;
  userId: number;
  specialty?: string | null;
  introduction?: string | null;
  career?: string | null;
  certificate?: string | null;
  maxMembers: number;
  isAccepting: boolean;
}

// 5.5 / 5.6 workouts
export interface WorkoutSet {
  id?: number;
  exerciseName: string;
  category?: string | null;
  sets?: number | null;
  reps?: number | null;
  weightKg?: number | null;
  orderNo: number;
}

export interface Workout {
  id: number;
  userId: number;
  relationId?: number | null;
  workoutDate: string;
  totalDurationMin?: number | null;
  memo?: string | null;
  sets: WorkoutSet[];
}

// 캘린더 응답 (4.4 GET /workout/calendar)
export interface CalendarDay {
  date: string;
  completed: boolean;
}

// 커플 상대방 오늘 운동 여부 (홈 커플 카드)
export interface PartnerToday {
  connected: boolean;
  partnerName: string | null;
  completed: boolean;
}

// 운동 통계 (WORKOUT-07)
export interface WorkoutStats {
  weeklyDays: number;
  monthlyDays: number;
  totalDays: number;
  last7Days: { date: string; weekday: string; completed: boolean }[];
  categoryBreakdown: { category: string; count: number }[];
}

// 5.7 trainer_routines
export interface TrainerRoutine {
  id: number;
  relationId: number;
  trainerId: number;
  memberId: number;
  title: string;
  description?: string | null;
  routineDate?: string | null;
  isCompleted: boolean;
}

// 5.8 chat_messages
export type MessageType = 'TEXT' | 'IMAGE' | 'WORKOUT_CARD' | 'ROUTINE_CARD';
export interface ChatMessage {
  id: number;
  relationId: number;
  senderId: number;
  messageType: MessageType;
  content?: string | null;
  imageUrl?: string | null;
  workoutId?: number | null;
  routineId?: number | null;
  isRead: boolean;
  createdAt: string;
}

// 채팅방 목록 (4.5 GET /chat/rooms)
export interface ChatRoom {
  relationId: number;
  relationType: RelationType;
  partner: User | null;
  lastMessage?: ChatMessage | null;
  unreadCount: number;
}

// 5.9 streaks
export type StreakType = 'PERSONAL' | 'COUPLE';
export interface Streak {
  streakType: StreakType;
  currentCount: number;
  maxCount: number;
  lastWorkoutDate?: string | null;
}

// 인증 토큰 응답 (4.2 / AUTH-05)
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}
