-- 식단 스트릭: 커플 스트릭을 활동별(운동/식단)로 나눌 수 있도록
-- relation_id 단독 유니크를 (relation_id, streak_type) 유니크로 완화
ALTER TABLE streaks DROP CONSTRAINT uq_streaks_relation;
ALTER TABLE streaks ADD CONSTRAINT uq_streaks_relation_type UNIQUE (relation_id, streak_type);

-- 커플 공동 식단 목표 — 이번 주 둘 다 기록할 목표 일수 (1~7, NULL = 미설정)
ALTER TABLE relations ADD COLUMN diet_goal_days INT;
