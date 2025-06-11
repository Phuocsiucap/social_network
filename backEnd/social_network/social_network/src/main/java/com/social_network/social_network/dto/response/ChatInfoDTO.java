package com.social_network.social_network.dto.response;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatInfoDTO {
    private String id;
    private String name; // với group chat
    private Boolean isGroup;
    private MessageDTO latestMessage;
}
