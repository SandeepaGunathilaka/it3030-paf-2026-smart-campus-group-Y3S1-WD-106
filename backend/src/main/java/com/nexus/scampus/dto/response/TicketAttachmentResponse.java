package com.nexus.scampus.dto.response;

import com.nexus.scampus.model.TicketAttachment;

import java.time.LocalDateTime;

public record TicketAttachmentResponse(
        Long id,
        String fileName,
        String fileUrl,
        String fileType,
        LocalDateTime createdAt
) {
    public static TicketAttachmentResponse from(TicketAttachment attachment) {
        return new TicketAttachmentResponse(
                attachment.getId(),
                attachment.getFileName(),
                attachment.getFileUrl(),
                attachment.getFileType(),
                attachment.getCreatedAt()
        );
    }
}