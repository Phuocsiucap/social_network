package com.social_network.social_network.mapper;

import com.social_network.social_network.dto.request.MessageRequest;
import com.social_network.social_network.dto.response.ChatInfoDTO;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.dto.response.MessageResponse;
import com.social_network.social_network.dto.response.UserInfoDTO;
import com.social_network.social_network.entity.Chat;
import com.social_network.social_network.entity.Messages;
import com.social_network.social_network.entity.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-11T16:00:24+0700",
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
        messageDTO.sender( userToUserInfoDTO( messages.getSender() ) );
        messageDTO.createdAt( messages.getCreatedAt() );
        messageDTO.content( messages.getContent() );

        return messageDTO.build();
    }

    @Override
    public MessageResponse toMessageResponse(Messages message) {
        if ( message == null ) {
            return null;
        }

        MessageResponse.MessageResponseBuilder messageResponse = MessageResponse.builder();

        messageResponse.id( message.getId() );
        messageResponse.chat( chatToChatInfoDTO( message.getChat() ) );
        messageResponse.sender( userToUserInfoDTO( message.getSender() ) );
        messageResponse.content( message.getContent() );
        messageResponse.readBy( userListToUserInfoDTOList( message.getReadBy() ) );
        messageResponse.messageType( message.getMessageType() );
        messageResponse.fileUrl( message.getFileUrl() );
        messageResponse.createdAt( message.getCreatedAt() );
        messageResponse.updatedAt( message.getUpdatedAt() );
        messageResponse.delivered( message.getDelivered() );

        return messageResponse.build();
    }

    protected UserInfoDTO userToUserInfoDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserInfoDTO.UserInfoDTOBuilder userInfoDTO = UserInfoDTO.builder();

        userInfoDTO.id( user.getId() );
        userInfoDTO.username( user.getUsername() );
        userInfoDTO.email( user.getEmail() );
        userInfoDTO.status( user.getStatus() );
        userInfoDTO.avatar( user.getAvatar() );
        userInfoDTO.birthday( user.getBirthday() );
        userInfoDTO.gender( user.getGender() );
        userInfoDTO.biography( user.getBiography() );
        userInfoDTO.phone( user.getPhone() );

        return userInfoDTO.build();
    }

    protected ChatInfoDTO chatToChatInfoDTO(Chat chat) {
        if ( chat == null ) {
            return null;
        }

        ChatInfoDTO.ChatInfoDTOBuilder chatInfoDTO = ChatInfoDTO.builder();

        chatInfoDTO.id( chat.getId() );
        chatInfoDTO.latestMessage( toMessageDTO( chat.getLatestMessage() ) );

        return chatInfoDTO.build();
    }

    protected List<UserInfoDTO> userListToUserInfoDTOList(List<User> list) {
        if ( list == null ) {
            return null;
        }

        List<UserInfoDTO> list1 = new ArrayList<UserInfoDTO>( list.size() );
        for ( User user : list ) {
            list1.add( userToUserInfoDTO( user ) );
        }

        return list1;
    }
}
