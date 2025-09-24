package com.social_network.social_network.dto;

import com.social_network.social_network.entity.User;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendshipDTO {
    String id;
    String status;
    LocalDateTime updateAt;
    User sender;
    User receiver;
}
