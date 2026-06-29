package com.fitto.workout.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

/** 운동 세트 입력 — 설계서 5.6 / WORKOUT-01 */
public record WorkoutSetRequest(
        @NotBlank(message = "운동명은 필수입니다.")
        String exerciseName,
        String category,
        Integer sets,
        Integer reps,
        BigDecimal weightKg,
        Integer orderNo
) {
}
