package com.fitto.chat.dto;

import com.fitto.chat.domain.ChatMessage;
import com.fitto.chat.domain.MessageType;

import java.time.LocalDateTime;

/** 채팅 메시지 응답 — 설계서 5.8 */
public record ChatMessageResponse(
        Long id,
        Long relationId,
        Long senderId,
        MessageType messageType,
        String content,
        String imageUrl,
        Long workoutId,
        Long routineId,
        boolean isRead,
        LocalDateTime createdAt
) {
    public static ChatMessageResponse from(ChatMessage m) {
        return new ChatMessageResponse(m.getId(), m.getRelationId(), m.getSenderId(),
                m.getMessageType(), m.getContent(), m.getImageUrl(), m.getWorkoutId(),
                m.getRoutineId(), m.isRead(), m.getCreatedAt());
    }
}
