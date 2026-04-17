package com.nexus.scampus.dto.request;

import jakarta.validation.constraints.NotNull;

public record TicketAssignRequest(
        @NotNull(message = "Technician ID is required")
        Long technicianId
) {
}