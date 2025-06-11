package com.social_network.social_network.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        try {
            // Tạo public_id unique
            String publicId = UUID.randomUUID().toString();

            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", publicId,
                    "resource_type", "image",
                    "transformation", new Transformation()
                            .quality("auto:good")
                            .fetchFormat("auto")
            );


            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            log.info("File uploaded successfully: {}", uploadResult.get("secure_url"));
            return (String) uploadResult.get("secure_url");

        } catch (IOException e) {
            log.error("Error uploading file to Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to upload image: " + e.getMessage());
        }
    }

    public String uploadAvatar(MultipartFile file, String userId) throws IOException {
        return uploadFile(file, "profile-avatars/" + userId);
    }

    public boolean deleteFile(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            log.error("Error deleting file from Cloudinary: {}", e.getMessage());
            return false;
        }
    }

    // Lấy URL với transformation
    public String getOptimizedUrl(String publicId, int width, int height) {
        return cloudinary.url()
                .transformation(
                        (Transformation) ObjectUtils.asMap(
                                "width", width,
                                "height", height,
                                "crop", "fill",
                                "quality", "auto:good",
                                "fetch_format", "auto"
                        )
                )
                .generate(publicId);
    }
}