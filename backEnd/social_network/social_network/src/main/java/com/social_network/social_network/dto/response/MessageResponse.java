package com.social_network.social_network.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private String id;
    private ChatInfoDTO chat;          // Thay vì entity Chat (cần sửa bởi bì khkhoongcaanf thiết)
    private UserInfoDTO sender;        // Thay vì entity User
    private String content;
    private List<UserInfoDTO> readBy;
    private String messageType;        // text, image, file, etc
    private String fileUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean delivered;
}
