package com.fitto.diet.dto;

import java.util.List;

/** 식단 통계 — 주간/월간/누적 기록일 + 최근 7일(끼니 완료·칼로리) */
public record MealStatsResponse(
        int weeklyDays,
        int monthlyDays,
        long totalDays,
        List<DayStat> last7Days
) {
    public record DayStat(String date, String weekday, boolean completed, int calories) {
    }
}
