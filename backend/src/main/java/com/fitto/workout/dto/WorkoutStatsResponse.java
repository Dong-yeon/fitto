package com.fitto.workout.dto;

import java.util.List;

/** 운동 통계 — 설계서 WORKOUT-07 */
public record WorkoutStatsResponse(
        int weeklyDays,   // 이번 주 운동한 날 수
        int monthlyDays,  // 이번 달 운동한 날 수
        long totalDays,   // 전체 운동한 날 수
        List<DayStat> last7Days,           // 최근 7일 완료 여부 (그래프)
        List<CategoryStat> categoryBreakdown // 최근 30일 부위별 세트 수
) {
    public record DayStat(String date, String weekday, boolean completed) {}

    public record CategoryStat(String category, long count) {}
}
