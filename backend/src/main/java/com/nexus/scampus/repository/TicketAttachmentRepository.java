package com.nexus.scampus.repository;

import com.nexus.scampus.model.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {

    // Get all attachments for a ticket
    List<TicketAttachment> findByTicketIdOrderByCreatedAtDesc(Long ticketId);

    // Count attachments for a ticket
    long countByTicketId(Long ticketId);
}