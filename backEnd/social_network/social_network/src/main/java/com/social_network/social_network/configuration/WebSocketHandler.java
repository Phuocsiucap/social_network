package com.social_network.social_network.configuration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social_network.social_network.controller.MessageRouter;
import com.social_network.social_network.dto.WebSocketMessageDTO;
import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.entity.User;
import com.social_network.social_network.respository.UserRepository;
import com.social_network.social_network.service.ChatService;
import com.social_network.social_network.service.MessageService;
import com.social_network.social_network.service.UserService;
import com.social_network.social_network.service.WebSocketSessionManager;
import com.social_network.social_network.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketHandler implements org.springframework.web.socket.WebSocketHandler {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;
    private final WebSocketSessionManager sessionManager;
    private final MessageRouter messageRouter;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        URI uri = session.getUri();
        if (uri == null) {
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        String query = uri.getRawQuery(); // e.g. "token=..."
        if (query == null || !query.startsWith("token=")) {
            log.warn("Token not provided in Url");
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Missing token"));
            return;
        }

        String token = query.substring("token=".length());
        if (!jwtUtil.validateToken(token)) {
            log.warn("Invalid Token");
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Invalid token"));
            return;
        }

        String userId = jwtUtil.getUserIdFromToken(token);
        session.getAttributes().put("userId", userId);
        sessionManager.addSession(userId, session);// cần xem lại
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        log.info("Nhận message: {}", message.getPayload());

        JsonNode jsonNode = objectMapper.readTree(message.getPayload().toString());
        WebSocketMessageDTO wsMessage = objectMapper.convertValue(jsonNode, WebSocketMessageDTO.class);

        messageRouter.routeMessage(session, wsMessage);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("WebSocket error:", exception);
        if (session.isOpen()) {
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String userId = sessionManager.getUserIdFromSession(session);
        if (userId != null) {
            sessionManager.removeSession(userId, session);
        }
        log.info("WebSocket connection closed: {}", status);
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
//https://claude.ai/chat/32f9bf00-0f99-41ee-bdda-684d0a75509f
