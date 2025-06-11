package com.social_network.social_network.controller;
import java.text.ParseException;

import com.social_network.social_network.dto.request.UserCreationRequest;
import com.social_network.social_network.dto.request.UserUpdateRequest;
import com.social_network.social_network.dto.response.UserInfoDTO;
import com.social_network.social_network.dto.response.UserResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.social_network.social_network.dto.response.APIResponse;
import com.social_network.social_network.dto.request.LoginRequest;
//import com.social_network.social_network.dto.request.IntrospectRequest;
//import com.social_network.social_network.dto.request.LogoutRequest;
import com.social_network.social_network.dto.response.AuthenticationResponse;
//import com.social_network.social_network.dto.response.IntrospectResponse;
import com.social_network.social_network.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Slf4j
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class  AuthenticationController {
    private final AuthenticationService authenticationService;

    @GetMapping("/me")
    public APIResponse<UserInfoDTO> getCurrentUser() {
        APIResponse<UserInfoDTO> apiResponse = new APIResponse<>();
        apiResponse.setResult(authenticationService.getCurrentUser());
        return apiResponse;
    }

    @PostMapping("/login")
    public APIResponse<AuthenticationResponse> login(@RequestBody LoginRequest request) {
        AuthenticationResponse authenticationResponse = authenticationService.login(request);
        return APIResponse.<AuthenticationResponse>builder()
                .result(authenticationResponse)
                .build();
    }

    @PostMapping("/register")
    APIResponse<UserInfoDTO> register(@Valid @RequestBody UserCreationRequest request) {
        System.out.println(request);
        APIResponse<UserInfoDTO> apiResponse = new APIResponse<>();
        apiResponse.setResult(authenticationService.register(request));
        apiResponse.setSuccess(true);
        return apiResponse;
    }

    @PatchMapping("/updateProfile")
    APIResponse<UserInfoDTO> updateUser(@Valid @RequestBody UserUpdateRequest request) {
        return APIResponse.<UserInfoDTO>builder()
                .result(authenticationService.updateUser( request))
                .build();
    }

    @DeleteMapping("/{userId}")
    APIResponse<UserResponse> deleteUser(@PathVariable("userId") String userId) {
        boolean success = authenticationService.deleteUser(userId);
        return APIResponse.<UserResponse>builder()
                .success(success)
                .build();
    }

//    @PostMapping("/introspect")
//    APIResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) {
//        var result = authenticationService.introspect(request);
//        return APIResponse.<IntrospectResponse>builder().result(result).build();
//    }
//
//    @PostMapping("/logout")
//    APIResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
//        authenticationService.logout(request);
//        return APIResponse.<Void>builder().build();
//    }
}
