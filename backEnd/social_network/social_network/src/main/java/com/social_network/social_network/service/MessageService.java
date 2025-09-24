package com.social_network.social_network.service;


import com.social_network.social_network.dto.WebSocketDataDTO;
import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.entity.Chat;
import com.social_network.social_network.entity.Messages;
import com.social_network.social_network.entity.User;
import com.social_network.social_network.mapper.ChatMapper;
import com.social_network.social_network.mapper.MessageMapper;
import com.social_network.social_network.respository.ChatRepository;
import com.social_network.social_network.respository.MessageRepository;
import com.social_network.social_network.respository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class MessageService {

    MessageRepository messageRepository;
    UserRepository userRepository;

    MessageMapper messageMapper;
    ChatRepository chatRepository;
    private final ChatMapper chatMapper;


    public WebSocketDataDTO saveMessage(MessageRequest messageSend, String senderId) {
        Optional<User> useropt = userRepository.findById(senderId);
        Optional<Chat> chatOpt = chatRepository.findById(messageSend.getChatId());
        if (useropt.isEmpty()) {
            log.error("khong tim thay user co id la {}", senderId);
            return null;
        }

        User user = useropt.get();
        Chat chat = chatOpt.get();

        Messages message = messageMapper.toMessages(messageSend);
        message.setSender(user);
        message.setChat(chat);
        message.setDelivered(false);
        message.setCreatedAt(LocalDateTime.now());

        Messages savedMessage = messageRepository.save(message);
        chat.setLatestMessage(savedMessage);
        chatRepository.save(chat);
        WebSocketDataDTO messageResponse = messageMapper.toWebSocketDataDTO(savedMessage);
        return messageResponse;
    }

    public Page<MessageDTO> getMessagesOfChat(String chatId, int page, int limit) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("❌ Chat not found with id: " + chatId));

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Messages> messagePage = messageRepository.findAllByChat_Id(chat.getId(), pageable);

        // Map entity → DTO, rồi wrap lại bằng PageImpl để giữ phân trang
        List<MessageDTO> dtos = messagePage.getContent().stream()
                .map(messageMapper::toMessageDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, messagePage.getTotalElements());
    }



    public void updateDeliveryStatus(MessageDTO message) {
        Messages messages = messageRepository.getById(message.getId());
        messages.setDelivered(message.getDelivered());
        messageRepository.save(messages);
    }

    public void markMessagesAsRead(String chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        List<Messages> unreadMessages = messageRepository.findAllByChat_IdAndIsReadFalse(chatId);
        for (Messages message : unreadMessages) {
            message.setIsRead(true);
            message.setDelivered(true); // Nếu muốn cập nhật luôn delivered
        }
        messageRepository.saveAll(unreadMessages);
    }



}
