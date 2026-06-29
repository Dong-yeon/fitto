package com.fitto.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 공통 응답 포맷 — 설계서 4.1.
 * { success, data, message, errorCode }
 */
@JsonInclude(JsonInclude.Include.ALWAYS)
public record ApiResponse<T>(boolean success, T data, String message, String errorCode) {

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null, null);
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    public static ApiResponse<Void> error(String message, String errorCode) {
        return new ApiResponse<>(false, null, message, errorCode);
    }
}
