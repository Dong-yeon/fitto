/** 네비게이션 파라미터 타입 — 설계서 2. 화면 설계 */
import type { NavigatorScreenParams } from '@react-navigation/native';

// 2.1 온보딩 플로우 (v2.0: 관계 선택 / 트레이너 등록 추가)
export type OnboardingStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  RelationSelect: undefined; // '커플 연결' / '트레이너입니다' / '나중에'
  CoupleConnect: undefined;
  TrainerRegister: undefined;
};

// 2.2 메인 탭 (홈/운동/채팅/MY)
export type MainTabParamList = {
  Home: undefined;
  Workout: undefined;
  Chat: undefined;
  My: undefined;
};

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
