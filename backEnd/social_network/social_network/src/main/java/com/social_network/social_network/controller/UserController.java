package com.social_network.social_network.controller;

import com.social_network.social_network.dto.response.APIResponse;
import com.social_network.social_network.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    private UserService userService;



//    @GetMapping
//    APIResponse<List<UserResponse>> getUsers() {
//        APIResponse<List<UserResponse>> apiResponse = new APIResponse<>();
//        apiResponse.setResult(userService.getAllUsers());
//        return apiResponse;
//    }




}
