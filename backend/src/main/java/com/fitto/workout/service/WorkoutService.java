package com.fitto.workout.service;

import com.fitto.common.exception.BusinessException;
import com.fitto.common.exception.ErrorCode;
import com.fitto.relation.domain.Relation;
import com.fitto.relation.domain.RelationStatus;
import com.fitto.relation.domain.RelationType;
import com.fitto.relation.repository.RelationRepository;
import com.fitto.user.repository.UserRepository;
import com.fitto.workout.domain.Workout;
import com.fitto.workout.domain.WorkoutSet;
import com.fitto.workout.dto.CalendarDayResponse;
import com.fitto.workout.dto.PartnerTodayResponse;
import com.fitto.workout.dto.SaveWorkoutRequest;
import com.fitto.workout.dto.WorkoutResponse;
import com.fitto.workout.repository.WorkoutRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 운동 기록 서비스 — 설계서 3.3 / 4.4.
 * 저장·오늘 조회·히스토리·캘린더·삭제, 커플 상대방 오늘 여부.
 */
@Service
@Transactional(readOnly = true)
public class WorkoutService {

    private static final int HISTORY_PAGE_SIZE = 20;

    private final WorkoutRepository workoutRepository;
    private final RelationRepository relationRepository;
    private final UserRepository userRepository;

    public WorkoutService(WorkoutRepository workoutRepository,
                          RelationRepository relationRepository,
                          UserRepository userRepository) {
        this.workoutRepository = workoutRepository;
        this.relationRepository = relationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public WorkoutResponse save(Long userId, SaveWorkoutRequest req) {
        Workout workout = Workout.builder()
                .userId(userId)
                .relationId(req.relationId())
                .workoutDate(req.workoutDate())
                .totalDurationMin(req.totalDurationMin())
                .memo(req.memo())
                .build();

        int order = 1;
        for (var s : req.sets()) {
            workout.addSet(WorkoutSet.builder()
                    .exerciseName(s.exerciseName())
                    .category(s.category())
                    .sets(s.sets())
                    .reps(s.reps())
                    .weightKg(s.weightKg())
                    .orderNo(s.orderNo() != null ? s.orderNo() : order)
                    .build());
            order++;
        }
        workoutRepository.save(workout);
        return WorkoutResponse.from(workout);
    }

    public List<WorkoutResponse> findToday(Long userId) {
        return workoutRepository
                .findByUserIdAndWorkoutDateOrderByIdDesc(userId, LocalDate.now())
                .stream().map(WorkoutResponse::from).toList();
    }

    public List<WorkoutResponse> findHistory(Long userId, Long cursor) {
        return workoutRepository
                .findHistory(userId, cursor, PageRequest.of(0, HISTORY_PAGE_SIZE))
                .stream().map(WorkoutResponse::from).toList();
    }

    public List<CalendarDayResponse> calendar(Long userId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return workoutRepository.findWorkoutDates(userId, start, end).stream()
                .map(d -> new CalendarDayResponse(d, true))
                .toList();
    }

    @Transactional
    public void delete(Long userId, Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKOUT_NOT_FOUND));
        if (!workout.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        workoutRepository.delete(workout);
    }

    /** 커플 상대방의 오늘 운동 여부 — 홈 커플 카드용. */
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
        boolean completed = workoutRepository.existsByUserIdAndWorkoutDate(partnerId, LocalDate.now());
        return new PartnerTodayResponse(true, partnerName, completed);
    }
}
