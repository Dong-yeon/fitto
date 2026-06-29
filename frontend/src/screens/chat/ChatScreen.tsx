/** 채팅 — 설계서 v2.0 2.2 / 4.5 (관계별 채팅방: 커플 + 트레이너-회원) */
import React from 'react';
import { ScreenPlaceholder } from '../../components/ScreenPlaceholder';

export function ChatScreen() {
  return (
    <ScreenPlaceholder
      emoji="💬"
      title="채팅"
      description="관계별 채팅방 목록 · STOMP 실시간 메시지 (phase 4)"
    />
  );
}
