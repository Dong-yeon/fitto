package com.fitto.diet.dto;

import com.fitto.diet.domain.Meal;
import com.fitto.diet.domain.MealType;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** 식단 기록 응답 */
public record MealResponse(
        Long id,
        LocalDate mealDate,
        MealType mealType,
        String mealTypeLabel,
        String memo,
        String photoUrl,
        Integer calories,
        LocalDateTime createdAt
) {
    public static MealResponse from(Meal m) {
        return new MealResponse(
                m.getId(), m.getMealDate(), m.getMealType(), m.getMealType().label(),
                m.getMemo(), m.getPhotoUrl(), m.getCalories(), m.getCreatedAt());
    }
}
