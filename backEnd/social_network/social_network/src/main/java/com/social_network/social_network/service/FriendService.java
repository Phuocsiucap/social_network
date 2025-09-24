package com.social_network.social_network.service;

import com.social_network.social_network.dto.FriendshipDTO;
import com.social_network.social_network.dto.response.MessageDTO;
import com.social_network.social_network.dto.response.UserInfoDTO;
import com.social_network.social_network.entity.Friendship;
import com.social_network.social_network.entity.FriendshipStatus;
import com.social_network.social_network.entity.User;
import com.social_network.social_network.exception.AppException;
import com.social_network.social_network.exception.ErrorCode;
import com.social_network.social_network.mapper.FriendshipMapper;
import com.social_network.social_network.mapper.UserMapper;
import com.social_network.social_network.respository.FriendshipRepository;
import com.social_network.social_network.respository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendService {
    UserRepository userRepository;
    FriendshipRepository friendshipRepository;
    UserMapper userMapper;
    FriendshipMapper friendshipMapper;

    // gui yeu cau ket ban
    public FriendshipDTO addFriendRequest(String senderId, String receiverId) {
        log.info("Processing friend request from {} to {}", senderId, receiverId);

        // Check if sender and receiver exist
        Optional<User> senderOpt = userRepository.findById(senderId);
        Optional<User> receiverOpt = userRepository.findById(receiverId);

        // Fixed logic: throw exception if either user is NOT found
        if (senderOpt.isEmpty()) {
            log.error("Sender not found: {}", senderId);
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        if (receiverOpt.isEmpty()) {
            log.error("Receiver not found: {}", receiverId);
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        User sender = senderOpt.get();
        User receiver = receiverOpt.get();
        // Check if trying to add themselves
        if (senderId.equals(receiverId)) {
            log.error("User {} trying to add themselves as friend", senderId);
            throw new AppException(ErrorCode.CANNOT_ADD_YOURSELF);
        }
        // Check if friendship already exists (in either direction)
        Optional<Friendship> existingFriendship = friendshipRepository
                .findBySenderAndReceiver(sender, receiver);

        if (existingFriendship.isPresent()) {
            Friendship friendship = existingFriendship.get();
            if (friendship.getStatus() == FriendshipStatus.PENDING.toString()) {
                log.error("Friend request already sent from {} to {}", senderId, receiverId);
                throw new AppException(ErrorCode.FRIEND_REQUEST_ALREADY_SENT);
            } else if (friendship.getStatus() == FriendshipStatus.FRIEND.toString()) {
                log.error("Users {} and {} are already friends", senderId, receiverId);
                throw new AppException(ErrorCode.ALREADY_FRIENDS);
            }
        }

        // Create new friendship request
        Friendship friendship = new Friendship();
        friendship.setSender(sender);
        friendship.setReceiver(receiver);
        friendship.setStatus(FriendshipStatus.PENDING.toString()); // Make sure to set status
        friendship.setCreateAt(LocalDateTime.now()); // Set creation time

        Friendship savedFriendship = friendshipRepository.save(friendship);
        FriendshipDTO friendshipDTO = friendshipMapper.toFriendshipDTO(savedFriendship);

        log.info("Friend request sent successfully from {} to {}", senderId, receiverId);
        return friendshipDTO;
    }

    public Page<UserInfoDTO> getAllFriend(String userId, int page, int limit) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<User> list = friendshipRepository.findFriendByUserId(userId,  pageable);

        // Map entity → DTO, rồi wrap lại bằng PageImpl để giữ phân trang
        List<UserInfoDTO> dtos = list.getContent().stream()
                .map(userMapper::toUserInfoDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, list.getTotalElements());
    }

    public Page<UserInfoDTO> getAllFriendRequest(int page, int limit) {
        String userId =(String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<User> list = friendshipRepository.findSentPendingFriendRequestByUserId(userId,  pageable);

        // Map entity → DTO, rồi wrap lại bằng PageImpl để giữ phân trang
        List<UserInfoDTO> dtos = list.getContent().stream()
                .map(userMapper::toUserInfoDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, list.getTotalElements());
    }

    public Page<UserInfoDTO> getAllFriendSent(int page, int limit) {
        String userId =(String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<User> list = friendshipRepository.findRecievedPendingFriendRequestByUserId(userId,  pageable);

        // Map entity → DTO, rồi wrap lại bằng PageImpl để giữ phân trang
        List<UserInfoDTO> dtos = list.getContent().stream()
                .map(userMapper::toUserInfoDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, list.getTotalElements());
    }

    public Page<UserInfoDTO> searchFriends(String query, String filter, int limit) {
        String userId =(String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Pageable pageable = PageRequest.of(0, limit);

        Page<User> users;
        if (filter.equals("null") || filter.isEmpty()) {
            // Không có filter → tìm toàn bộ user (trừ bản thân)
            users = userRepository.searchUsers(query, pageable)
                    .map(u -> u.getId().equals(userId) ? null : u);
        } else {
            switch (filter.toLowerCase()) {
                case "friend":

                    users = friendshipRepository.searchAcceptedFriends(query, userId, pageable);
                    break;
                case "sent":

                    users = friendshipRepository.searchSentRequests(query, userId, pageable);
                    break;
                case "pending":
                    users = friendshipRepository.searchPendingRequests(query, userId, pageable);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid filter: " + filter);
            }
        }

        List<UserInfoDTO> dtos = users.getContent().stream()
                .map(userMapper::toUserInfoDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, users.getTotalElements());
    }


    public Map<String, Object> getFriendDetail(String targetUserId) {
        String currentUserId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 1. Tìm user target
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Tìm trạng thái quan hệ
        Optional<Friendship> friendshipOpt = friendshipRepository.findFriendshipBetweenUsers(currentUserId, targetUserId);

        String status;
        if (friendshipOpt.isEmpty()) {
            status = "NOT_FRIEND";
        }
        else {
            status = friendshipOpt.get().getStatus(); // PENDING / FRIEND / REJECTED
            if (status.equals("PENDING") && currentUserId.equals(friendshipOpt.get().getSender().getId())) {
                status = "SENT";
            }
        }

        // 3. Đếm bạn chung
        int mutualCount = friendshipRepository.countMutualFriends(currentUserId, targetUserId);

        // 4. Map sang DTO
        UserInfoDTO userDTO = userMapper.toUserInfoDTO(targetUser);

        // 5. Trả về map
        Map<String, Object> result = new HashMap<>();
        result.put("user", userDTO);
        result.put("status", status);
        result.put("mutualFriends", mutualCount);

        return result;
    }

    public boolean removeFriend(String currentUserid,String targetUserId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Optional<Friendship> friendshipOpt = friendshipRepository.findFriendshipBetweenUsers(currentUserid, targetUserId);
        String status;
        if (!friendshipOpt.isEmpty()) {
            Friendship friendship = friendshipOpt.get();
            friendshipRepository.delete(friendship);
            return true;
        }
        return false;
    }

    public FriendshipDTO acceptFriendship(String currentUserId, String targetUserId) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findFriendshipBetweenUsers(targetUserId, currentUserId);

        if (friendshipOpt.isEmpty()) {
            throw new AppException(ErrorCode.FRIEND_REQUEST_NOT_FOUND);
        }

        Friendship friendship = friendshipOpt.get();
        if (!friendship.getStatus().equals(FriendshipStatus.PENDING.toString())) {
            throw new AppException(ErrorCode.INVALID_FRIEND_REQUEST_STATUS);
        }

        friendship.setStatus(FriendshipStatus.FRIEND.toString());
        friendship.setUpdateAt(LocalDateTime.now());
        Friendship result = friendshipRepository.save(friendship);

        return friendshipMapper.toFriendshipDTO(result);
    }


}
