package com.fitto.notification.service;

import com.fitto.notification.domain.DeviceToken;
import com.fitto.notification.repository.DeviceTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 디바이스 토큰 등록 관리 */
@Service
public class DeviceTokenService {

    private final DeviceTokenRepository deviceTokenRepository;

    public DeviceTokenService(DeviceTokenRepository deviceTokenRepository) {
        this.deviceTokenRepository = deviceTokenRepository;
    }

    /** 토큰 등록 — 동일 토큰이 있으면 현재 사용자로 재할당. */
    @Transactional
    public void register(Long userId, String token, String platform) {
        deviceTokenRepository.deleteByToken(token);
        deviceTokenRepository.save(DeviceToken.builder()
                .userId(userId)
                .token(token)
                .platform(platform)
                .build());
    }
}
