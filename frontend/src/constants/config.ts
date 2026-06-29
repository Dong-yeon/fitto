/**
 * 환경 설정. 실제 배포 시 app.json의 extra 또는 .env로 분리.
 * 설계서 4.1 — Base URL: /api/v1
 */
import { Platform } from 'react-native';

// Android 에뮬레이터는 호스트 머신을 10.0.2.2 로 접근
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = `http://${LOCAL_HOST}:8080/api/v1`;
// STOMP over WebSocket — 설계서 4.5 (@stomp/stompjs brokerURL 은 ws:// 스킴)
export const WS_BASE_URL = `ws://${LOCAL_HOST}:8080/ws/chat`;

export const STORAGE_KEYS = {
  accessToken: 'fitto.accessToken',
  refreshToken: 'fitto.refreshToken',
} as const;
