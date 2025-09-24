package com.social_network.social_network.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WebSocketMessageDTO {
    String messageType;

    Object data;
}

