# 저장소 루트 Dockerfile — backend(Spring Boot)를 빌드/실행한다.
# Railway 가 Root Directory 미설정(루트) 상태에서도 이 파일로 빌드하도록 한다.
# (backend 를 Root Directory 로 지정한 경우엔 backend/Dockerfile 이 사용된다.)

# --- 빌드 단계 ---
FROM gradle:8.14.3-jdk21 AS build
WORKDIR /app
COPY backend/ /app/
RUN gradle clean bootJar -x test --no-daemon

# --- 실행 단계 ---
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
