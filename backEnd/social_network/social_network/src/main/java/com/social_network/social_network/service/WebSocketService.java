package com.social_network.social_network.service;

import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.entity.Chat;
import com.social_network.social_network.entity.Messages;
import com.social_network.social_network.entity.User;
import com.social_network.social_network.mapper.MessageMapper;
import com.social_network.social_network.respository.ChatRepository;
import com.social_network.social_network.respository.MessageRepository;
import com.social_network.social_network.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private  SimpMessagingTemplate messagingTemplate;

    private  MessageMapper messageMapper;

    public void sendMessage(MessageRequest request, String senderId) {
//        Messages messages = messageMapper.toMessages(request);
        saveMessage(request,senderId);
        messagingTemplate.convertAndSend("/topic/messages" + request.getChatId(), request);

    }

    public void saveMessage(MessageRequest request, String senderId) {
        Optional<Chat> chatOpt = chatRepository.findById(request.getChatId());
        Optional<User> sender = userRepository.findById(senderId);

        if(chatOpt.isPresent() && sender.isPresent()) {
            Messages messages =new Messages();
            messages = messageMapper.toMessages(request);
            messages.setChat(chatOpt.get());
            messages.setSender(sender.get());

            Messages saveMessage = messageRepository.save(messages);

            //update letest message in chat
            Chat chat = chatOpt.get();
            chat.setLatestMessage(saveMessage);
            chat.setUpdatedAt(LocalDateTime.now());
            chatRepository.save(chat);
        } else {
            throw new RuntimeException("chat or sender not found");
        }
    }
}
