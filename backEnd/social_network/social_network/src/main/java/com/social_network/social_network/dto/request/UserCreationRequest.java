package com.social_network.social_network.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    private String username;
    private String password;
    private String email;
    private String nickname;
    private String avatar;
    private String birthday;
    private String gender;

}
