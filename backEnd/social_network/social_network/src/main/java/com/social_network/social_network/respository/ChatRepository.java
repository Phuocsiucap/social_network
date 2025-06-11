package com.social_network.social_network.respository;

import com.social_network.social_network.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat,String> {
    List<Chat> findAllByUsers_Id(String userId);
}
