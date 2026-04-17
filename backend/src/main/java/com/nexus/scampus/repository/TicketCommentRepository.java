package com.nexus.scampus.repository;

import com.nexus.scampus.model.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {

    // Get all comments for a ticket
    List<TicketComment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);

    // Get all comments by a specific user
    List<TicketComment> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
}