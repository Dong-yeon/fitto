package com.fitto.summary.dto;

/**
 * 레벨/성장 — 기록에서 파생 계산 (저장 안 함).
 * XP = 운동 기록일 × 10 + 식단 기록일 × 5,
 * level = floor(sqrt(XP/20)) + 1 (Lv2=20, Lv3=80, Lv4=180 …).
 */
public record LevelResponse(
        int level,
        long xp,
        long levelStartXp,
        long nextLevelXp,
        long workoutDays,
        long mealDays
) {
    private static final int XP_PER_WORKOUT_DAY = 10;
    private static final int XP_PER_MEAL_DAY = 5;
    private static final int XP_SCALE = 20;

    public static LevelResponse of(long workoutDays, long mealDays) {
        long xp = workoutDays * XP_PER_WORKOUT_DAY + mealDays * XP_PER_MEAL_DAY;
        int level = (int) Math.floor(Math.sqrt((double) xp / XP_SCALE)) + 1;
        long levelStartXp = (long) (level - 1) * (level - 1) * XP_SCALE;
        long nextLevelXp = (long) level * level * XP_SCALE;
        return new LevelResponse(level, xp, levelStartXp, nextLevelXp, workoutDays, mealDays);
    }
}
