package com.fitto.diet.domain;

/** 끼니 유형 — 설계서 식단(DIET). */
public enum MealType {
    BREAKFAST("아침"),
    LUNCH("점심"),
    DINNER("저녁"),
    SNACK("간식");

    private final String label;

    MealType(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
