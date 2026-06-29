package com.fitto.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** 이메일 로그인 요청 — 설계서 4.2 POST /auth/login */
public record LoginRequest(
        @Email @NotBlank String email,
        @NotBlank String password
) {
}
