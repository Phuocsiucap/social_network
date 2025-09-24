package com.social_network.social_network.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // Supported file types
    private static final List<String> IMAGE_FORMATS = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/bmp", "image/tiff"
    );

    private static final List<String> VIDEO_FORMATS = Arrays.asList(
            "video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv", "video/webm", "video/mkv"
    );

    private static final List<String> AUDIO_FORMATS = Arrays.asList(
            "audio/mp3", "audio/wav", "audio/aac", "audio/flac", "audio/ogg", "audio/m4a"
    );

    // Maximum file size (100MB for all files)
    private static final long MAX_FILE_SIZE = 100 * 1024 * 1024;



    /**
     * Universal file upload method - handles all file types
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        validateFile(file);

        try {
            String publicId = UUID.randomUUID().toString();
            String resourceType = determineResourceType(file.getContentType());

            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", publicId,
                    "resource_type", resourceType
            );

            // Add transformations only for images and videos
            addOptimalTransformation(uploadParams, file.getContentType());

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            String secureUrl = (String) uploadResult.get("secure_url");
            log.info("File uploaded successfully: {} (Type: {}, Size: {} bytes)",
                    secureUrl, file.getContentType(), file.getSize());
            return secureUrl;

        } catch (IOException e) {
            log.error("Error uploading file to Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Upload avatar - just a wrapper around uploadFile
     */
    public String uploadAvatar(MultipartFile file, String userId) throws IOException {
        if (!IMAGE_FORMATS.contains(file.getContentType())) {
            throw new IllegalArgumentException("Avatar must be an image file");
        }
        return uploadFile(file, "profile-avatars/" + userId);
    }

    /**
     * Delete file from Cloudinary
     */
    public boolean deleteFile(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            log.error("Error deleting file from Cloudinary: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get optimized URL with transformation
     */
    public String getOptimizedUrl(String publicId, int width, int height) {
        return cloudinary.url()
                .transformation(new Transformation()
                        .width(width)
                        .height(height)
                        .crop("fill")
                        .quality("auto:good")
                        .fetchFormat("auto")
                )
                .generate(publicId);
    }

    // Private helper methods

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("File size exceeds limit. Max: %d MB, Actual: %.2f MB",
                            MAX_FILE_SIZE / (1024 * 1024),
                            (double) file.getSize() / (1024 * 1024))
            );
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IllegalArgumentException("File content type cannot be determined");
        }

        // Check if file type is supported
        if (!isSupportedFileType(contentType)) {
            throw new IllegalArgumentException("Unsupported file type: " + contentType);
        }
    }

    private boolean isSupportedFileType(String contentType) {
        return IMAGE_FORMATS.contains(contentType) ||
                VIDEO_FORMATS.contains(contentType) ||
                AUDIO_FORMATS.contains(contentType) ||
                contentType.startsWith("application/") || // Documents, archives, etc.
                contentType.startsWith("text/"); // Text files
    }

    private String determineResourceType(String contentType) {
        if (IMAGE_FORMATS.contains(contentType)) {
            return "image";
        } else if (VIDEO_FORMATS.contains(contentType) || AUDIO_FORMATS.contains(contentType)) {
            return "video"; // Cloudinary uses 'video' for both video and audio
        } else {
            return "raw"; // For documents, archives, and other files
        }
    }

    private void addOptimalTransformation(Map<String, Object> uploadParams, String contentType) {
        if (IMAGE_FORMATS.contains(contentType)) {
            uploadParams.put("transformation", new Transformation()
                    .quality("auto:good")
                    .fetchFormat("auto")
            );
        } else if (VIDEO_FORMATS.contains(contentType)) {
            uploadParams.put("transformation", new Transformation()
                    .quality("auto:good")
            );
        }
        // No transformation for audio and raw files
    }
}