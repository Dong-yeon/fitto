package com.fitto.workout.dto;

import java.time.LocalDate;

/** 캘린더 — 운동 완료한 날짜 — 설계서 4.4 GET /workout/calendar */
public record CalendarDayResponse(LocalDate date, boolean completed) {
}
