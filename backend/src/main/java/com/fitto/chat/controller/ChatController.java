package com.fitto.chat.controller;

import com.fitto.chat.dto.ChatMessageResponse;
import com.fitto.chat.dto.ChatRoomResponse;
import com.fitto.chat.service.ChatService;
import com.fitto.common.response.ApiResponse;
import com.fitto.common.security.AuthUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 채팅 REST API — 설계서 4.5. 메시지 목록/읽음. (이미지 업로드는 S3 연동 후 추가)
 */
@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/rooms")
    public ApiResponse<List<ChatRoomResponse>> rooms(@AuthenticationPrincipal AuthUser user) {
        return ApiResponse.success(chatService.getRooms(user.id()));
    }

    @GetMapping("/rooms/{relationId}/messages")
    public ApiResponse<List<ChatMessageResponse>> messages(@AuthenticationPrincipal AuthUser user,
                                                           @PathVariable Long relationId,
                                                           @RequestParam(required = false) Long cursor) {
        return ApiResponse.success(chatService.getMessages(user.id(), relationId, cursor));
    }

    @PutMapping("/read/{messageId}")
    public ApiResponse<Void> read(@AuthenticationPrincipal AuthUser user,
                                  @PathVariable Long messageId) {
        chatService.markRead(user.id(), messageId);
        return ApiResponse.success(null);
    }
}
