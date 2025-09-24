package com.social_network.social_network.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.social_network.social_network.dto.FriendshipDTO;
import com.social_network.social_network.dto.WebSocketMessageDTO;

import com.social_network.social_network.dto.request.FriendRequest;
import com.social_network.social_network.service.FriendService;
import com.social_network.social_network.service.UserService;
import com.social_network.social_network.service.WebSocketSessionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.config.RepositoryConfigurationExtensionSupport;
import org.springframework.stereotype.Component;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class FriendMessageHandler extends MessageHandler {
    private final FriendService friendService;
    private final ObjectMapper objectMapper;
    private final WebSocketSessionManager sessionManager;

    @Override
    public boolean canHandle(String messageType) {
        return List.of(
                "FRIEND_REQUEST",
                "FRIEND_ACCEPT",
                "FRIEND_REJECT",
                "FRIEND_CANCEL",
                "UPDATE_STATUS_FRIEND"
        ).contains(messageType);
    }


    @Override
    public void handle(WebSocketSession session, WebSocketMessageDTO message) throws Exception {
        String current_userId = sessionManager.getUserIdFromSession(session);

        switch (message.getMessageType()) {
            case "FRIEND_REQUEST":
                handleFriendRequest(session, current_userId, message.getData());
                break;
            case "FRIEND_ACCEPT":
                handleFriendAccept(session, current_userId, message.getData());
                break;
            case "FRIEND_REJECT":
                break;
            case "FRIEND_CANCEL":
                handleFriendCancel(session, current_userId, message.getData());
                break;
            default:
                session.sendMessage(new TextMessage("Unsupported message type: " + message.getMessageType()));
        }
    }

    private void handleFriendRequest(WebSocketSession session, String senderId, Object messageData) throws Exception {
        try {
            // Convert Object to FriendshipDTO using ObjectMapper
            FriendRequest data;
            log.info("handleFriendRequest: {}", messageData);
            if (messageData instanceof FriendRequest) {
                data = (FriendRequest) messageData;
            } else {
                data = objectMapper.convertValue(messageData, FriendRequest.class);
            }
            log.info("handleFriendRequest: {}", data);

            FriendshipDTO responseData = friendService.addFriendRequest(senderId, data.getTargetId());

            if (responseData != null) {
                Map<String, Object> response = Map.of(
                        "messageType", "FRIENDSHIP_REQUEST",
                        "data", responseData
                );
                sessionManager.sendToUser(responseData.getReceiver().getId(), response);
            } else {
                session.sendMessage(new TextMessage("Failed to send message"));
            }
        } catch (Exception e) {
            log.error("Error handling chat/media message: {}", e.getMessage(), e);
            session.sendMessage(new TextMessage("Error processing message: " + e.getMessage()));
        }
    }

    private void handleFriendAccept(WebSocketSession session, String senderId, Object messageData) throws Exception {
        try {
            // Convert Object to FriendshipDTO using ObjectMapper
            FriendRequest data;
            log.info("handleFriendAccept: {}", messageData);
            if (messageData instanceof FriendRequest) {
                data = (FriendRequest) messageData;
            } else {
                data = objectMapper.convertValue(messageData, FriendRequest.class);
            }
//            log.info("handleFriendRequest: {}", data);

            FriendshipDTO responseData = friendService.acceptFriendship(senderId, data.getTargetId());

            if (responseData != null) {
                Map<String, Object> response = Map.of(
                        "messageType", "FRIENDSHIP_ ACCEPTED",
                        "data", responseData
                );
                sessionManager.sendToUser(responseData.getSender().getId(), response);
            } else {
                session.sendMessage(new TextMessage("Failed to send message"));
            }
        } catch (Exception e) {
            log.error("Error handling chat/media message: {}", e.getMessage(), e);
            session.sendMessage(new TextMessage("Error processing message: " + e.getMessage()));
        }
    }

    private void handleFriendCancel(WebSocketSession session, String senderId, Object messageData) throws Exception {
        try {
            FriendRequest data;
//            log.info("handleFriendRequest: {}", messageData);
            if (messageData instanceof FriendRequest) {
                data = (FriendRequest) messageData;
            } else {
                data = objectMapper.convertValue(messageData, FriendRequest.class);
            }

            log.info("handleFriendCancel: {}", data);
            boolean result = friendService.removeFriend(senderId, data.getTargetId());
            if (result) {
                Map<String, Object> response = Map.of(
                        "messageType", "FRIENDSHIP_CANCEL_RESULT",
                        "data", true
                );
                sessionManager.sendToUser( senderId, response);
            } else {
                session.sendMessage(new TextMessage("Failed to send message"));
            }
        } catch (Exception e) {
            log.error("Error handling chat/media message: {}", e.getMessage(), e);
        }
    }



}
//https://chatgpt.com/c/68579baa-af60-8009-b209-8e0b01a746b2