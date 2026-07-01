package com.fitto.notification.service;

import com.fitto.common.notification.NotificationService;
import com.fitto.notification.domain.DeviceToken;
import com.fitto.notification.repository.DeviceTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Expo Push 발송 구현 — 설계서 CHAT-06.
 * 수신자의 디바이스 토큰으로 Expo Push API 에 발송한다. 토큰이 없으면 아무 것도 하지 않는다.
 * (실제 발송은 네이티브 빌드에서 등록한 토큰이 있을 때 동작)
 */
@Service
public class ExpoPushNotificationService implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(ExpoPushNotificationService.class);
    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    private final DeviceTokenRepository deviceTokenRepository;
    private final RestClient restClient = RestClient.create();

    public ExpoPushNotificationService(DeviceTokenRepository deviceTokenRepository) {
        this.deviceTokenRepository = deviceTokenRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public void notify(Long recipientUserId, String title, String body) {
        if (recipientUserId == null) return;
        List<DeviceToken> tokens = deviceTokenRepository.findByUserId(recipientUserId);
        if (tokens.isEmpty()) return;

        List<Map<String, Object>> messages = tokens.stream()
                .map(t -> Map.<String, Object>of(
                        "to", t.getToken(),
                        "title", title,
                        "body", body,
                        "sound", "default"))
                .toList();
        try {
            restClient.post()
                    .uri(EXPO_PUSH_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(messages)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.warn("Expo push 발송 실패 recipient={}: {}", recipientUserId, e.getMessage());
        }
    }
}
