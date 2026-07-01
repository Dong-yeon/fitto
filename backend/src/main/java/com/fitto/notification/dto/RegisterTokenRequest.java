package com.fitto.notification.dto;

import jakarta.validation.constraints.NotBlank;

/** 디바이스 푸시 토큰 등록 요청 */
public record RegisterTokenRequest(
        @NotBlank(message = "토큰은 필수입니다.")
        String token,
        String platform
) {
}
