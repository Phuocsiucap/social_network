package com.social_network.social_network.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {
    private String fileName;
    private String filePath;
    private String fileType;
    private long size;
    private LocalDateTime uploadTime;

    // Additional fields for file info
    private String originalName;
    private String url; // Full URL if needed
}