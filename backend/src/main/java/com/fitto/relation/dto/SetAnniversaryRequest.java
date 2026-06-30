package com.fitto.relation.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** 커플 기념일 설정 요청 */
public record SetAnniversaryRequest(
        @NotNull(message = "기념일 날짜는 필수입니다.")
        LocalDate anniversaryDate
) {
}
