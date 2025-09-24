
package com.social_network.social_network.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoDTO {
    private String id;
    private String username;
    private String email;
    private String status;
    private String avatar;
    private String birthday;
    private String gender;
    private String biography;
    private String phone;
    private String location;
    private LocalDateTime lastActive;
}
