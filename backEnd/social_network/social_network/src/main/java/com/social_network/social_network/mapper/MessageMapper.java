package com.social_network.social_network.mapper;

import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.dto.response.MessageResponse;
import com.social_network.social_network.entity.Messages;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface MessageMapper {
//    Messages toMessages(MessageRequest request);

    Messages toMessages(MessageRequest messageSend);
    MessageRequest toMessageRequest(String message);
    MessageDTO toMessageDTO(Messages messages);
    MessageResponse toMessageResponse(Messages message);

}
