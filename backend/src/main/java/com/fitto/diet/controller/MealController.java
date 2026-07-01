package com.fitto.diet.controller;

import com.fitto.common.response.ApiResponse;
import com.fitto.common.security.AuthUser;
import com.fitto.diet.dto.MealResponse;
import com.fitto.diet.dto.MealStatsResponse;
import com.fitto.diet.dto.SaveMealRequest;
import com.fitto.diet.service.MealService;
import com.fitto.workout.dto.CalendarDayResponse;
import com.fitto.workout.dto.PartnerTodayResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 식단 기록 API — 운동(WorkoutController) 구조를 미러링.
 */
@RestController
@RequestMapping("/api/v1/meal")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @PostMapping
    public ApiResponse<MealResponse> save(@AuthenticationPrincipal AuthUser user,
                                          @Valid @RequestBody SaveMealRequest request) {
        return ApiResponse.success(mealService.save(user.id(), request), "식단이 기록되었습니다.");
    }

    @GetMapping("/today")
    public ApiResponse<List<MealResponse>> today(@AuthenticationPrincipal AuthUser user) {
        return ApiResponse.success(mealService.findToday(user.id()));
    }

    @GetMapping("/history")
    public ApiResponse<List<MealResponse>> history(@AuthenticationPrincipal AuthUser user,
                                                   @RequestParam(required = false) Long cursor) {
        return ApiResponse.success(mealService.findHistory(user.id(), cursor));
    }

    @GetMapping("/calendar")
    public ApiResponse<List<CalendarDayResponse>> calendar(@AuthenticationPrincipal AuthUser user,
                                                           @RequestParam int year,
                                                           @RequestParam int month) {
        return ApiResponse.success(mealService.calendar(user.id(), year, month));
    }

    @GetMapping("/stats")
    public ApiResponse<MealStatsResponse> stats(@AuthenticationPrincipal AuthUser user) {
        return ApiResponse.success(mealService.stats(user.id()));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal AuthUser user, @PathVariable Long id) {
        mealService.delete(user.id(), id);
        return ApiResponse.success(null, "식단 기록이 삭제되었습니다.");
    }

    @GetMapping("/partner/today")
    public ApiResponse<PartnerTodayResponse> partnerToday(@AuthenticationPrincipal AuthUser user) {
        return ApiResponse.success(mealService.partnerToday(user.id()));
    }
}
