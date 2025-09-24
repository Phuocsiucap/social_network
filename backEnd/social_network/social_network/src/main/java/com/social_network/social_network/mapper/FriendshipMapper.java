package com.social_network.social_network.mapper;

import com.social_network.social_network.dto.FriendshipDTO;
import com.social_network.social_network.entity.Friendship;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {MessageMapper.class})
public interface FriendshipMapper {
    Friendship toFriendship(FriendshipDTO friendshipDTO);
    FriendshipDTO toFriendshipDTO(Friendship friendship);

}
