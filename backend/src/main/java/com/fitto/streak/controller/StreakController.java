package com.fitto.streak.controller;

import com.fitto.common.response.ApiResponse;
import com.fitto.common.security.AuthUser;
import com.fitto.streak.dto.StreakResponse;
import com.fitto.streak.service.StreakService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 스트릭 API — 설계서 3.5 (GET /streak/me, /streak/couple).
 */
@RestController
@RequestMapping("/api/v1/streak")
public class StreakController {

    private final StreakService streakService;

    public StreakController(StreakService streakService) {
        this.streakService = streakService;
    }

    @GetMapping("/me")
    public ApiResponse<StreakResponse> me(@AuthenticationPrincipal AuthUser user) {
        return ApiResponse.success(streakService.getMyStreak(user.id()));
    }

    @GetMapping("/couple")
    public ApiResponse<StreakResponse> couple(@AuthenticationPrincipal AuthUser user) {
        return ApiResponse.success(streakService.getCoupleStreak(user.id()));
    }
}
