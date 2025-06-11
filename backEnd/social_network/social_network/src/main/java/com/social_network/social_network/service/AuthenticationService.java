package com.social_network.social_network.service;


import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.social_network.social_network.dto.request.LoginRequest;
import com.social_network.social_network.dto.request.UserCreationRequest;
import com.social_network.social_network.dto.request.UserUpdateRequest;
import com.social_network.social_network.dto.response.AuthenticationResponse;
import com.social_network.social_network.dto.response.UserInfoDTO;
import com.social_network.social_network.dto.response.UserResponse;
import com.social_network.social_network.entity.User;
import com.social_network.social_network.exception.AppException;
import com.social_network.social_network.exception.ErrorCode;
import com.social_network.social_network.mapper.UserMapper;
import com.social_network.social_network.respository.InvalidedTokenRepository;
import com.social_network.social_network.respository.UserRepository;
import com.social_network.social_network.util.JwtUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class AuthenticationService {

    UserRepository userRepository;
    InvalidedTokenRepository invalidedTokenRepository;
    PasswordEncoder passwordEncoder;
    JwtUtil jwtUtil;
    UserMapper userMapper;


    public AuthenticationResponse login(LoginRequest request) {
        var user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("user not found with email: " + request.getEmail()));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        UserInfoDTO userInfoDTO = userMapper.toUserInfoDTO(user);
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        } else {
            String token = null;
            try {
                token = jwtUtil.generateToken(user);
                return AuthenticationResponse.builder()
                        .token(token)
                        .user(userInfoDTO)
                        .authenticated(authenticated)
                        .build();
            } catch (JOSEException e) {
                throw new RuntimeException(e);
            }
        }

    }


    public UserInfoDTO register(UserCreationRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.toUser(request);
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        return userMapper.toUserInfoDTO(userRepository.save(user));

    }


    public UserInfoDTO updateUser(UserUpdateRequest request) {
        // Lấy userId từ SecurityContext
        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        User user = userRepository.findById(userId).orElseThrow(() ->new  RuntimeException("User not found"));
        userMapper.updateUser(user, request);

        user.setUpdatedAt(LocalDateTime.now());
        return userMapper.toUserInfoDTO(userRepository.save(user));
    }


    public boolean deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->new  RuntimeException("User not found"));
        userRepository.delete(user);
        return true;
    }


    public UserInfoDTO getCurrentUser() {
        // Lấy userId từ SecurityContext
        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        System.out.println(user.getEmail());
        return userMapper.toUserInfoDTO(user);
    }

    public void updateUserAvatar(String userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAvatar(avatarUrl);
        userRepository.save(user);
    }


}
