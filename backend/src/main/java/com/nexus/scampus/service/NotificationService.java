package com.nexus.scampus.service;

import com.nexus.scampus.dto.response.NotificationResponse;
import com.nexus.scampus.model.Notification;
import com.nexus.scampus.model.NotificationPreference;
import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.NotificationType;
import com.nexus.scampus.repository.NotificationPreferenceRepository;
import com.nexus.scampus.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;

    // Maps a NotificationType to its preference category
    private String categoryFor(NotificationType type) {
        return switch (type) {
            case BOOKING_APPROVED, BOOKING_REJECTED, BOOKING_CANCELLED -> "BOOKING";
            case TICKET_STATUS_CHANGED, TICKET_COMMENT_ADDED, TICKET_ASSIGNED -> "TICKET";
            case ACCOUNT_APPROVED, ACCOUNT_REJECTED -> "ACCOUNT";
        };
    }

    // Checks preference before saving — defaults to enabled if no preference row exists
    public void send(User recipient, NotificationType type, String title, String message,
                     Long referenceId, String referenceType) {
        String category = categoryFor(type);
        Optional<NotificationPreference> pref = preferenceRepository
                .findByUserIdAndCategory(recipient.getId(), category);
        if (pref.isPresent() && !pref.get().getEnabled()) return;
    
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .title(title)
                .message(message)
                .isRead(false)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream().map(NotificationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new com.nexus.scampus.exception.ResourceNotFoundException("Notification", notificationId));
        if (!notification.getRecipient().getId().equals(userId)) {
            throw new com.nexus.scampus.exception.UnauthorizedException("Cannot mark another user's notification as read");
        }
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }
}
