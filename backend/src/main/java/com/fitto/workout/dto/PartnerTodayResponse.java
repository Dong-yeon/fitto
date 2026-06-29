package com.fitto.workout.dto;

/** 커플 상대방 오늘 운동 여부 — 설계서 2.3 / WORKOUT-05 */
public record PartnerTodayResponse(boolean connected, String partnerName, boolean completed) {
}
