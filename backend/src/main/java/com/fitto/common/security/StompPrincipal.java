package com.fitto.common.security;

import java.security.Principal;

/**
 * STOMP 세션 Principal — name 에 userId 를 담는다.
 */
public record StompPrincipal(Long userId, String role) implements Principal {

    @Override
    public String getName() {
        return String.valueOf(userId);
    }
}
