package com.fitto.diet.dto;

import java.time.LocalDate;

/**
 * 커플 공동 식단 목표 진행률 — GET /meal/couple/goal.
 * 이번 주(월~일) 기준, 둘 다 기록한 날(bothDays)이 goalDays 이상이면 달성.
 */
public record CoupleMealGoalResponse(
        boolean connected,
        Integer goalDays,
        LocalDate weekStart,
        int myDays,
        int partnerDays,
        int bothDays,
        boolean achieved
) {
    public static CoupleMealGoalResponse notConnected() {
        return new CoupleMealGoalResponse(false, null, null, 0, 0, 0, false);
    }
}
