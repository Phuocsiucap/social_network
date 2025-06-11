package com.social_network.social_network.service;

import com.social_network.social_network.dto.ChatDTO;
import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.dto.response.ChatInfoDTO;
import com.social_network.social_network.dto.response.MessageResponse;
import com.social_network.social_network.entity.Chat;
import com.social_network.social_network.entity.User;
import com.social_network.social_network.mapper.ChatMapper;
import com.social_network.social_network.respository.ChatRepository;
import com.social_network.social_network.respository.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class ChatService {

    ChatRepository chatRepository;
    UserRepository userRepository;
    ChatMapper chatMapper;

    public ChatDTO createChat(List<String> userIds) {

        List<User> users = userRepository.findAllById(userIds);
        if(users.size() <= 1) {
            throw new IllegalArgumentException("a chat must contain at least 2 users");
        }

        boolean isGroupChat = users.size() >2;

        Chat chat  = new Chat();
        chat.setChatName(isGroupChat ? "Group Chat" : "Private Chat");
        chat.setIsGroupChat(isGroupChat);
        chat.setUsers(users);
        chat.setGroupAdmins(isGroupChat ? List.of(users.getFirst()) : new ArrayList<>()); // Optional: set first user as admin
        chat.setCreatedAt(LocalDateTime.now());
        chat.setUpdatedAt(LocalDateTime.now());

        return  chatMapper.toChatDTO(chatRepository.save(chat));
    }

    public List<ChatInfoDTO> getChatsForUser(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if(userOpt.isPresent()) {
            List<ChatInfoDTO> chatInfoDTOs = chatRepository.findAllByUsers_Id(userId)
                    .stream()
                    .map(chatMapper::toChatInfoDTO)
                    .collect(Collectors.toList());
            return chatInfoDTOs;
        } else {
            throw new NoSuchElementException("user not found");
        }
    }

    public MessageResponse sendMessage(MessageRequest messageRequest, String senderId) {
        Optional<User> user  = userRepository.findById(senderId);
        if(!user.isPresent()) {
            throw new NoSuchElementException("user not found");
        } else {
            MessageResponse messageResponse = chatMapper.toMessageResponse(messageRequest);
            messageResponse.setCreatedAt(LocalDateTime.now());
            messageResponse.setId(UUID.randomUUID().toString());
            return messageResponse;
        }
    }


    public List<String> getUserIdsByChatId(String chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new NoSuchElementException("Chat not found"));

        return chat.getUsers() // List<User>
                .stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

}

//public class MessageResponse {
//    private String id;
//    private String content;
//    private String senderId;
//    private String chatId;
//    private String messageType;
//    private String fileUrl;
//    private List<String> readByUserIds;
//    private LocalDateTime createdAt;
//}
//@NoArgsConstructor
//@AllArgsConstructor
//public class MessageRequest {
//    private String chatId;
//    private String senderId;
//    private String content;
//    private String messageType;
//    private String fileUrl;
//}