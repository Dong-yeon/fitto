package com.fitto.auth.service;

import com.fitto.auth.dto.LoginRequest;
import com.fitto.auth.dto.RegisterRequest;
import com.fitto.auth.dto.TokenResponse;
import com.fitto.auth.dto.UserResponse;
import com.fitto.chat.repository.ChatMessageRepository;
import com.fitto.common.exception.BusinessException;
import com.fitto.common.exception.ErrorCode;
import com.fitto.common.security.JwtTokenProvider;
import com.fitto.relation.repository.RelationRepository;
import com.fitto.streak.repository.StreakRepository;
import com.fitto.user.domain.Role;
import com.fitto.user.domain.SocialType;
import com.fitto.user.domain.User;
import com.fitto.user.repository.UserRepository;
import com.fitto.workout.repository.WorkoutRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 서비스 — 설계서 3.1 / 4.2.
 * 이메일 회원가입/로그인, 토큰 발급/갱신, 회원 탈퇴.
 */
@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final RelationRepository relationRepository;
    private final WorkoutRepository workoutRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final StreakRepository streakRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       RelationRepository relationRepository,
                       WorkoutRepository workoutRepository,
                       ChatMessageRepository chatMessageRepository,
                       StreakRepository streakRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.relationRepository = relationRepository;
        this.workoutRepository = workoutRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.streakRepository = streakRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .birthDate(request.birthDate())
                .gender(request.gender())
                .role(Role.USER)
                .socialType(SocialType.EMAIL)
                .build();
        userRepository.save(user);
        return issueTokens(user);
    }

    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));
        if (user.getPassword() == null
                || !passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
        return issueTokens(user);
    }

    /** Refresh Token 으로 Access/Refresh 재발급 — 설계서 4.2 POST /auth/refresh. */
    public TokenResponse refresh(String refreshToken) {
        Claims claims;
        try {
            claims = tokenProvider.parse(refreshToken);
        } catch (JwtException | IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }
        if (!tokenProvider.isRefreshToken(claims)) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN);
        }
        User user = userRepository.findById(Long.valueOf(claims.getSubject()))
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN));
        return issueTokens(user);
    }

    /** 현재 로그인 사용자 조회 — 클라이언트 콜드 스타트 시 프로필 복원용. */
    public UserResponse getMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));
        return UserResponse.from(user);
    }

    /** 프로필(이름) 수정. */
    @Transactional
    public UserResponse updateMe(Long userId, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));
        user.updateProfile(name, null);
        return UserResponse.from(user);
    }

    /** 회원 탈퇴 — 연결된 관계를 종료한 뒤 계정 삭제 (AUTH-06). */
    @Transactional
    public void withdraw(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
        // 의존 데이터 정리 후 계정 삭제 (FK 순서: 메시지/스트릭 → 운동 → 관계 → 사용자)
        chatMessageRepository.deleteAllByUserRelations(userId);
        streakRepository.deleteAllByUserId(userId);
        streakRepository.deleteAllByUserRelations(userId);
        workoutRepository.deleteAllByUserId(userId);
        relationRepository.deleteAllByUser(userId);
        userRepository.delete(user);
    }

    private TokenResponse issueTokens(User user) {
        String access = tokenProvider.createAccessToken(user.getId(), user.getRole());
        String refresh = tokenProvider.createRefreshToken(user.getId());
        return new TokenResponse(access, refresh, UserResponse.from(user));
    }
}
