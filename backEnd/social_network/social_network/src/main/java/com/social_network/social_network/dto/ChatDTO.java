package com.social_network.social_network.dto;


import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.dto.response.UserInfoDTO;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatDTO {
    private String id;
    private String chatName;
    private boolean isGroupChat;
    private List<UserInfoDTO> users;
    private List<UserInfoDTO> admins;
    private MessageDTO latestMessage;
}