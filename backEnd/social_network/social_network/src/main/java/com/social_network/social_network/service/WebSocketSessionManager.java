package com.social_network.social_network.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class WebSocketSessionManager {

    // userId -> tabId -> WebSocketSession
    private final Map<String, Map<String, WebSocketSession>> sessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;
    private final ChatService chatService;

    /**
     * Add new session, gracefully handle old sessions
     */
    public void addSession(String userId, String tabId, WebSocketSession session) {
        sessions.computeIfAbsent(userId, k -> new ConcurrentHashMap<>());

        // Get user's tab map
        Map<String, WebSocketSession> tabMap = sessions.get(userId);

        // Close old session for same tab if exists
        WebSocketSession oldSession = tabMap.get(tabId);
        if (oldSession != null && oldSession.isOpen()) {
            closeSessionSafely(oldSession, userId, tabId);
        }

        // Add new session
        tabMap.put(tabId, session);

        log.info("Session added: userId={}, tabId={}, sessionId={}",
                userId, tabId, session.getId());
    }

    /**
     * Remove session by session object
     */
    public void removeSession(String userId, WebSocketSession session) {
        Map<String, WebSocketSession> tabMap = sessions.get(userId);
        if (tabMap != null) {
            // Find and remove session by sessionId
            String removedTabId = null;
            for (Map.Entry<String, WebSocketSession> entry : tabMap.entrySet()) {
                if (entry.getValue().getId().equals(session.getId())) {
                    removedTabId = entry.getKey();
                    tabMap.remove(entry.getKey());
                    break;
                }
            }

            if (removedTabId != null) {
                log.info("Session removed: userId={}, tabId={}, sessionId={}",
                        userId, removedTabId, session.getId());
            }

            // Remove user entry if no more sessions
            if (tabMap.isEmpty()) {
                sessions.remove(userId);
                log.info("All sessions removed for userId={}", userId);
            }
        }
    }

    /**
     * Check if user has any active sessions
     */
    public boolean isUserOnline(String userId) {
        Map<String, WebSocketSession> tabMap = sessions.get(userId);
        if (tabMap == null) return false;

        // Clean up closed sessions while checking
        tabMap.entrySet().removeIf(entry -> !entry.getValue().isOpen());

        // Remove user if no active sessions
        if (tabMap.isEmpty()) {
            sessions.remove(userId);
            return false;
        }

        return true;
    }

    /**
     * Get userId from session attributes
     */
    public String getUserIdFromSession(WebSocketSession session) {
        return (String) session.getAttributes().get("userId");
    }

    /**
     * Send message to all members of a chat
     */
    public void sendMessageToChatId(String chatId, Map<String, Object> response) {
        try {
            List<String> memberIds = chatService.getUserIdsByChatId(chatId);
            for (String userId : memberIds) {
                sendToUser(userId, response);
            }
        } catch (Exception e) {
            log.error("Error sending message to chat {}: {}", chatId, e.getMessage());
        }
    }

    /**
     * Send message to specific user (all their active sessions)
     */
    public void sendToUser(String userId, Object message) {
        Map<String, WebSocketSession> tabMap = sessions.get(userId);
        if (tabMap == null || tabMap.isEmpty()) {
            log.debug("No active sessions for userId={}", userId);
            return;
        }

        String json;
        try {
            json = objectMapper.writeValueAsString(message);
        } catch (Exception e) {
            log.error("Error serializing message for userId={}: {}", userId, e.getMessage());
            return;
        }

        // Send to all active sessions for this user
        for (Map.Entry<String, WebSocketSession> entry : tabMap.entrySet()) {
            WebSocketSession session = entry.getValue();
            String tabId = entry.getKey();

            if (session.isOpen()) {
                try {
                    synchronized (session) { // Prevent concurrent sending
                        if (session.isOpen()) { // Double check after acquiring lock
                            session.sendMessage(new TextMessage(json));
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to send message to userId={}, tabId={}, sessionId={}: {}",
                            userId, tabId, session.getId(), e.getMessage());

                    // Remove failed session
                    tabMap.remove(tabId);
                }
            } else {
                // Remove closed session
                tabMap.remove(tabId);
                log.debug("Removed closed session: userId={}, tabId={}", userId, tabId);
            }
        }

        // Clean up user entry if no more active sessions
        if (tabMap.isEmpty()) {
            sessions.remove(userId);
            log.debug("Removed user entry for userId={} (no active sessions)", userId);
        }
    }

    /**
     * Get count of active sessions for debugging
     */
    public int getActiveSessionCount() {
        return sessions.values().stream()
                .mapToInt(tabMap -> (int) tabMap.values().stream()
                        .filter(WebSocketSession::isOpen)
                        .count())
                .sum();
    }

    /**
     * Get active user count
     */
    public int getActiveUserCount() {
        return sessions.size();
    }

    /**
     * Safely close WebSocket session
     */
    private void closeSessionSafely(WebSocketSession session, String userId, String tabId) {
        try {
            if (session != null && session.isOpen()) {
                session.close();
                log.debug("Closed old session: userId={}, tabId={}, sessionId={}",
                        userId, tabId, session.getId());
            }
        } catch (Exception e) {
            log.debug("Error closing old session for userId={}, tabId={}: {}",
                    userId, tabId, e.getMessage());
        }
    }
}