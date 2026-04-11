package com.nexus.scampus.controller;

import com.nexus.scampus.dto.response.UserResponse;
import com.nexus.scampus.exception.ResourceNotFoundException;
import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.Role;
import com.nexus.scampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    /**
     * GET /api/admin/users — list all users.
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(UserResponse::from).toList());
    }

    /**
     * PATCH /api/admin/users/{id}/role — change a user's role.
     */
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable Long id,
                                                        @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        Role newRole = Role.valueOf(body.get("role").toUpperCase());
        user.setRole(newRole);
        return ResponseEntity.ok(UserResponse.from(userRepository.save(user)));
    }

    /**
     * GET /api/admin/stats — basic dashboard statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalUsers = userRepository.count();
        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers
        ));
    }
}
