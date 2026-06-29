package com.fitto.user.domain;

import com.fitto.common.domain.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 회원 — 설계서 5.2 users.
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    /** 소셜 로그인 시 NULL */
    @Column
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "social_type", length = 20)
    private SocialType socialType;

    @Column(name = "social_id")
    private String socialId;

    @Builder
    private User(String email, String password, String name, LocalDate birthDate, Gender gender,
                 String profileImageUrl, Role role, SocialType socialType, String socialId) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.profileImageUrl = profileImageUrl;
        this.role = role != null ? role : Role.USER;
        this.socialType = socialType;
        this.socialId = socialId;
    }

    public void updateProfile(String name, String profileImageUrl) {
        if (name != null) this.name = name;
        if (profileImageUrl != null) this.profileImageUrl = profileImageUrl;
    }

    public void promoteToTrainer() {
        if (this.role == Role.USER) {
            this.role = Role.TRAINER;
        }
    }
}
