package com.fitto.user.domain;

/**
 * 사용자 역할 — 설계서 1.3 / 6.2 RBAC.
 * TRAINER 는 USER 권한을 포함한다(트레이너도 커플 연결 가능).
 */
public enum Role {
    USER,
    TRAINER,
    ADMIN
}
