# Railway 배포 가이드 (백엔드)

Railway에 **PostgreSQL**, **Redis** 플러그인을 이미 추가한 상태를 가정합니다.
백엔드는 `DATABASE_URL`(URI)을 JDBC로 변환해 연결하고, Redis는 `SPRING_DATA_REDIS_URL`로 연결합니다.

> 코드: `DATABASE_URL` 이 있으면 `DataSourceConfig` 가 이를 파싱해 DataSource 를 구성하고,
> 없으면(로컬) `application.yml` 의 `spring.datasource.*`(DB_HOST 등) 기본값으로 동작합니다.
> 두 경로 모두 실제 PostgreSQL 16 부팅 + Flyway 마이그레이션으로 검증되었습니다.

## 1. 백엔드 서비스 생성

1. Railway 프로젝트 → **New → GitHub Repo** → `Dong-yeon/fitto` 선택
2. 서비스 **Settings → Root Directory** 를 **`backend`** 로 지정 (모노레포이므로 필수)
3. 빌드: Railway Nixpacks 가 Gradle(`gradlew`)을 자동 감지해 빌드/실행합니다.
   - (선택) 결정적 빌드가 필요하면 `backend/`에 Dockerfile 을 추가해도 됩니다.

## 2. 환경변수 설정 (백엔드 서비스 → Variables)

서비스 이름이 `Postgres`, `Redis` 라고 가정합니다(실제 이름에 맞게 바꾸세요).

| 변수 | 값 |
| --- | --- |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `SPRING_DATA_REDIS_URL` | `${{Redis.REDIS_URL}}` |
| `JWT_SECRET` | 안전한 무작위 값 (예: `openssl rand -hex 32`) |

- `PORT` 는 Railway 가 자동 주입합니다(앱이 `${PORT}` 로 리스닝하도록 이미 설정됨).
- `${{서비스.변수}}` 는 Railway 의 변수 참조 문법입니다.
- DB 스키마는 **첫 기동 시 Flyway 가 자동 생성**합니다(수동 DDL 불필요).

## 3. 배포 확인

배포 후 서비스 **Settings → Networking → Generate Domain** 으로 공개 URL 생성:

```
https://<your-app>.up.railway.app/api/v1/health
→ {"success":true,"data":{"status":"UP",...}}
```

로그에 다음이 보이면 정상입니다:
```
Successfully applied 2 migrations to schema "public", now at version v2
Tomcat started on port ...
Started FittoApplication
```

## 4. 프론트엔드 연결

배포된 백엔드 URL 로 앱의 API 주소를 바꿉니다 — `frontend/src/constants/config.ts`:

```ts
export const API_BASE_URL = 'https://<your-app>.up.railway.app/api/v1';
export const WS_BASE_URL = 'wss://<your-app>.up.railway.app/ws/chat'; // TLS 이므로 wss
```

> 운영에서는 위 값을 하드코딩 대신 `app.json` 의 `extra` 또는 빌드 환경변수로 분리하는 것을 권장합니다.

## 트러블슈팅

| 증상 | 원인 / 해결 |
| --- | --- |
| 빌드 실패(루트에서 Gradle 못 찾음) | Root Directory 가 `backend` 인지 확인 |
| `DATABASE_URL 이 비어 있습니다` | 변수 참조 `${{Postgres.DATABASE_URL}}` 오타/서비스명 확인 |
| Redis 인증 오류 | `SPRING_DATA_REDIS_URL` 이 `${{Redis.REDIS_URL}}`(비밀번호 포함)인지 확인 |
| `validate failed` | 기존 DB 스키마 불일치 → 새 DB이거나, 마이그레이션 충돌 점검 |
| 앱에서 연결 안 됨 | 프론트의 `API_BASE_URL`/`WS_BASE_URL` 이 배포 도메인+`https/wss` 인지 확인 |
