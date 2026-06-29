package com.fitto.streak.dto;

import com.fitto.streak.domain.Streak;
import com.fitto.streak.domain.StreakType;

import java.time.LocalDate;

/** 스트릭 응답 — 설계서 5.9 */
public record StreakResponse(
        StreakType streakType,
        int currentCount,
        int maxCount,
        LocalDate lastWorkoutDate
) {
    public static StreakResponse of(Streak streak, LocalDate today) {
        return new StreakResponse(
                streak.getStreakType(),
                streak.liveCount(today),
                streak.getMaxCount(),
                streak.getLastWorkoutDate());
    }

    public static StreakResponse empty(StreakType type) {
        return new StreakResponse(type, 0, 0, null);
    }
}
