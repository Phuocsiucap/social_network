package com.social_network.social_network.controller;


import com.social_network.social_network.dto.ChatDTO;
import com.social_network.social_network.dto.response.APIResponse;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.service.ChatService;
import com.social_network.social_network.service.MessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {
    private ChatService chatService;
    private MessageService messageService;

    @GetMapping
    public APIResponse<List<ChatDTO>> getChats() {
    APIResponse<List<ChatDTO>> response = new APIResponse<>();
        List<ChatDTO> chats = chatService.getChatsForUser();
        response.setResult(chats);
        return response;
    }

    @GetMapping("/{chatId}/messages")
    public APIResponse<Map<String, Object>> getChat(
            @PathVariable String chatId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit
    ) {
        System.out.println("📌 Received chatId = [" + chatId + "], page = " + page + ", limit = " + limit);

        Page<MessageDTO> messagePage = messageService.getMessagesOfChat(chatId, page, limit);

        Map<String, Object> rp = new HashMap<>();
        rp.put("data", messagePage.getContent());
        rp.put("hasMore", messagePage.hasNext());

        APIResponse<Map<String, Object>> response = new APIResponse<>();
        response.setResult(rp);
        return response;
    }



    @PostMapping("/getOrCreatChat")
    public APIResponse<ChatDTO> getOrCreateChat(@RequestBody Map<String, String> payload) {
        String friendId = payload.get("userId"); // phải đúng với key bên frontend gửi
        ChatDTO chat = chatService.getOrCreateChat(friendId);
        APIResponse<ChatDTO> response = new APIResponse<>();
        response.setResult(chat);
        return response;

    }

    @PostMapping("/create")
    public APIResponse<ChatDTO> createChat(@RequestBody List<String> userIds){
        return APIResponse.<ChatDTO>builder()
                .result(chatService.createChat(userIds))
                .build();
    }

    @PutMapping("/{chatId}/read")
    public APIResponse<String> markMessagesAsRead(@PathVariable String chatId) {
        messageService.markMessagesAsRead(chatId);
        return APIResponse.<String>builder()
                .result("Marked as read")
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
