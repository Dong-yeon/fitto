package com.fitto.chat.dto;

import com.fitto.chat.domain.MessageType;

/**
 * STOMP 로 수신하는 메시지 전송 페이로드.
 * 텍스트: content / 운동 카드: messageType=WORKOUT_CARD + workoutId.
 */
public record SendMessageRequest(
        MessageType messageType,
        String content,
        String imageUrl,
        Long workoutId,
        Long routineId
) {
}
