package com.social_network.social_network.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;


@Getter
@Setter
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    private String username;
    private String email;
    private String avatar;
    private String birthday;
    private String gender;
    private String biography;
    private String phone;
}
