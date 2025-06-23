
package com.social_network.social_network.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageUser {
    private String id;
    private String username;
    private String email;
    private String status;
    private String avatar;
}
