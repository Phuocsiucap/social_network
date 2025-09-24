package com.social_network.social_network.controller;


import com.social_network.social_network.dto.response.APIResponse;

import com.social_network.social_network.dto.response.UserInfoDTO;
import com.social_network.social_network.service.FriendService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendController {
    private FriendService friendService;

    @GetMapping
    public APIResponse<Map<String, Object>> getFriend(
            @RequestParam String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit
    ) {
        System.out.println("📌 Received userid = [" + userId + "], page = " + page + ", limit = " + limit);

        Page<UserInfoDTO> friendPage = friendService.getAllFriend(userId, page, limit);

        Map<String, Object> rp = Map.of(
                "data", friendPage.getContent(),
                "hasMore", friendPage.hasNext()
        );

        APIResponse<Map<String, Object>> response = new APIResponse<>();
        response.setResult(rp);
        return response;
    }

    @GetMapping("/request")
    public APIResponse<Map<String, Object>> getFriendsRequest(

            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit
    ) {
        System.out.println("📌 Received  page = " + page + ", limit = " + limit);

        Page<UserInfoDTO> friendPage = friendService.getAllFriendRequest( page, limit);

        Map<String, Object> rp = Map.of(
                "data", friendPage.getContent(),
                "hasMore", friendPage.hasNext()
        );

        APIResponse<Map<String, Object>> response = new APIResponse<>();
        response.setResult(rp);
        return response;
    }

    @GetMapping("/sent")
    public APIResponse<Map<String, Object>> getFriendsSent(

            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit
    ) {
        System.out.println("📌 Received  page = " + page + ", limit = " + limit);

        Page<UserInfoDTO> friendPage = friendService.getAllFriendSent( page, limit);

        Map<String, Object> rp = Map.of(
                "data", friendPage.getContent(),
                "hasMore", friendPage.hasNext()
        );

        APIResponse<Map<String, Object>> response = new APIResponse<>();
        response.setResult(rp);
        return response;
    }

    private boolean isValidFilter(String filter) {
        return filter != null && (
                filter.equals("friend") ||
                        filter.equals("sent") ||
                        filter.equals("pending")
        );
    }
    @GetMapping("/search")
    public APIResponse<Map<String, Object>> searchFriends(
            @RequestParam String query,
            @RequestParam(required = false) String filter,

            @RequestParam(defaultValue = "20") int limit
    ) {
        System.out.println("📌 Search - query = [" + query + "], filter = [" + filter +
                "], limit = " + limit);

        // Validate parameters
        if (query == null || query.trim().isEmpty()) {
            APIResponse<Map<String, Object>> response = new APIResponse<>();
            response.setMessage("Query không được để trống");
            response.setCode(400);
            return response;
        }

//        if (!isValidFilter(filter)) {
//            APIResponse<Map<String, Object>> response = new APIResponse<>();
//            response.setMessage("Filter không hợp lệ. Chỉ chấp nhận: friend, sent, pending");
//            response.setCode(400);
//            return response;
//        }

        try {
            Page<UserInfoDTO> searchResults = friendService.searchFriends(
                    query.trim(), filter, limit
            );

            Map<String, Object> rp = Map.of(
                    "data", searchResults.getContent(),
                    "hasMore", searchResults.hasNext(),
                    "total", searchResults.getTotalElements()
            );

            APIResponse<Map<String, Object>> response = new APIResponse<>();
            response.setResult(rp);
            response.setMessage("Tìm kiếm thành công");
            return response;

        } catch (Exception e) {
            System.err.println("❌ Search error: " + e.getMessage());
            APIResponse<Map<String, Object>> response = new APIResponse<>();
            response.setMessage("Có lỗi xảy ra khi tìm kiếm: " + e.getMessage());
            response.setCode(500);
            return response;
        }
    }


    @GetMapping("/{targetId}")
    public APIResponse<Map<String, Object>> getFriendDetail(@PathVariable String targetId) {
        try {
            Map<String, Object> detail = friendService.getFriendDetail(targetId);

            APIResponse<Map<String, Object>> response = new APIResponse<>();
            response.setResult(detail);
            response.setMessage("Lấy chi tiết bạn bè thành công");
            return response;

        } catch (Exception e) {
            APIResponse<Map<String, Object>> response = new APIResponse<>();
            response.setMessage("Lỗi khi lấy chi tiết bạn bè: " + e.getMessage());
            response.setCode(500);
            return response;
        }
    }


}
