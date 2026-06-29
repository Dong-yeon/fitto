package com.fitto.streak.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 스트릭 — 설계서 5.9 streaks. updated_at 만 존재(created_at 없음).
 * 개인(user_id) 또는 커플(relation_id) 중 하나로 식별.
 */
@Entity
@Table(name = "streaks", uniqueConstraints = {
        @UniqueConstraint(name = "uq_streaks_user_type", columnNames = {"user_id", "streak_type"}),
        @UniqueConstraint(name = "uq_streaks_relation", columnNames = {"relation_id"})
})
@Getter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Streak {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "relation_id")
    private Long relationId;

    @Enumerated(EnumType.STRING)
    @Column(name = "streak_type", nullable = false, length = 20)
    private StreakType streakType;

    @Column(name = "current_count", nullable = false)
    private int currentCount;

    @Column(name = "max_count", nullable = false)
    private int maxCount;

    @Column(name = "last_workout_date")
    private LocalDate lastWorkoutDate;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    private Streak(Long userId, Long relationId, StreakType streakType) {
        this.userId = userId;
        this.relationId = relationId;
        this.streakType = streakType;
        this.currentCount = 0;
        this.maxCount = 0;
    }

    public static Streak personal(Long userId) {
        return Streak.builder().userId(userId).streakType(StreakType.PERSONAL).build();
    }

    public static Streak couple(Long relationId) {
        return Streak.builder().relationId(relationId).streakType(StreakType.COUPLE).build();
    }

    /**
     * 해당 날짜의 운동을 반영. 전날에 이어지면 +1, 끊겼으면 1로 리셋.
     * 이미 반영된 날짜이거나 과거 날짜면 변화 없음.
     */
    public void applyWorkout(LocalDate date) {
        if (lastWorkoutDate != null && !date.isAfter(lastWorkoutDate)) {
            return; // 이미 카운트했거나 과거 날짜
        }
        if (lastWorkoutDate != null && date.equals(lastWorkoutDate.plusDays(1))) {
            currentCount += 1;
        } else {
            currentCount = 1;
        }
        lastWorkoutDate = date;
        if (currentCount > maxCount) {
            maxCount = currentCount;
        }
    }

    /** 기준일(today) 시점의 살아있는 연속 일수. 마지막 운동이 어제/오늘이 아니면 끊긴 것(0). */
    public int liveCount(LocalDate today) {
        if (lastWorkoutDate == null) return 0;
        if (lastWorkoutDate.equals(today) || lastWorkoutDate.equals(today.minusDays(1))) {
            return currentCount;
        }
        return 0;
    }
}
