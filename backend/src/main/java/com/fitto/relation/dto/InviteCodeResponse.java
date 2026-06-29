package com.fitto.relation.dto;

import java.time.LocalDateTime;

/** 초대코드 응답 — 설계서 3.2 REL-01 (6자리, 24시간 유효) */
public record InviteCodeResponse(String code, LocalDateTime expiresAt) {
}
