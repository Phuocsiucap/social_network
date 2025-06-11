package com.social_network.social_network.mapper;

import com.social_network.social_network.dto.ChatDTO;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-11T16:00:23+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class ChatMapperImpl implements ChatMapper {

    @Autowired
    private MessageMapper messageMapper;

    @Override
    public Chat toChat(ChatDTO chatDTO) {
        if ( chatDTO == null ) {
            return null;
        }

        Chat chat = new Chat();

        chat.setId( chatDTO.getId() );
        chat.setChatName( chatDTO.getChatName() );
        chat.setUsers( userInfoDTOListToUserList( chatDTO.getUsers() ) );

        return chat;
    }

    @Override
    public Chat toChat(ChatInfoDTO chatInfoDTO) {
        if ( chatInfoDTO == null ) {
            return null;
        }

        Chat chat = new Chat();

        chat.setId( chatInfoDTO.getId() );
        chat.setLatestMessage( messageDTOToMessages( chatInfoDTO.getLatestMessage() ) );

        return chat;
    }

    @Override
    public ChatDTO toChatDTO(Chat chat) {
        if ( chat == null ) {
            return null;
        }

        ChatDTO chatDTO = new ChatDTO();

        chatDTO.setId( chat.getId() );
        chatDTO.setChatName( chat.getChatName() );
        chatDTO.setUsers( userListToUserInfoDTOList( chat.getUsers() ) );

        return chatDTO;
    }

    @Override
    public ChatInfoDTO toChatInfoDTO(Chat chat) {
        if ( chat == null ) {
            return null;
        }

        ChatInfoDTO.ChatInfoDTOBuilder chatInfoDTO = ChatInfoDTO.builder();

        chatInfoDTO.id( chat.getId() );
        chatInfoDTO.latestMessage( messageMapper.toMessageDTO( chat.getLatestMessage() ) );

        return chatInfoDTO.build();
    }

    @Override
    public MessageResponse toMessageResponse(MessageRequest messageRequest) {
        if ( messageRequest == null ) {
            return null;
        }

        MessageResponse.MessageResponseBuilder messageResponse = MessageResponse.builder();

        messageResponse.content( messageRequest.getContent() );
        messageResponse.messageType( messageRequest.getMessageType() );
        messageResponse.fileUrl( messageRequest.getFileUrl() );

        return messageResponse.build();
    }

    protected User userInfoDTOToUser(UserInfoDTO userInfoDTO) {
        if ( userInfoDTO == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.id( userInfoDTO.getId() );
        user.username( userInfoDTO.getUsername() );
        user.email( userInfoDTO.getEmail() );
        user.status( userInfoDTO.getStatus() );
        user.avatar( userInfoDTO.getAvatar() );
        user.birthday( userInfoDTO.getBirthday() );
        user.gender( userInfoDTO.getGender() );
        user.biography( userInfoDTO.getBiography() );
        user.phone( userInfoDTO.getPhone() );

        return user.build();
    }

    protected List<User> userInfoDTOListToUserList(List<UserInfoDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<User> list1 = new ArrayList<User>( list.size() );
        for ( UserInfoDTO userInfoDTO : list ) {
            list1.add( userInfoDTOToUser( userInfoDTO ) );
        }

        return list1;
    }

    protected Messages messageDTOToMessages(MessageDTO messageDTO) {
        if ( messageDTO == null ) {
            return null;
        }

        Messages.MessagesBuilder messages = Messages.builder();

        messages.id( messageDTO.getId() );
        messages.sender( userInfoDTOToUser( messageDTO.getSender() ) );
        messages.content( messageDTO.getContent() );
        messages.createdAt( messageDTO.getCreatedAt() );

        return messages.build();
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
