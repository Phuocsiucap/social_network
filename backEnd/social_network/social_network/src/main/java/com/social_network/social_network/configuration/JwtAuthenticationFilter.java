package com.social_network.social_network.configuration;

import com.social_network.social_network.exception.AppException;
import com.social_network.social_network.exception.ErrorCode;
import com.social_network.social_network.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                try {
                    String userId = jwtUtil.getUserIdFromToken(token);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userId, null, new ArrayList<>());

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (ParseException e) {
                    throw new AppException(ErrorCode.UNAUTHENTICATED); // Token sai format
                } catch (Exception e) {
                    throw new AppException(ErrorCode.UNAUTHORIZED); // Token hợp lệ nhưng không lấy được user
                }
            } else {
                throw new AppException(ErrorCode.UNAUTHENTICATED); // Token không hợp lệ
            }
        }

        filterChain.doFilter(request, response);
    }

}
