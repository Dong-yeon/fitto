package com.fitto.common.notification;

/**
 * 푸시 알림 서비스 — 설계서 6.1 (Expo Push / FCM).
 */
public interface NotificationService {

    /** 특정 사용자에게 푸시 알림 발송 (등록된 디바이스 토큰 전체). */
    void notify(Long recipientUserId, String title, String body);
}
