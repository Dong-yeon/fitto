package com.fitto.diet.service;

import com.fitto.common.event.CoupleEvent;
import com.fitto.common.event.CoupleEventPublisher;
import com.fitto.common.exception.BusinessException;
import com.fitto.common.exception.ErrorCode;
import com.fitto.common.notification.NotificationService;
import com.fitto.diet.domain.Meal;
import com.fitto.diet.dto.MealResponse;
import com.fitto.diet.dto.MealStatsResponse;
import com.fitto.diet.dto.SaveMealRequest;
import com.fitto.diet.repository.MealRepository;
import com.fitto.relation.domain.Relation;
import com.fitto.relation.domain.RelationStatus;
import com.fitto.relation.domain.RelationType;
import com.fitto.relation.repository.RelationRepository;
import com.fitto.user.repository.UserRepository;
import com.fitto.workout.dto.CalendarDayResponse;
import com.fitto.workout.dto.PartnerTodayResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

/**
 * 식단 기록 서비스 — 저장·오늘 조회·히스토리·캘린더·통계·삭제, 커플 상대방 오늘 여부.
 * 운동(WorkoutService) 구조를 미러링한다.
 */
@Service
@Transactional(readOnly = true)
public class MealService {

    private static final int HISTORY_PAGE_SIZE = 20;

    private final MealRepository mealRepository;
    private final RelationRepository relationRepository;
    private final UserRepository userRepository;
    private final CoupleEventPublisher coupleEventPublisher;
    private final NotificationService notificationService;

    public MealService(MealRepository mealRepository,
                       RelationRepository relationRepository,
                       UserRepository userRepository,
                       CoupleEventPublisher coupleEventPublisher,
                       NotificationService notificationService) {
        this.mealRepository = mealRepository;
        this.relationRepository = relationRepository;
        this.userRepository = userRepository;
        this.coupleEventPublisher = coupleEventPublisher;
        this.notificationService = notificationService;
    }

    @Transactional
    public MealResponse save(Long userId, SaveMealRequest req) {
        if (req.mealDate().isAfter(LocalDate.now())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "미래 날짜는 기록할 수 없습니다.");
        }
        Meal meal = Meal.builder()
                .userId(userId)
                .mealDate(req.mealDate())
                .mealType(req.mealType())
                .memo(req.memo())
                .photoUrl(req.photoUrl())
                .calories(req.calories())
                .build();
        mealRepository.save(meal);

        // 커플 실시간 반영 + 응원 푸시
        relationRepository.findByUserAndTypeAndStatus(userId, RelationType.COUPLE, RelationStatus.ACTIVE)
                .stream().findFirst()
                .ifPresent(c -> {
                    coupleEventPublisher.publish(c.getId(), CoupleEvent.DIET);
                    Long partnerId = c.partnerOf(userId);
                    String myName = userRepository.findById(userId).map(u -> u.getName()).orElse("상대방");
                    notificationService.notify(partnerId, "오늘 뭐 먹었을까? 🍽️",
                            myName + "님이 식단을 기록했어요!");
                });

        return MealResponse.from(meal);
    }

    public List<MealResponse> findToday(Long userId) {
        return mealRepository.findByUserIdAndMealDateOrderByIdAsc(userId, LocalDate.now())
                .stream().map(MealResponse::from).toList();
    }

    public List<MealResponse> findHistory(Long userId, Long cursor) {
        return mealRepository.findHistory(userId, cursor, PageRequest.of(0, HISTORY_PAGE_SIZE))
                .stream().map(MealResponse::from).toList();
    }

    public List<CalendarDayResponse> calendar(Long userId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return mealRepository.findMealDates(userId, start, end).stream()
                .map(d -> new CalendarDayResponse(d, true))
                .toList();
    }

    public MealStatsResponse stats(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(DayOfWeek.MONDAY);
        LocalDate monthStart = today.withDayOfMonth(1);

        int weeklyDays = mealRepository.findMealDates(userId, weekStart, today).size();
        int monthlyDays = mealRepository.findMealDates(userId, monthStart, today).size();
        long totalDays = mealRepository.countDistinctMealDates(userId);

        // 최근 7일 끼니 완료 여부 + 일별 칼로리 합계
        LocalDate from7 = today.minusDays(6);
        Map<LocalDate, Integer> calByDate = new HashMap<>();
        var doneDates = new HashSet<LocalDate>();
        for (Meal m : mealRepository.findByUserIdAndMealDateBetween(userId, from7, today)) {
            doneDates.add(m.getMealDate());
            if (m.getCalories() != null) {
                calByDate.merge(m.getMealDate(), m.getCalories(), Integer::sum);
            }
        }
        String[] weekdays = {"월", "화", "수", "목", "금", "토", "일"};
        List<MealStatsResponse.DayStat> last7 = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate d = from7.plusDays(i);
            last7.add(new MealStatsResponse.DayStat(
                    d.toString(), weekdays[d.getDayOfWeek().getValue() - 1],
                    doneDates.contains(d), calByDate.getOrDefault(d, 0)));
        }

        return new MealStatsResponse(weeklyDays, monthlyDays, totalDays, last7);
    }

    @Transactional
    public void delete(Long userId, Long mealId) {
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
        if (!meal.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        mealRepository.delete(meal);
    }

    /** 커플 상대방의 오늘 식단 기록 여부 — 홈 커플 카드용. */
    public PartnerTodayResponse partnerToday(Long userId) {
        List<Relation> couples = relationRepository
                .findByUserAndTypeAndStatus(userId, RelationType.COUPLE, RelationStatus.ACTIVE);
        if (couples.isEmpty()) {
            return new PartnerTodayResponse(false, null, false);
        }
        Long partnerId = couples.get(0).partnerOf(userId);
        if (partnerId == null) {
            return new PartnerTodayResponse(false, null, false);
        }
        String partnerName = userRepository.findById(partnerId)
                .map(u -> u.getName()).orElse(null);
        boolean completed = mealRepository.existsByUserIdAndMealDate(partnerId, LocalDate.now());
        return new PartnerTodayResponse(true, partnerName, completed);
    }
}
