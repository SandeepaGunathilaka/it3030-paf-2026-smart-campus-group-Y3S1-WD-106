package com.nexus.scampus.dto.request;

import com.nexus.scampus.model.enums.TicketCategory;
import com.nexus.scampus.model.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TicketRequest(
        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Category is required")
        TicketCategory category,

        @NotNull(message = "Priority is required")
        TicketPriority priority,

        @NotBlank(message = "Location is required")
        String location,

        String contactDetails,

        Long resourceId
) {
}