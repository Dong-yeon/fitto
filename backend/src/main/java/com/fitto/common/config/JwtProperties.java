package com.fitto.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT 설정 바인딩 — application.yml 의 fitto.jwt.*
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "fitto.jwt")
public class JwtProperties {

    /** HS256 서명 키 (최소 32바이트) */
    private String secret;

    private long accessTokenExpireMinutes = 30;

    private long refreshTokenExpireDays = 14;
}
