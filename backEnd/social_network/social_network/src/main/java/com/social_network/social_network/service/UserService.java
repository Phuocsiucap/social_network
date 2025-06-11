package com.social_network.social_network.service;


import com.social_network.social_network.dto.request.UserUpdateRequest;
import com.social_network.social_network.dto.response.UserInfoDTO;
import com.social_network.social_network.dto.response.UserResponse;
import com.social_network.social_network.entity.User;
import com.social_network.social_network.dto.request.UserCreationRequest;
import com.social_network.social_network.exception.AppException;
import com.social_network.social_network.exception.ErrorCode;
import com.social_network.social_network.mapper.UserMapper;
import com.social_network.social_network.respository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;

    private final PasswordEncoder passwordEncoder;



    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }



}
