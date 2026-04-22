package com.nexus.scampus.controller;

import com.nexus.scampus.model.NotificationPreference;
import com.nexus.scampus.model.User;
import com.nexus.scampus.repository.NotificationPreferenceRepository;
import com.nexus.scampus.repository.UserRepository;
import com.nexus.scampus.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications/preferences")
@RequiredArgsConstructor
public class NotificationPreferenceController {

    private static final List<String> CATEGORIES = List.of("BOOKING", "TICKET", "ACCOUNT");

    private final NotificationPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    // GET /api/notifications/preferences — returns all categories with enabled status
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getPreferences(
            @AuthenticationPrincipal UserPrincipal principal) {
        Map<String, Boolean> saved = preferenceRepository.findByUserId(principal.getId())
                .stream()
                .collect(Collectors.toMap(NotificationPreference::getCategory,
                                          NotificationPreference::getEnabled));

        List<Map<String, Object>> result = CATEGORIES.stream()
                .map(cat -> Map.<String, Object>of(
                        "category", cat,
                        "enabled", saved.getOrDefault(cat, true)))
                .toList();

        return ResponseEntity.ok(result);
    }

    // PUT /api/notifications/preferences — update a single category preference
    @PutMapping
    public ResponseEntity<Void> updatePreference(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> body) {
        String category = (String) body.get("category");
        Boolean enabled = (Boolean) body.get("enabled");

        if (!CATEGORIES.contains(category) || enabled == null)
            return ResponseEntity.badRequest().build();

        User user = userRepository.findById(principal.getId()).orElseThrow();

        NotificationPreference pref = preferenceRepository
                .findByUserIdAndCategory(principal.getId(), category)
                .orElseGet(() -> NotificationPreference.builder().user(user).category(category).build());
        pref.setEnabled(enabled);
        preferenceRepository.save(pref);

        return ResponseEntity.noContent().build();
    }
}
