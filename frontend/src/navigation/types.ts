/** 네비게이션 파라미터 타입 — 설계서 2. 화면 설계 */
import type { NavigatorScreenParams } from '@react-navigation/native';

// 2.1 온보딩 플로우 (인증 전)
export type OnboardingStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

// 홈 탭 내부 스택 — 커플 연결 진입 (REL-01/02)
export type HomeStackParamList = {
  HomeMain: undefined;
  CoupleConnect: undefined;
};

// 2.2 메인 탭 (홈/운동/채팅/MY)
export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Workout: undefined;
  Chat: undefined;
  My: undefined;
};

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
