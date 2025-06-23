package com.social_network.social_network.dto.request;

import lombok.*;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    private String chatId;
    private String content;
    private String messageType;
    private String fileUrl;
}