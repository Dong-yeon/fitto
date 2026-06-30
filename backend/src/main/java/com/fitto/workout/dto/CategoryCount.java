package com.fitto.workout.dto;

/** 부위(카테고리)별 세트 수 — JPQL 인터페이스 프로젝션 */
public interface CategoryCount {
    String getCategory();

    long getCount();
}
