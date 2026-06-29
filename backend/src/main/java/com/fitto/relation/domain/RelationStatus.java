package com.fitto.relation.domain;

/** 관계 상태 — 설계서 5.3 relations.status */
public enum RelationStatus {
    PENDING,   // 초대코드 생성, 연결 대기
    ACTIVE,    // 연결 완료
    ENDED      // 해제/종료
}
