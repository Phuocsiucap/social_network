package com.social_network.social_network.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.social_network.social_network.dto.WebSocketMessageDTO;
import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.service.ChatService;
import com.social_network.social_network.service.MessageService;
import com.social_network.social_network.service.WebSocketSessionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatMessageHandler extends MessageHandler {

    private final MessageService messageService;
    private final ChatService chatService;
    private final ObjectMapper objectMapper;
    private final WebSocketSessionManager sessionManager;

    @Override
    public boolean canHandle(String messageType) {
        return List.of("CHAT", "MEDIA", "CHAT_JOIN", "CHAT_LEAVE", "CHAT_READ", "CHAT_TYPING").contains(messageType);
    }

    @Override
    public void handle(WebSocketSession session, WebSocketMessageDTO message) throws Exception {
        String senderId = sessionManager.getUserIdFromSession(session);

        switch (message.getMessageType()) {
            case "CHAT":
            case "MEDIA":
                handleChatOrMedia(session, senderId, message);
                break;
            case "CHAT_JOIN":
                handleJoin(session, senderId, message);
                break;
            case "CHAT_LEAVE":
                handleLeave(session, senderId, message);
                break;
            case "CHAT_READ":
                handleRead(session, senderId, message);
                break;
            case "CHAT_TYPING":
                handleTyping(session, senderId, message);
                break;
            default:
                session.sendMessage(new TextMessage("Unsupported message type: " + message.getMessageType()));
        }
    }

    private void handleChatOrMedia(WebSocketSession session, String senderId, WebSocketMessageDTO message) throws Exception {
        MessageRequest messageRequest = new MessageRequest();
        messageRequest.setContent(message.getContent());

        messageRequest.setChatId(message.getChatId());
        messageRequest.setMessageType(message.getMessageType());
        messageRequest.setFileUrl(message.getFileUrl());
        
        MessageDTO savedMessage = messageService.saveMessage(messageRequest, senderId);

        if (savedMessage != null) {


            Map<String, Object> response = Map.of(
                    "messageType", "NEW_MESSAGE",
                    "data", Map.of(
                            "message", savedMessage,
                            "conversationId", message.getChatId()
                    )
            );
            sessionManager.sendMessageToChatId(message.getChatId(), response);
            updateDeliveryStatus(savedMessage, message.getChatId());
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
        } else {
            session.sendMessage(new TextMessage("Failed to send message"));
        }
    }

    private void handleJoin(WebSocketSession session, String senderId, WebSocketMessageDTO message) throws Exception {
        log.info("User {} joined chat {}", senderId, message.getChatId());

        session.sendMessage(new TextMessage("Joined chat " + message.getChatId()));
    }

    private void handleLeave(WebSocketSession session, String senderId, WebSocketMessageDTO message) throws Exception {
        log.info("User {} left chat {}", senderId, message.getChatId());

        session.sendMessage(new TextMessage("Left chat " + message.getChatId()));
    }

    private void handleRead(WebSocketSession session, String senderId, WebSocketMessageDTO message) throws Exception {
//        log.info("User {} read message {} in chat {}", senderId, message.getMessageId(), message.getChatId());
//
//        // Gửi thông báo đã đọc đến người khác
//        for (String userId : chatService.getUserIdsByChatId(message.getChatId())) {
//            if (!userId.equals(senderId)) {
//                sessionManager.sendToUser(userId, Map.of(
//                        "messageType", "READ_RECEIPT",
//                        "chatId", message.getChatId(),
//                        "messageId", message.getMessageId(),
//                        "userId", senderId,
//                        "timestamp", System.currentTimeMillis()
//                ));
//            }
//        }
    }

    private void handleTyping(WebSocketSession session, String senderId, WebSocketMessageDTO message) throws Exception {
//        log.info("User {} is typing in chat {}: {}", senderId, message.getChatId(), message.getIsTyping());
//
//        for (String userId : chatService.getUserIdsByChatId(message.getChatId())) {
//            if (!userId.equals(senderId)) {
//                sessionManager.sendToUser(userId, Map.of(
//                        "messageType", "TYPING",
//                        "chatId", message.getChatId(),
//                        "userId", senderId,
//                        "isTyping", message.getIsTyping()
//                ));
//            }
//        }
    }

    private void updateDeliveryStatus(MessageDTO savedMessage, String chatId) {
//        for (String userId : chatService.getUserIdsByChatId(chatId)) {
//            if (!userId.equals(savedMessage.getSenderId())) {
//                sessionManager.sendToUser(userId, Map.of(
//                        "messageType", "DELIVERED",
//                        "chatId", chatId,
//                        "messageId", savedMessage.getId(),
//                        "userId", savedMessage.getSenderId(),
//                        "timestamp", System.currentTimeMillis()
//                ));
//            }
//        }
    }
}
//https://chatgpt.com/c/68579baa-af60-8009-b209-8e0b01a746b2