package com.fitto.auth.dto;

/** 인증 토큰 응답 — 설계서 4.2 / 4.4 AUTH-05 */
public record TokenResponse(
        String accessToken,
        String refreshToken,
        UserResponse user
) {
}
