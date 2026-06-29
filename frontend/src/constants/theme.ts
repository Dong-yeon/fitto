/**
 * Fitto 디자인 토큰
 * 설계서 1.3 핵심 가치 — "부드럽고 감성적인 커플 앱" 톤에 맞춘 컬러 팔레트
 */
export const colors = {
  primary: '#FF8FA3', // 부드러운 코랄 핑크 (커플 감성)
  primaryDark: '#F26B82',
  secondary: '#7DD3C0', // 민트 (운동/건강)
  accent: '#FFB870', // 스트릭 불꽃
  background: '#FFF8F9',
  surface: '#FFFFFF',
  textPrimary: '#2B2B2B',
  textSecondary: '#8A8A8A',
  border: '#F0E4E6',
  success: '#5BC98E',
  danger: '#E5566B',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const fontSize = {
  caption: 12,
  body: 14,
  subtitle: 16,
  title: 20,
  heading: 28,
} as const;
