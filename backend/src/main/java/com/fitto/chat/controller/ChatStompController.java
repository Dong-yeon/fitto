package com.fitto.chat.controller;

import com.fitto.chat.dto.ChatMessageResponse;
import com.fitto.chat.dto.SendMessageRequest;
import com.fitto.chat.service.ChatService;
import com.fitto.common.security.StompPrincipal;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * STOMP 메시지 처리 — 클라이언트가 /pub/chat/{relationId} 로 발행하면
 * 영속 후 /sub/rooms/{relationId} 구독자에게 브로드캐스트한다. (설계서 4.5)
 */
@Controller
public class ChatStompController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatStompController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{relationId}")
    public void send(@DestinationVariable Long relationId,
                     @Payload SendMessageRequest request,
                     Principal principal) {
        // 인증되지 않은 세션이면 무시 (CONNECT 단계에서 JWT 검증되지만 방어적 처리)
        if (!(principal instanceof StompPrincipal stompPrincipal)) {
            return;
        }
        ChatMessageResponse saved = chatService.send(stompPrincipal.userId(), relationId, request);
        messagingTemplate.convertAndSend("/sub/rooms/" + relationId, saved);
    }
}
