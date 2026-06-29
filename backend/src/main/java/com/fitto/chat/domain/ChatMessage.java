package com.fitto.chat.domain;

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
 * 채팅 메시지 — 설계서 5.8 chat_messages. created_at 만 존재.
 */
@Entity
@Table(name = "chat_messages")
@Getter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "relation_id", nullable = false)
    private Long relationId;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false, length = 20)
    private MessageType messageType;

    @Column(columnDefinition = "text")
    private String content;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "workout_id")
    private Long workoutId;

    @Column(name = "routine_id")
    private Long routineId;

    @Column(name = "is_read", nullable = false)
    private boolean isRead;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    private ChatMessage(Long relationId, Long senderId, MessageType messageType,
                        String content, String imageUrl, Long workoutId, Long routineId) {
        this.relationId = relationId;
        this.senderId = senderId;
        this.messageType = messageType != null ? messageType : MessageType.TEXT;
        this.content = content;
        this.imageUrl = imageUrl;
        this.workoutId = workoutId;
        this.routineId = routineId;
        this.isRead = false;
    }

    public void markRead() {
        this.isRead = true;
    }
}
