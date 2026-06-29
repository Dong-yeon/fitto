package com.fitto.common.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * 기본 알림 구현 — 발송 의도를 로그로 남긴다.
 * FCM 연동 시 이 구현을 FcmNotificationService 로 교체(또는 @Primary)한다.
 */
@Service
public class LoggingNotificationService implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(LoggingNotificationService.class);

    @Override
    public void notifyNewMessage(Long recipientUserId, String senderName, String preview) {
        log.info("[PUSH] to user={} from={} preview={}", recipientUserId, senderName, preview);
        // TODO(phase 4+): FCM/Expo 디바이스 토큰으로 실제 푸시 발송
    }
}
