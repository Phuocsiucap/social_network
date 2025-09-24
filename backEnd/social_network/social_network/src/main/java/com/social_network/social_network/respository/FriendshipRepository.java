package com.social_network.social_network.respository;

import com.social_network.social_network.dto.FriendshipDTO;
import com.social_network.social_network.entity.Friendship;
import com.social_network.social_network.entity.FriendshipStatus;
import com.social_network.social_network.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, String> {
//    List<FriendshipDTO> findAllByStatus(String userId,String status);
    Optional<Friendship> findBySenderAndReceiver(User sender, User receiver);



    // lay danh sách bạn bè đã kết bạn
    @Query("""
        select u from User u
             where u.id in (
                  select f.receiver.id from Friendship f
                       where f.sender.id = :userId and f.status = 'FRIEND'
                  union 
                  select f.sender.id from Friendship f 
                       where f.receiver.id = :userId and f.status = 'FRIEND'
             )
    """)
    Page<User> findFriendByUserId(@Param("userId") String userId,Pageable pageable);

    // lay danh sach nguoi da gui ket ban cho userid
    @Query("""
        select u from User u
            where u.id in (
                select f.sender.id from Friendship f
                where f.receiver.id = :userId and f.status = 'PENDING'
            )
    """)
    Page<User> findSentPendingFriendRequestByUserId(@Param("userId") String userId,Pageable pageable);

    // lay danh sach nguoi ma userId da gui loi moi ket ban cho nguoi khac
    @Query("""
        select u from User u
            where u.id in (
                select f.receiver.id from Friendship f
                    where f.sender.id = :userId and f.status = 'PENDING'
                )
    """)
    Page<User> findRecievedPendingFriendRequestByUserId(@Param("userId") String userId, Pageable pageable);

    // Tìm bạn bè (đã accepted)
    @Query("SELECT CASE WHEN f.sender.id = :userId THEN f.receiver ELSE f.sender END " +
            "FROM Friendship f " +
            "WHERE (f.sender.id = :userId OR f.receiver.id = :userId) " +
            "  AND f.status = 'FRIEND' " +
            "  AND (LOWER(f.sender.username) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "    OR LOWER(f.receiver.username) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "    OR LOWER(f.sender.email) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "    OR LOWER(f.receiver.email) LIKE LOWER(CONCAT('%', :query, '%')) )")
    Page<User> searchAcceptedFriends(@Param("query") String query,
                                     @Param("userId") String userId,
                                     Pageable pageable);

    // Tìm yêu cầu bạn bè đã gửi
    @Query("SELECT f.receiver FROM Friendship f " +
            "WHERE f.sender.id = :userId AND f.status = 'PENDING' " +
            "  AND (LOWER(f.receiver.username) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "    OR LOWER(f.receiver.email) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "    OR LOWER(f.receiver.phone) LIKE LOWER(CONCAT('%', :query, '%')) )")
    Page<User> searchSentRequests(@Param("query") String query,
                                  @Param("userId") String userId,
                                  Pageable pageable);

    // Tìm yêu cầu bạn bè đã nhận
    @Query("SELECT f.sender FROM Friendship f " +
            "WHERE f.receiver.id = :userId AND f.status = 'PENDING' " +
            "  AND (LOWER(f.sender.username) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "    OR LOWER(f.sender.email) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "    OR LOWER(f.sender.phone) LIKE LOWER(CONCAT('%', :query, '%')) )")
    Page<User> searchPendingRequests(@Param("query") String query,
                                     @Param("userId") String userId,
                                     Pageable pageable);

    @Query("SELECT f FROM Friendship f " +
            "WHERE (f.sender.id = :userId1 AND f.receiver.id = :userId2) " +
            "   OR (f.sender.id = :userId2 AND f.receiver.id = :userId1)")
    Optional<Friendship> findFriendshipBetweenUsers(@Param("userId1") String userId1,
                                                    @Param("userId2") String userId2);

    @Query("SELECT COUNT(f1) FROM Friendship f1 " +
            "JOIN Friendship f2 ON (f1.receiver.id = f2.receiver.id OR f1.receiver.id = f2.sender.id) " +
            "WHERE f1.status = 'FRIEND' AND f2.status = 'FRIEND' " +
            "AND (f1.sender.id = :userId1 OR f1.receiver.id = :userId1) " +
            "AND (f2.sender.id = :userId2 OR f2.receiver.id = :userId2)")
    int countMutualFriends(@Param("userId1") String userId1,
                           @Param("userId2") String userId2);


}
