package com.fitto.relation.dto;

import jakarta.validation.constraints.Size;

/** 커플 배경 설정 요청 (null 이면 배경 해제) */
public record SetBackgroundRequest(
        @Size(max = 500)
        String backgroundImageUrl
) {
}
