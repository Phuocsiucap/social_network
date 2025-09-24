package com.social_network.social_network.mapper;

import com.social_network.social_network.dto.WebSocketDataDTO;
import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.dto.response.MessageUser;
import com.social_network.social_network.entity.Messages;
import com.social_network.social_network.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-09-23T18:07:28+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class MessageMapperImpl implements MessageMapper {

    @Override
    public Messages toMessages(MessageRequest messageSend) {
        if ( messageSend == null ) {
            return null;
        }

        Messages.MessagesBuilder messages = Messages.builder();

        messages.content( messageSend.getContent() );
        messages.messageType( messageSend.getMessageType() );
        messages.fileUrl( messageSend.getFileUrl() );

        return messages.build();
    }

    @Override
    public MessageRequest toMessageRequest(String message) {
        if ( message == null ) {
            return null;
        }

        MessageRequest messageRequest = new MessageRequest();

        return messageRequest;
    }

    @Override
    public MessageDTO toMessageDTO(Messages messages) {
        if ( messages == null ) {
            return null;
        }

        MessageDTO.MessageDTOBuilder messageDTO = MessageDTO.builder();

        messageDTO.id( messages.getId() );
        messageDTO.sender( userToMessageUser( messages.getSender() ) );
        messageDTO.createdAt( messages.getCreatedAt() );
        messageDTO.content( messages.getContent() );
        messageDTO.messageType( messages.getMessageType() );
        messageDTO.fileUrl( messages.getFileUrl() );
        messageDTO.delivered( messages.getDelivered() );
        messageDTO.isRead( messages.getIsRead() );

        return messageDTO.build();
    }

    @Override
    public WebSocketDataDTO toWebSocketDataDTO(Messages messages) {
        if ( messages == null ) {
            return null;
        }

        WebSocketDataDTO webSocketDataDTO = new WebSocketDataDTO();

        webSocketDataDTO.setContent( messages.getContent() );
        webSocketDataDTO.setMessageType( messages.getMessageType() );
        webSocketDataDTO.setFileUrl( messages.getFileUrl() );
        webSocketDataDTO.setId( messages.getId() );
        webSocketDataDTO.setSender( userToMessageUser( messages.getSender() ) );
        webSocketDataDTO.setCreatedAt( messages.getCreatedAt() );
        webSocketDataDTO.setDelivered( messages.getDelivered() );
        webSocketDataDTO.setIsRead( messages.getIsRead() );

        return webSocketDataDTO;
    }

    protected MessageUser userToMessageUser(User user) {
        if ( user == null ) {
            return null;
        }

        MessageUser.MessageUserBuilder messageUser = MessageUser.builder();

        messageUser.id( user.getId() );
        messageUser.username( user.getUsername() );
        messageUser.email( user.getEmail() );
        messageUser.status( user.getStatus() );
        messageUser.avatar( user.getAvatar() );

        return messageUser.build();
    }
}
