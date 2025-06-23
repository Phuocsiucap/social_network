package com.social_network.social_network.handler;

import com.social_network.social_network.dto.WebSocketMessageDTO;
import org.springframework.web.socket.WebSocketSession;

public abstract class MessageHandler {
    public abstract boolean canHandle(String messageType);
    public abstract void handle(WebSocketSession session, WebSocketMessageDTO message) throws Exception;
}
