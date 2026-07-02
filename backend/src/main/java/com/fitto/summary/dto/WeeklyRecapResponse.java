package com.fitto.summary.dto;

import java.time.LocalDate;

/** 주간 결산 — 지난주(월~일) 운동/식단 기록일 요약. 커플이면 상대방/함께 일수 포함. */
public record WeeklyRecapResponse(
        LocalDate weekStart,
        LocalDate weekEnd,
        int myWorkoutDays,
        int myMealDays,
        boolean coupleConnected,
        String partnerName,
        int partnerWorkoutDays,
        int partnerMealDays,
        int bothWorkoutDays,
        int bothMealDays
) {
}
