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

    // Image file constraints
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    // General file constraints (for chat files)
    private static final List<String> ALLOWED_CHAT_FILE_TYPES = Arrays.asList(
            // Images
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
            // Documents
            "application/pdf", "text/plain", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            // Archives
            "application/zip", "application/x-rar-compressed",
            // Audio
            "audio/mpeg", "audio/wav", "audio/ogg",
            // Video
            "video/mp4", "video/avi", "video/mov", "video/wmv"
    );

    private static final long MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
    private static final long MAX_CHAT_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    @PostMapping("/avatar")
    public APIResponse<Map<String, String>> uploadAvatar(@RequestParam("avatar") MultipartFile file)
            throws IOException, IllegalArgumentException {

        validateImageFile(file, MAX_AVATAR_SIZE);

        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        String avatarUrl = cloudinaryService.uploadAvatar(file, userId);

        Map<String, String> response = new HashMap<>();
        response.put("avatar_url", avatarUrl);

        // Update user avatar
        authService.updateUserAvatar(userId, avatarUrl);

        return APIResponse.<Map<String, String>>builder()
                .result(response)
                .message("Avatar uploaded successfully")
                .build();
    }

    @PostMapping("/general")
    public APIResponse<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder)
            throws IOException, IllegalArgumentException {

        validateImageFile(file, MAX_AVATAR_SIZE);

        String fileUrl = cloudinaryService.uploadFile(file, folder);

        Map<String, String> response = new HashMap<>();
        response.put("file_url", fileUrl);
        response.put("message", "File uploaded successfully");

        return APIResponse.<Map<String, String>>builder()
                .result(response)
                .build();
    }

    /**
     * Upload file for chat messages
     * This endpoint matches the frontend's expected structure
     */
    @PostMapping("/file")
    public APIResponse<Map<String, String>> uploadChatFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("chatId") String chatId)
            throws IOException, IllegalArgumentException {

        log.info("Uploading chat file for chatId: {}, fileName: {}, fileSize: {}",
                chatId, file.getOriginalFilename(), file.getSize());

        validateChatFile(file);

        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        // Create folder structure: chat/{chatId}/{userId}
        String folder = String.format("chat/%s", chatId);

        String fileUrl = cloudinaryService.uploadFile(file, folder);

        Map<String, String> response = new HashMap<>();
        response.put("fileUrl", fileUrl); // Match frontend expectation
        response.put("fileName", file.getOriginalFilename());
        response.put("fileSize", String.valueOf(file.getSize()));
        response.put("fileType", file.getContentType());
        response.put("chatId", chatId);

        log.info("Chat file uploaded successfully: {}", fileUrl);

        return APIResponse.<Map<String, String>>builder()
                .result(response)
                .message("File uploaded successfully")
                .build();
    }

    /**
     * Validate image files (for avatar and general image uploads)
     */
    private void validateImageFile(MultipartFile file, long maxSize) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException(
                    String.format("File size exceeds maximum limit of %d MB",
                            maxSize / (1024 * 1024))
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type. Only JPG, PNG, GIF, WebP are allowed");
        }
    }

    /**
     * Validate chat files (broader file type support)
     */
    private void validateChatFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > MAX_CHAT_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("File size exceeds maximum limit of %d MB",
                            MAX_CHAT_FILE_SIZE / (1024 * 1024))
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CHAT_FILE_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Invalid file type. Supported types: Images, Documents (PDF, Word, Excel, PowerPoint), " +
                            "Archives (ZIP, RAR), Audio (MP3, WAV, OGG), Video (MP4, AVI, MOV, WMV)"
            );
        }

        // Additional validation for file name
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.trim().isEmpty()) {
            throw new IllegalArgumentException("File name is required");
        }

        // Check for potentially dangerous file extensions
        String fileExtension = getFileExtension(fileName).toLowerCase();
        List<String> dangerousExtensions = Arrays.asList("exe", "bat", "cmd", "scr", "pif", "com", "jar");
        if (dangerousExtensions.contains(fileExtension)) {
            throw new IllegalArgumentException("File type not allowed for security reasons");
        }
    }

    /**
     * Get file extension from filename
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }
}