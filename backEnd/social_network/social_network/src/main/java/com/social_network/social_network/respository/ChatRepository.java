package com.social_network.social_network.respository;

import com.social_network.social_network.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface ChatRepository extends JpaRepository<Chat,String> {
    List<Chat> findAllByUsers_Id(String userId);

    @Query("SELECT c FROM Chat c JOIN c.users u1 JOIN c.users u2 " +
            "WHERE u1.id = :userId1 AND u2.id = :userId2 AND c.isGroupChat = false")
    Chat findDirectChatBetweenUsers(@Param("userId1") String userId1,
                                    @Param("userId2") String userId2);

}
