package com.fitto;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * 스프링 컨텍스트 로드 검증 — 스캐폴딩이 정상 구동되는지 확인.
 */
@SpringBootTest
@ActiveProfiles("test")
class FittoApplicationTests {

    @Test
    void contextLoads() {
    }
}
