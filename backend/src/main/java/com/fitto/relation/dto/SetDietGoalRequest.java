package com.fitto.relation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** 커플 공동 식단 목표 설정 요청 — 주간 목표 일수 (1~7) */
public record SetDietGoalRequest(
        @NotNull(message = "목표 일수는 필수입니다.")
        @Min(value = 1, message = "목표는 주 1일 이상이어야 합니다.")
        @Max(value = 7, message = "목표는 주 7일 이하여야 합니다.")
        Integer dietGoalDays
) {
}
