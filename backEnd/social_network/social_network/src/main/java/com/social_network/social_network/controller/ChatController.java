package com.social_network.social_network.controller;


import com.social_network.social_network.dto.ChatDTO;
import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.dto.response.APIResponse;
import com.social_network.social_network.dto.response.ChatInfoDTO;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.dto.response.MessageResponse;
import com.social_network.social_network.entity.Chat;
import com.social_network.social_network.service.ChatService;
import com.social_network.social_network.service.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {
    private ChatService chatService;
    private MessageService messageService;

    @GetMapping("/{userId}")
    public APIResponse<List<ChatInfoDTO>> getChats(@PathVariable String userId) {
    APIResponse<List<ChatInfoDTO>> response = new APIResponse<>();
        List<ChatInfoDTO> chats = chatService.getChatsForUser(userId);
        response.setResult(chats);
        return response;
    }

    @GetMapping("/getchat/{chatId}")
    public APIResponse<List<MessageDTO>> getChat(@PathVariable String chatId) {
        APIResponse<List<MessageDTO>> response = new APIResponse<>();
        List<MessageDTO> messages = messageService.getMessagesOfChat(chatId);
        response.setResult(messages);
        return response;
    }

    @PostMapping("/create")
    public APIResponse<ChatDTO> createChat(@RequestBody List<String> userIds){
        return APIResponse.<ChatDTO>builder()
                .result(chatService.createChat(userIds))
                .build();
    }
//    @PostMapping("/sendmessage")
//    public APIResponse<MessageResponse> sendMessage(@RequestBody MessageRequest messageRequest){
//        MessageResponse messageResponse = chatService.sendMessage(messageRequest);
//        return APIResponse.<MessageResponse>builder()
//                .result(messageResponse)
//                .build();
//    }

//    @GetMapping
//    public "APIResponse"<List<ChatDTO>> getMyChats(){
//        // Lấy userId từ JWT -> trả về danh sách chat
//    }
}
