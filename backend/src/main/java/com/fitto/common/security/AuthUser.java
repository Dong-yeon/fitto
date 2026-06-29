package com.fitto.common.security;

import com.fitto.user.domain.Role;

/**
 * SecurityContext 에 담기는 인증 주체. 컨트롤러에서 @AuthenticationPrincipal 로 주입받는다.
 */
public record AuthUser(Long id, Role role) {
}
