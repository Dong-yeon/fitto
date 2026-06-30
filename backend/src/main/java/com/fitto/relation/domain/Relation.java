package com.fitto.relation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 관계 — 설계서 5.3 relations. 커플(COUPLE) / 트레이너-회원(TRAINER_MEMBER) 공통 구조.
 * relations 테이블에는 created_at 만 존재하므로 BaseTimeEntity 를 상속하지 않는다.
 */
@Entity
@Table(name = "relations")
@Getter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Relation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "relation_type", nullable = false, length = 30)
    private RelationType relationType;

    /** 요청자 (커플 먼저 초대 / 트레이너) */
    @Column(name = "user_a_id", nullable = false)
    private Long userAId;

    /** 수락자 (커플 / 회원) — 연결 전 NULL */
    @Column(name = "user_b_id")
    private Long userBId;

    @Column(name = "invite_code", length = 10, unique = true)
    private String inviteCode;

    @Column(name = "code_expires_at")
    private LocalDateTime codeExpiresAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RelationStatus status;

    @Column(name = "connected_at")
    private LocalDateTime connectedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    /** 커플 공유 배경 이미지 URL (홈 메인) */
    @Column(name = "background_image_url", length = 500)
    private String backgroundImageUrl;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    private Relation(RelationType relationType, Long userAId, Long userBId,
                     String inviteCode, LocalDateTime codeExpiresAt, RelationStatus status) {
        this.relationType = relationType;
        this.userAId = userAId;
        this.userBId = userBId;
        this.inviteCode = inviteCode;
        this.codeExpiresAt = codeExpiresAt;
        this.status = status != null ? status : RelationStatus.PENDING;
    }

    /** 초대코드로 상대방이 연결. 코드는 비우고 ACTIVE 로 전환. */
    public void connect(Long userBId) {
        this.userBId = userBId;
        this.status = RelationStatus.ACTIVE;
        this.connectedAt = LocalDateTime.now();
        this.inviteCode = null;
        this.codeExpiresAt = null;
    }

    public void end() {
        this.status = RelationStatus.ENDED;
        this.endedAt = LocalDateTime.now();
    }

    public void updateBackground(String url) {
        this.backgroundImageUrl = url;
    }

    public boolean isExpired() {
        return codeExpiresAt != null && codeExpiresAt.isBefore(LocalDateTime.now());
    }

    public boolean involves(Long userId) {
        return userId.equals(userAId) || userId.equals(userBId);
    }

    /** 주어진 사용자 기준 상대방 ID (없으면 null) */
    public Long partnerOf(Long userId) {
        if (userId.equals(userAId)) return userBId;
        if (userId.equals(userBId)) return userAId;
        return null;
    }
}
