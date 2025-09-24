package com.social_network.social_network.mapper;

import com.social_network.social_network.dto.FriendshipDTO;
import com.social_network.social_network.entity.Friendship;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-09-23T18:07:27+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class FriendshipMapperImpl implements FriendshipMapper {

    @Override
    public Friendship toFriendship(FriendshipDTO friendshipDTO) {
        if ( friendshipDTO == null ) {
            return null;
        }

        Friendship.FriendshipBuilder friendship = Friendship.builder();

        friendship.id( friendshipDTO.getId() );
        friendship.sender( friendshipDTO.getSender() );
        friendship.receiver( friendshipDTO.getReceiver() );
        friendship.updateAt( friendshipDTO.getUpdateAt() );
        friendship.status( friendshipDTO.getStatus() );

        return friendship.build();
    }

    @Override
    public FriendshipDTO toFriendshipDTO(Friendship friendship) {
        if ( friendship == null ) {
            return null;
        }

        FriendshipDTO friendshipDTO = new FriendshipDTO();

        friendshipDTO.setId( friendship.getId() );
        friendshipDTO.setStatus( friendship.getStatus() );
        friendshipDTO.setUpdateAt( friendship.getUpdateAt() );
        friendshipDTO.setSender( friendship.getSender() );
        friendshipDTO.setReceiver( friendship.getReceiver() );

        return friendshipDTO;
    }
}
