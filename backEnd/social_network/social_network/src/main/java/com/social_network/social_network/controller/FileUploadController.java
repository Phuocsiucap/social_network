package com.social_network.social_network.controller;

import com.social_network.social_network.dto.response.APIResponse;
import com.social_network.social_network.service.AuthenticationService;
import com.social_network.social_network.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FileUploadController {
    private final AuthenticationService authService;

    private final CloudinaryService cloudinaryService;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    @PostMapping("/avatar")
    public APIResponse<Map<String, String>> uploadAvatar(@RequestParam("avatar") MultipartFile file) throws IOException, IllegalArgumentException {

        validateFile(file);

        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        String avatarUrl = cloudinaryService.uploadAvatar(file, userId);

        Map<String, String> response = new HashMap<>();
        response.put("avatar_url", avatarUrl);
        //cập nhat avatar
        authService.updateUserAvatar(userId, avatarUrl);
        return APIResponse.<Map<String, String>>builder()
                .result(response)
                .message("Avatar uploaded successfully")
                .build();
    }

    @PostMapping("/general")
    public APIResponse<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) throws IOException, IllegalArgumentException {

        validateFile(file);

        String fileUrl = cloudinaryService.uploadFile(file, folder);

        Map<String, String> response = new HashMap<>();
        response.put("file_url", fileUrl);
        response.put("message", "File uploaded successfully");

        return APIResponse.<Map<String, String>>builder()
                .result(response)
                .build();
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("File size exceeds maximum limit of %d MB",
                            MAX_FILE_SIZE / (1024 * 1024))
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type. Only JPG, PNG, GIF, WebP are allowed");
        }
    }
}
