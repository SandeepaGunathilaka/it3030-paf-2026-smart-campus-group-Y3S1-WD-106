package com.nexus.scampus.controller;

import com.nexus.scampus.dto.response.UserResponse;
import com.nexus.scampus.exception.ResourceNotFoundException;
import com.nexus.scampus.model.User;
import com.nexus.scampus.repository.UserRepository;
import com.nexus.scampus.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    // Injects the UserRepository to fetch user details for the authenticated user.
    private final UserRepository userRepository;

    
    // GET /api/auth/me — returns the currently authenticated user's profile.
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getId()));
        return ResponseEntity.ok(UserResponse.from(user));
    }
}
