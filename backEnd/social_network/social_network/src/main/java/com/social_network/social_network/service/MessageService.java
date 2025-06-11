package com.social_network.social_network.service;


import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.dto.response.ChatInfoDTO;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.dto.response.MessageResponse;
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
import org.springframework.data.domain.Limit;
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


    public MessageResponse sendMessage(MessageRequest messageSend, String senderId) {
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
        MessageResponse messageResponse = messageMapper.toMessageResponse(savedMessage);
        return messageResponse;
    }

    public List<MessageDTO> getMessagesOfChat(String chatId) {
        Chat chat = chatRepository.findById(chatId).get();

        List<Messages> messages = messageRepository.findAllByChat_Id(chat.getId(), Limit.of(13));
        return messages.stream().map(messageMapper::toMessageDTO).collect(Collectors.toList());
    }
    public void updateDeliveryStatus(MessageResponse message) {
        Messages messages = messageRepository.getById(message.getId());
        messages.setDelivered(message.getDelivered());
        messageRepository.save(messages);
    }


}
