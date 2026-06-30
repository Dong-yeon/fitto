package com.fitto.auth.dto;

import jakarta.validation.constraints.Size;

/** 프로필 수정 요청 — 이름 / 프로필 사진 URL (제공된 값만 반영) */
public record UpdateProfileRequest(
        @Size(max = 50)
        String name,

        @Size(max = 500)
        String profileImageUrl
) {
}
