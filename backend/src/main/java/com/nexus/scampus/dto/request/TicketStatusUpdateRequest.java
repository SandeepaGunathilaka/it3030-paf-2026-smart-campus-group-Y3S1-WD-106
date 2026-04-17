package com.nexus.scampus.dto.request;

import com.nexus.scampus.model.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record TicketStatusUpdateRequest(
        @NotNull(message = "Status is required")
        TicketStatus status,

        String resolutionNotes,

        String rejectionReason
) {
}