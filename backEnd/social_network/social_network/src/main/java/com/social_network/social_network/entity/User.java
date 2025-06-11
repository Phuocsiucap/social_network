package com.social_network.social_network.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    private String username;
    private String password;
    private String email;
    private String status;
    private String avatar;
    private String birthday;
    private String gender;
    private String biography;
    private String phone;

    private LocalDateTime lastActive;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}