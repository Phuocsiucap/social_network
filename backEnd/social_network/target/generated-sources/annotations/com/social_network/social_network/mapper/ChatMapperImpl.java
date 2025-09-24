package com.social_network.social_network.mapper;

import com.social_network.social_network.dto.ChatDTO;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.dto.response.MessageUser;
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
    date = "2025-09-23T18:07:27+0700",
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
        chat.setLatestMessage( messageDTOToMessages( chatDTO.getLatestMessage() ) );

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
        chatDTO.setLatestMessage( messageMapper.toMessageDTO( chat.getLatestMessage() ) );

        return chatDTO;
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
        user.location( userInfoDTO.getLocation() );
        user.lastActive( userInfoDTO.getLastActive() );

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

    protected User messageUserToUser(MessageUser messageUser) {
        if ( messageUser == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.id( messageUser.getId() );
        user.username( messageUser.getUsername() );
        user.email( messageUser.getEmail() );
        user.status( messageUser.getStatus() );
        user.avatar( messageUser.getAvatar() );

        return user.build();
    }

    protected Messages messageDTOToMessages(MessageDTO messageDTO) {
        if ( messageDTO == null ) {
            return null;
        }

        Messages.MessagesBuilder messages = Messages.builder();

        messages.id( messageDTO.getId() );
        messages.sender( messageUserToUser( messageDTO.getSender() ) );
        messages.content( messageDTO.getContent() );
        messages.messageType( messageDTO.getMessageType() );
        messages.fileUrl( messageDTO.getFileUrl() );
        messages.createdAt( messageDTO.getCreatedAt() );
        messages.delivered( messageDTO.getDelivered() );
        messages.isRead( messageDTO.getIsRead() );

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
        userInfoDTO.location( user.getLocation() );
        userInfoDTO.lastActive( user.getLastActive() );

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
