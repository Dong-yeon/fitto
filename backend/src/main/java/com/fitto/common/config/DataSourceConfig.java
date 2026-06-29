package com.fitto.common.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

/**
 * 클라우드(예: Railway)는 DATABASE_URL 을 URI 형식
 * (postgresql://user:pass@host:port/db)으로 주입한다. JDBC URL + 자격증명으로 변환해
 * DataSource 를 구성한다.
 *
 * DATABASE_URL 이 없으면(로컬 개발) 이 빈은 생성되지 않고, application.yml 의
 * spring.datasource.* (DB_HOST/PORT/...) 설정으로 기본 오토컨피그가 동작한다.
 */
@Configuration
@ConditionalOnProperty(name = "DATABASE_URL")
public class DataSourceConfig {

    @Bean
    public DataSource dataSource(Environment env) {
        String databaseUrl = env.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            throw new IllegalStateException("DATABASE_URL 이 비어 있습니다.");
        }

        URI uri = URI.create(databaseUrl);

        String username = null;
        String password = null;
        String userInfo = uri.getUserInfo();
        if (userInfo != null) {
            String[] credentials = userInfo.split(":", 2);
            username = credentials[0];
            password = credentials.length > 1 ? credentials[1] : "";
        }

        int port = uri.getPort() == -1 ? 5432 : uri.getPort();
        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                .append(uri.getHost())
                .append(':')
                .append(port)
                .append(uri.getPath());
        if (uri.getQuery() != null) {
            jdbcUrl.append('?').append(uri.getQuery());
        }

        return DataSourceBuilder.create()
                .type(HikariDataSource.class)
                .driverClassName("org.postgresql.Driver")
                .url(jdbcUrl.toString())
                .username(username)
                .password(password)
                .build();
    }
}
