package com.fitto.common.notification;

/**
 * 푸시 알림 서비스 — 설계서 6.1 (Firebase FCM).
 * 실제 FCM/Expo 발송 구현체는 서비스 계정 + 디바이스 토큰 등록이 필요하므로 추후 연동.
 */
public interface NotificationService {

    /** 새 채팅 메시지 알림 — 설계서 CHAT-06. */
    void notifyNewMessage(Long recipientUserId, String senderName, String preview);
}
