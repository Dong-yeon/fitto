package com.fitto.relation.service;

import com.fitto.common.exception.BusinessException;
import com.fitto.common.exception.ErrorCode;
import com.fitto.relation.domain.Relation;
import com.fitto.relation.domain.RelationStatus;
import com.fitto.relation.domain.RelationType;
import com.fitto.relation.dto.InviteCodeResponse;
import com.fitto.relation.dto.RelationResponse;
import com.fitto.relation.repository.RelationRepository;
import com.fitto.user.domain.User;
import com.fitto.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 관계 서비스 — 설계서 3.2 / 4.3.
 * 커플 초대코드 생성·연결, 관계 조회/해제. (트레이너 관계는 phase 6~7)
 */
@Service
@Transactional(readOnly = true)
public class RelationService {

    private static final String CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 혼동 문자(I,O,0,1) 제외
    private static final int CODE_LENGTH = 6;
    private static final long CODE_TTL_HOURS = 24;

    private final SecureRandom random = new SecureRandom();
    private final RelationRepository relationRepository;
    private final UserRepository userRepository;

    public RelationService(RelationRepository relationRepository, UserRepository userRepository) {
        this.relationRepository = relationRepository;
        this.userRepository = userRepository;
    }

    /** 커플 초대코드 생성 — 6자리, 24시간 유효 (REL-01). */
    @Transactional
    public InviteCodeResponse createCoupleInvite(Long userId) {
        if (hasActiveCouple(userId)) {
            throw new BusinessException(ErrorCode.ALREADY_CONNECTED);
        }
        Relation relation = Relation.builder()
                .relationType(RelationType.COUPLE)
                .userAId(userId)
                .status(RelationStatus.PENDING)
                .inviteCode(generateUniqueCode())
                .codeExpiresAt(LocalDateTime.now().plusHours(CODE_TTL_HOURS))
                .build();
        relationRepository.save(relation);
        return new InviteCodeResponse(relation.getInviteCode(), relation.getCodeExpiresAt());
    }

    /** 초대코드로 커플 연결 (REL-02). */
    @Transactional
    public RelationResponse connectCouple(Long userId, String code) {
        Relation relation = relationRepository.findByInviteCode(code.trim().toUpperCase())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVITE_CODE_INVALID));

        if (relation.getRelationType() != RelationType.COUPLE
                || relation.getStatus() != RelationStatus.PENDING) {
            throw new BusinessException(ErrorCode.INVITE_CODE_INVALID);
        }
        if (relation.isExpired()) {
            throw new BusinessException(ErrorCode.INVITE_CODE_EXPIRED);
        }
        if (relation.getUserAId().equals(userId)) {
            throw new BusinessException(ErrorCode.INVITE_CODE_INVALID, "본인이 생성한 코드로는 연결할 수 없습니다.");
        }
        if (hasActiveCouple(userId)) {
            throw new BusinessException(ErrorCode.ALREADY_CONNECTED);
        }

        relation.connect(userId);
        User partner = userRepository.findById(relation.getUserAId()).orElse(null);
        return RelationResponse.of(relation, partner);
    }

    /** 내 관계 목록 전체 (REL-05). */
    public List<RelationResponse> findMyRelations(Long userId) {
        return relationRepository.findAllByUser(userId).stream()
                .map(r -> toResponse(r, userId))
                .toList();
    }

    public RelationResponse findRelation(Long userId, Long relationId) {
        Relation relation = getOwnedRelation(userId, relationId);
        return toResponse(relation, userId);
    }

    /** 관계 해제 (REL-06). */
    @Transactional
    public void endRelation(Long userId, Long relationId) {
        Relation relation = getOwnedRelation(userId, relationId);
        relation.end();
    }

    // ---- helpers ----

    private boolean hasActiveCouple(Long userId) {
        return !relationRepository
                .findByUserAndTypeAndStatus(userId, RelationType.COUPLE, RelationStatus.ACTIVE)
                .isEmpty();
    }

    private Relation getOwnedRelation(Long userId, Long relationId) {
        Relation relation = relationRepository.findById(relationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RELATION_NOT_FOUND));
        if (!relation.involves(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return relation;
    }

    private RelationResponse toResponse(Relation relation, Long viewerId) {
        Long partnerId = relation.partnerOf(viewerId);
        User partner = partnerId != null ? userRepository.findById(partnerId).orElse(null) : null;
        return RelationResponse.of(relation, partner);
    }

    private String generateUniqueCode() {
        for (int attempt = 0; attempt < 10; attempt++) {
            StringBuilder sb = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(CODE_ALPHABET.charAt(random.nextInt(CODE_ALPHABET.length())));
            }
            String code = sb.toString();
            if (!relationRepository.existsByInviteCode(code)) {
                return code;
            }
        }
        throw new BusinessException(ErrorCode.INTERNAL_ERROR, "초대코드 생성에 실패했습니다. 다시 시도해주세요.");
    }
}
