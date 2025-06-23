package com.social_network.social_network.service;

import com.social_network.social_network.dto.ChatDTO;
import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.entity.Chat;
import com.social_network.social_network.entity.User;
import com.social_network.social_network.exception.AppException;
import com.social_network.social_network.exception.ErrorCode;
import com.social_network.social_network.mapper.ChatMapper;
import com.social_network.social_network.respository.ChatRepository;
import com.social_network.social_network.respository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
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

    public ChatDTO getOrCreateChat(String friendId) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Tìm xem đã có chat giữa 2 người chưa
        Chat chat = chatRepository.findDirectChatBetweenUsers(userId, friendId);

        if (chat == null) {
            chat = new Chat();
            chat.setId(UUID.randomUUID().toString());
            chat.setIsGroupChat(false);
            chat.setUsers(Arrays.asList(user, friend));
            chat.setCreatedAt(LocalDateTime.now());
            chat.setUpdatedAt(LocalDateTime.now());
        }

        return chatMapper.toChatDTO(chatRepository.save(chat));
    }

    public List<ChatDTO> getChatsForUser() {
        String userId =(String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> userOpt = userRepository.findById(userId);
        if(userOpt.isPresent()) {
            List<ChatDTO> chatDTOs = chatRepository.findAllByUsers_Id(userId)
                    .stream()
                    .map(chatMapper::toChatDTO)
                    .collect(Collectors.toList());
            return chatDTOs;
        } else {
            throw new NoSuchElementException("user not found");
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

