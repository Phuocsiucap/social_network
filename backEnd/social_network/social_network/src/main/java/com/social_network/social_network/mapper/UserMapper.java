package com.social_network.social_network.mapper;

import com.social_network.social_network.dto.request.UserCreationRequest;
import com.social_network.social_network.dto.request.UserUpdateRequest;
import com.social_network.social_network.dto.response.UserInfoDTO;
import com.social_network.social_network.dto.response.UserResponse;
import com.social_network.social_network.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
    UserResponse toUserResponse(User user);

    UserInfoDTO toUserInfoDTO(User user);

    @Mapping(target = "id",ignore = true)
    @org.mapstruct.BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
