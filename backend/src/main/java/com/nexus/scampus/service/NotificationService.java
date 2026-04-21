package com.nexus.scampus.service;

import com.nexus.scampus.dto.response.NotificationResponse;
import com.nexus.scampus.model.Notification;
import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.NotificationType;
import com.nexus.scampus.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
// contains business logic for managing notifications, sending , retrieving , counting unread, and marking read ones. 
// interacts with the NotificationRepository to perform database operations related to notifications.
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Sends a notification to a user with the specified type, title, message
    public void send(User recipient, NotificationType type, String title, String message,
                     Long referenceId, String referenceType) {
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

    // Retrieves the notifications for a specific user
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream().map(NotificationResponse::from).toList();
    }

    // Counts the number of unread notifications for a specific user
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    // Marks a specific notification as read for a user
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

    // Marks all notifications as read for a specific user
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }
}
