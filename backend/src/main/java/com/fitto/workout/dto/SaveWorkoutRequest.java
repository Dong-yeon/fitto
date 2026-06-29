package com.fitto.workout.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

/** 운동 기록 저장 요청 — 설계서 4.4 POST /workout */
public record SaveWorkoutRequest(
        @NotNull(message = "운동 날짜는 필수입니다.")
        LocalDate workoutDate,

        /** 트레이너 루틴 기반 기록 시 관계 ID (일반 기록은 생략) */
        Long relationId,

        Integer totalDurationMin,

        String memo,

        @Valid
        @NotEmpty(message = "운동 세트를 1개 이상 입력해주세요.")
        List<WorkoutSetRequest> sets
) {
}
