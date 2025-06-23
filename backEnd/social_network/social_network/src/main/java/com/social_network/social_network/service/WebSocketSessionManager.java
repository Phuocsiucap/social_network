package com.social_network.social_network.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social_network.social_network.dto.response.MessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Service
@Slf4j
@RequiredArgsConstructor
public class WebSocketSessionManager {

    // Đa phiên: mỗi userId có nhiều WebSocketSession
    private final ConcurrentHashMap<String, Set<WebSocketSession>> sessions = new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper;
    private final ChatService chatService;

    public void addSession(String userId, WebSocketSession session) {
        sessions.computeIfAbsent(userId, key -> new CopyOnWriteArraySet<>()).add(session);
        log.info("User {} connected with session {}", userId, session.getId());
    }

    public void removeSession(String userId, WebSocketSession session) {
        Set<WebSocketSession> userSessions = sessions.get(userId);
        if (userSessions != null) {
            userSessions.remove(session);
            log.info("Session {} of user {} disconnected", session.getId(), userId);
            if (userSessions.isEmpty()) {
                sessions.remove(userId);
                log.info("All sessions of user {} have been disconnected", userId);
            }
        }
    }

    public boolean isUserOnline(String userId) {
        Set<WebSocketSession> userSessions = sessions.get(userId);
        return userSessions != null && userSessions.stream().anyMatch(WebSocketSession::isOpen);
    }

    public String getUserIdFromSession(WebSocketSession session) {
        return (String) session.getAttributes().get("userId");
    }

    public void sendMessageToChatId(String chatId, MessageDTO message) {
        List<String> memberIds = chatService.getUserIdsByChatId(chatId);

        for (String userId : memberIds) {
            Set<WebSocketSession> userSessions = sessions.get(userId);
            if (userSessions != null) {
                for (WebSocketSession session : userSessions) {
                    if (session.isOpen()) {
                        try {
                            String jsonMessage = objectMapper.writeValueAsString(message);
                            session.sendMessage(new TextMessage(jsonMessage));
                            log.info("Message sent to user {} on session {}: {}", userId, session.getId(), jsonMessage);
                        } catch (IOException e) {
                            log.error("Error sending message to user {}: {}", userId, e.getMessage());
                        }
                    }
                }
            }
        }
    }

    public void sendToUser(String userId, Object message) {
        Set<WebSocketSession> userSessions = sessions.get(userId);
        if (userSessions != null) {
            for (WebSocketSession session : userSessions) {
                if (session.isOpen()) {
                    try {
                        String jsonMessage = objectMapper.writeValueAsString(message);
                        session.sendMessage(new TextMessage(jsonMessage));
                    } catch (IOException e) {
                        log.error("Error sending message to user {}: {}", userId, e.getMessage());
                    }
                }
            }
        }
    }
}
