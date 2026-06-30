package com.fitto.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** 프로필 수정 요청 — 이름 (사진/목표는 추후) */
public record UpdateProfileRequest(
        @NotBlank(message = "이름은 필수입니다.")
        @Size(max = 50)
        String name
) {
}
