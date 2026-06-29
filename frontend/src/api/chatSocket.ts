/**
 * STOMP over WebSocket 클라이언트 — 설계서 4.5.
 * /pub/chat/{relationId} 로 발행, /sub/rooms/{relationId} 구독.
 */
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS, WS_BASE_URL } from '../constants/config';
import type { ChatMessage, MessageType } from '../types';

let client: Client | null = null;
let connecting: Promise<Client> | null = null;
const subscriptions = new Map<number, StompSubscription>();

export interface OutgoingMessage {
  messageType?: MessageType;
  content?: string;
  imageUrl?: string;
  workoutId?: number;
  routineId?: number;
}

/** 소켓 연결 (이미 연결됐거나 연결 중이면 재사용). */
export async function connectSocket(): Promise<Client> {
  if (client?.connected) return client;
  if (connecting) return connecting; // 진행 중인 연결 공유 (중복 Client 생성 방지)

  connecting = (async () => {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.accessToken);
    const c = new Client({
      brokerURL: WS_BASE_URL,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 3000,
      // React Native WebSocket 호환 플래그
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    });
    client = c;

    return new Promise<Client>((resolve, reject) => {
      c.onConnect = () => resolve(c);
      c.onStompError = (frame) => reject(new Error(frame.headers['message'] ?? 'STOMP 오류'));
      c.onWebSocketError = () => reject(new Error('WebSocket 연결 실패'));
      c.activate();
    });
  })().finally(() => {
    connecting = null;
  });

  return connecting;
}

export function subscribeRoom(relationId: number, onMessage: (msg: ChatMessage) => void) {
  if (!client?.connected) return;
  unsubscribeRoom(relationId);
  const sub = client.subscribe(`/sub/rooms/${relationId}`, (frame: IMessage) => {
    try {
      onMessage(JSON.parse(frame.body) as ChatMessage);
    } catch {
      // ignore malformed frame
    }
  });
  subscriptions.set(relationId, sub);
}

export function unsubscribeRoom(relationId: number) {
  subscriptions.get(relationId)?.unsubscribe();
  subscriptions.delete(relationId);
}

export function publishMessage(relationId: number, payload: OutgoingMessage): boolean {
  if (!client?.connected) return false;
  client.publish({
    destination: `/pub/chat/${relationId}`,
    body: JSON.stringify(payload),
  });
  return true;
}

export function disconnectSocket() {
  subscriptions.forEach((s) => s.unsubscribe());
  subscriptions.clear();
  client?.deactivate();
  client = null;
  connecting = null;
}
