package com.fitto.common.config;

import jakarta.annotation.PostConstruct;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * 운영 환경에서 안전하지 않은 JWT 시크릿 사용을 차단한다.
 * prod 프로파일에서 시크릿이 비어 있거나 dev 전용 값이면 부팅을 실패시킨다.
 */
@Component
public class JwtSecretGuard {

    private static final String DEV_MARKER = "dev-only";

    private final JwtProperties jwtProperties;
    private final Environment environment;

    public JwtSecretGuard(JwtProperties jwtProperties, Environment environment) {
        this.jwtProperties = jwtProperties;
        this.environment = environment;
    }

    @PostConstruct
    void validate() {
        boolean prod = Arrays.asList(environment.getActiveProfiles()).contains("prod");
        if (!prod) {
            return;
        }
        String secret = jwtProperties.getSecret();
        if (secret == null || secret.isBlank() || secret.contains(DEV_MARKER)) {
            throw new IllegalStateException(
                    "운영 환경에서는 JWT_SECRET 환경변수에 안전한 시크릿을 반드시 설정해야 합니다.");
        }
    }
}
