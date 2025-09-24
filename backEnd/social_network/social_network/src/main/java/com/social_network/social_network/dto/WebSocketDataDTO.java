package com.social_network.social_network.dto;

import com.social_network.social_network.dto.response.MessageUser;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WebSocketDataDTO {
    String content;
    String messageType;
    String chatId;

//    MultipartFile file;
    String fileUrl;  // Base64 encoded file data (data:image/png;base64,...)
    String fileName;
    Long fileSize;
    String fileType;


    private String id;
    private MessageUser sender; // với group chat
    private LocalDateTime createdAt;

    private Boolean delivered;
    private Boolean isRead;

}

