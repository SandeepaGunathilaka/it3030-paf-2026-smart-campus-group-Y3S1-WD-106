package com.nexus.scampus.dto.request;

import jakarta.validation.constraints.NotBlank;

public record TicketCommentRequest(
        @NotBlank(message = "Comment content is required")
        String content
) {
}