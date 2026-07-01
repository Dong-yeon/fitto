package com.fitto.streak.repository;

import com.fitto.streak.domain.Streak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StreakRepository extends JpaRepository<Streak, Long> {

    Optional<Streak> findByUserIdAndStreakType(Long userId, com.fitto.streak.domain.StreakType type);

    Optional<Streak> findByRelationIdAndStreakType(Long relationId, com.fitto.streak.domain.StreakType type);

    @Modifying
    @Query("delete from Streak s where s.userId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("""
            delete from Streak s where s.relationId in
              (select r.id from Relation r where r.userAId = :userId or r.userBId = :userId)
            """)
    void deleteAllByUserRelations(@Param("userId") Long userId);
}
