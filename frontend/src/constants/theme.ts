/**
 * Fitto 디자인 토큰 — 미니멀 + 발랄(playful) 톤.
 * 깨끗한 화이트 배경 + 생기있는 코랄/민트/옐로 포인트, 둥근 모서리, 부드러운 그림자.
 */
export const colors = {
  // 브랜드
  primary: '#FF7A93', // 코랄 핑크 (발랄한 메인)
  primaryDark: '#F2566F',
  primarySoft: '#FFE6EC', // 핑크 틴트 배경
  secondary: '#3FC7B4', // 민트 (운동/건강)
  secondarySoft: '#DEF7F3',
  accent: '#FFC24B', // 옐로 (스트릭/포인트)
  accentSoft: '#FFF1D2',

  // 표면/배경
  background: '#FFF9FA', // 따뜻한 화이트
  surface: '#FFFFFF',
  surfaceAlt: '#FFF3F6',

  // 텍스트
  textPrimary: '#2B2B33',
  textSecondary: '#9596A1',
  textTertiary: '#C7C8D1',

  // 보더/상태
  border: '#F2E8EB',
  success: '#34C77B',
  danger: '#FF5A6E',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const fontSize = {
  caption: 12,
  body: 14,
  subtitle: 16,
  title: 20,
  heading: 26,
  display: 32,
} as const;

/** 부드러운 그림자 (iOS/Android/web 호환). 핑크빛 그림자로 감성 ↑ */
export const shadow = {
  sm: {
    shadowColor: '#FF8FA3',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  md: {
    shadowColor: '#FF8FA3',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
} as const;
