package com.nexus.scampus.dto.response;

import com.nexus.scampus.model.Ticket;
import com.nexus.scampus.model.enums.TicketCategory;
import com.nexus.scampus.model.enums.TicketPriority;
import com.nexus.scampus.model.enums.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public record TicketResponse(
        Long id,
        Long reporterId,
        String reporterName,
        Long assignedToId,
        String assignedToName,
        Long resourceId,
        String resourceName,
        String title,
        String description,
        TicketCategory category,
        TicketPriority priority,
        TicketStatus status,
        String location,
        String contactDetails,
        String resolutionNotes,
        String rejectionReason,
        List<TicketAttachmentResponse> attachments,
        List<TicketCommentResponse> comments,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TicketResponse from(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getReporter().getId(),
                ticket.getReporter().getName(),
                ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : null,
                ticket.getAssignedTo() != null ? ticket.getAssignedTo().getName() : null,
                ticket.getResource() != null ? ticket.getResource().getId() : null,
                ticket.getResource() != null ? ticket.getResource().getName() : null,
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getLocation(),
                ticket.getContactDetails(),
                ticket.getResolutionNotes(),
                ticket.getRejectionReason(),
                ticket.getAttachments().stream()
                        .map(TicketAttachmentResponse::from)
                        .toList(),
                ticket.getComments().stream()
                        .map(TicketCommentResponse::from)
                        .toList(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }
}