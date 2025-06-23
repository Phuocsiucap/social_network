package com.social_network.social_network.controller;

import com.social_network.social_network.dto.WebSocketMessageDTO;
import com.social_network.social_network.handler.MessageHandler;

import com.social_network.social_network.handler.MessageHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageRouter {

    private final List<MessageHandler> messageHandlers;

    public void routeMessage(WebSocketSession session, WebSocketMessageDTO message) throws Exception {
        for (MessageHandler handler : messageHandlers) {
            if(handler.canHandle(message.getMessageType())) {
                handler.handle(session,message);
                return;
            }
        }

        log.warn("No handler found for message type: {}", message.getMessageType());
        //optionally send error response to client
    }
}
