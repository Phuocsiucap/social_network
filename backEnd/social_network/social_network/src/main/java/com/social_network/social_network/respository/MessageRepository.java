package com.social_network.social_network.respository;

import com.social_network.social_network.entity.Messages;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Messages,String> {
    List<Messages> findAllByChat_Id(String chatId, Limit limit);


}
