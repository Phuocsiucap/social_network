package com.social_network.social_network.configuration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.dto.response.MessageResponse;
import com.social_network.social_network.entity.Messages;
import com.social_network.social_network.entity.User;
import com.social_network.social_network.mapper.UserMapper;
import com.social_network.social_network.respository.UserRepository;
import com.social_network.social_network.service.ChatService;
import com.social_network.social_network.service.MessageService;
import com.social_network.social_network.service.UserService;
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
public class ChatWebSocketHandler implements WebSocketHandler {

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;
    private final MessageService messageService;
    private final ChatService chatService;


    // Map userId -> WebSocketSession
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final UserService userService;
    private final UserRepository userRepository;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        URI uri = session.getUri();
        if (uri == null) {
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        String query = uri.getRawQuery(); // e.g. "token=..."
        if (query == null || !query.startsWith("token=")) {
            log.warn("Token không được gửi trong URL");
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Missing token"));
            return;
        }


        String token = query.substring("token=".length());
        if (!jwtUtil.validateToken(token)) {
            log.warn("Token không hợp lệ");
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Invalid token"));
            return;
        }


        String userId = jwtUtil.getUserIdFromToken(token);
        session.getAttributes().put("userId", userId);
        sessions.put(userId, session);

        Optional<User> user = userRepository.findById(userId);

        log.info("User {} đã kết nối WebSocket", user.get().getEmail());
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        log.info("Nhận message: {}", message.getPayload());

        JsonNode jsonNode = objectMapper.readTree(message.getPayload().toString());

        String content = jsonNode.get("content").asText();
        String chatId = jsonNode.get("chatId").asText();
        String messageType = jsonNode.get("messageType").asText();
        String fileUrl = jsonNode.get("fileUrl").asText();

        String senderId = getUserIdFromSession(session);

        MessageRequest messageSend = new MessageRequest();
        messageSend.setContent(content);
        messageSend.setChatId(chatId);
        messageSend.setMessageType(messageType);
        messageSend.setFileUrl(fileUrl);


        // Lưu message vào DB
        MessageResponse savedMessage = messageService.sendMessage(messageSend, senderId);

        if (savedMessage != null) {
            // Gửi tới các thành viên trong chat
            sendMessageToChatId(chatId, savedMessage);

            // Cập nhật trạng thái delivered nếu ít nhất 1 người nhận được
            List<String> memberIds = chatService.getUserIdsByChatId(chatId);
            boolean delivered = memberIds.stream().anyMatch(this::isUserOnline);
            if (delivered) {
                savedMessage.setDelivered(true);
                messageService.updateDeliveryStatus(savedMessage);
            }
            log.info("trang thai {}", delivered);
            // Phản hồi lại client

            session.sendMessage(new TextMessage("Đã gửi tới " + chatId + ": " + content));
        } else {
            session.sendMessage(new TextMessage("Gửi thất bại!"));
        }
    }


    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("Lỗi WebSocket:", exception);
        if (session.isOpen()) {
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Xóa session tương ứng khỏi map khi ngắt kết nối
        sessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
        log.info("Kết nối WebSocket đóng: {}", status);
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    // Kiểm tra người dùng có online hay không
    public boolean isUserOnline(String userId) {
        return sessions.containsKey(userId) && sessions.get(userId).isOpen();
    }


    public String getUserIdFromSession(WebSocketSession session) {
        return (String) session.getAttributes().get("userId");
    }

    public void sendMessageToChatId(String chatId, MessageResponse message) {
        List<String> memberIds = chatService.getUserIdsByChatId(chatId); // Lấy từ DB hoặc cache

        for (String userId : memberIds) {
            WebSocketSession session = sessions.get(userId);
            if (session != null && session.isOpen()) {
                try {
                    String jsonMessage = objectMapper.writeValueAsString(message);
                    session.sendMessage(new TextMessage(jsonMessage));
                    log.info("Đã gửi message đến user {}: {}", userId, jsonMessage);
                } catch (IOException e) {
                    log.error("Lỗi khi gửi message tới user {}: {}", userId, e.getMessage());
                }
            }
        }
    }


}
