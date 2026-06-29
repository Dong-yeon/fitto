package com.fitto.chat.dto;

import com.fitto.auth.dto.UserResponse;
import com.fitto.relation.domain.RelationType;

/** 채팅방 목록 항목 — 설계서 4.5 GET /chat/rooms */
public record ChatRoomResponse(
        Long relationId,
        RelationType relationType,
        UserResponse partner,
        ChatMessageResponse lastMessage,
        long unreadCount
) {
}
