
package com.social_network.social_network.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendUser {
    private String id;
    private String username;
    private String email;
    private String status;
    private String avatar;
    private String birthday;
    private String gender;
    private String biography;
    private String phone;
    private int mutualCount;
}
