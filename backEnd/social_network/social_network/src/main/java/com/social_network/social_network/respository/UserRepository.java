package com.social_network.social_network.respository;

import com.social_network.social_network.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByEmail(String userEmail);

    Optional<User> findByEmail(String userEmail);
    Optional<User> findByUsername(String userName);

}

