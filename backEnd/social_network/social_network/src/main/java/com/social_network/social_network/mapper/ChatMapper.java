package com.social_network.social_network.mapper;

import com.social_network.social_network.dto.ChatDTO;
import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.entity.Chat;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {MessageMapper.class})
public interface ChatMapper {
    Chat toChat(ChatDTO chatDTO);

    ChatDTO toChatDTO(Chat chat);

}
