package com.nexus.scampus.controller;

import com.nexus.scampus.dto.response.NotificationResponse;
import com.nexus.scampus.security.UserPrincipal;
import com.nexus.scampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
// handles API requests related to user notifications, allowing users to view their notifications and mark them as read.
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    
    // GET /api/notifications — get current user's notifications.
    
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(notificationService.getMyNotifications(principal.getId()));
    }

   
    //GET /api/notifications/unread-count — get unread notification count.
    
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(principal.getId())));
    }

   
    // PATCH /api/notifications/{id}/read — mark a single notification as read.
     
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id,
                                            @AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAsRead(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    
    // PATCH /api/notifications/read-all — mark all notifications as read.
    
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.noContent().build();
    }
}
