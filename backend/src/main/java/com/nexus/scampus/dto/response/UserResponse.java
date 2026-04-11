package com.nexus.scampus.dto.response;

import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.Role;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String email,
        String name,
        String pictureUrl,
        Role role,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPictureUrl(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
