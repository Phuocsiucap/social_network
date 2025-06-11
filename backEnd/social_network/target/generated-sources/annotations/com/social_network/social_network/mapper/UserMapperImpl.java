package com.social_network.social_network.mapper;

import com.social_network.social_network.dto.request.UserCreationRequest;
import com.social_network.social_network.dto.request.UserUpdateRequest;
import com.social_network.social_network.dto.response.UserInfoDTO;
import com.social_network.social_network.dto.response.UserResponse;
import com.social_network.social_network.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-11T16:00:24+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(UserCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.username( request.getUsername() );
        user.password( request.getPassword() );
        user.email( request.getEmail() );
        user.avatar( request.getAvatar() );
        user.birthday( request.getBirthday() );
        user.gender( request.getGender() );

        return user.build();
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.id( user.getId() );
        userResponse.username( user.getUsername() );
        userResponse.password( user.getPassword() );
        userResponse.email( user.getEmail() );
        userResponse.avatar( user.getAvatar() );
        userResponse.birthday( user.getBirthday() );
        userResponse.gender( user.getGender() );

        return userResponse.build();
    }

    @Override
    public UserInfoDTO toUserInfoDTO(User user) {
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

    @Override
    public void updateUser(User user, UserUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getUsername() != null ) {
            user.setUsername( request.getUsername() );
        }
        if ( request.getEmail() != null ) {
            user.setEmail( request.getEmail() );
        }
        if ( request.getAvatar() != null ) {
            user.setAvatar( request.getAvatar() );
        }
        if ( request.getBirthday() != null ) {
            user.setBirthday( request.getBirthday() );
        }
        if ( request.getGender() != null ) {
            user.setGender( request.getGender() );
        }
        if ( request.getBiography() != null ) {
            user.setBiography( request.getBiography() );
        }
        if ( request.getPhone() != null ) {
            user.setPhone( request.getPhone() );
        }
    }
}
