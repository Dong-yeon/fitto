-- 스트릭 중복 행 방지 (동시 저장/재시도 시 NonUniqueResultException 예방)
-- 개인: (user_id, streak_type) 유일 / 커플: relation_id 유일 (NULL 은 다중 허용)
ALTER TABLE streaks ADD CONSTRAINT uq_streaks_user_type UNIQUE (user_id, streak_type);
ALTER TABLE streaks ADD CONSTRAINT uq_streaks_relation UNIQUE (relation_id);
