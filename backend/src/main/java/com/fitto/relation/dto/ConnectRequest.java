package com.fitto.relation.dto;

import jakarta.validation.constraints.NotBlank;

/** 초대코드 연결 요청 — 설계서 4.3 POST /relations/couple/connect */
public record ConnectRequest(
        @NotBlank(message = "초대코드를 입력해주세요.")
        String code
) {
}
