package com.social_network.social_network.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "messages")
public class Messages {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY)
    private User sender;

    private String content;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "messages_user",
            joinColumns = @JoinColumn(name = "messages_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> readBy;

    private String messageType; // text, image, file, etc
    private String fileUrl; // for file/image messages

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    private Boolean delivered;
}