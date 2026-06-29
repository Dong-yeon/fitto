package com.fitto.common.security;

import io.jsonwebtoken.Claims;
import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

/**
 * STOMP CONNECT 시 Authorization 헤더의 JWT 를 검증해 세션 Principal 을 설정한다.
 * 이후 @MessageMapping 에서 Principal 로 발신자를 식별한다.
 */
@Component
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";

    private final JwtTokenProvider tokenProvider;

    public StompAuthChannelInterceptor(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = resolveToken(accessor);
            if (token == null || !tokenProvider.isValidAccessToken(token)) {
                throw new IllegalArgumentException("유효하지 않은 인증 토큰입니다.");
            }
            Claims claims = tokenProvider.parse(token);
            AuthUser principal = tokenProvider.toAuthUser(claims);
            accessor.setUser(new StompPrincipal(principal.id(), principal.role().name()));
        }
        return message;
    }

    private String resolveToken(StompHeaderAccessor accessor) {
        String header = accessor.getFirstNativeHeader(HEADER);
        if (header != null && header.startsWith(PREFIX)) {
            return header.substring(PREFIX.length());
        }
        return null;
    }
}
