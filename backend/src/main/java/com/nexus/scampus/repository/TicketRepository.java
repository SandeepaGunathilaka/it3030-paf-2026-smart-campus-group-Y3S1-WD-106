package com.nexus.scampus.repository;

import com.nexus.scampus.model.Ticket;
import com.nexus.scampus.model.enums.TicketStatus;
import com.nexus.scampus.model.enums.TicketPriority;
import com.nexus.scampus.model.enums.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Get all tickets by reporter
    List<Ticket> findByReporterIdOrderByCreatedAtDesc(Long reporterId);

    // Get all tickets assigned to a technician
    List<Ticket> findByAssignedToIdOrderByCreatedAtDesc(Long technicianId);

    // Get all tickets by status
    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);

    // Get all tickets by priority
    List<Ticket> findByPriorityOrderByCreatedAtDesc(TicketPriority priority);

    // Get all tickets by category
    List<Ticket> findByCategoryOrderByCreatedAtDesc(TicketCategory category);

    // Admin filter by status and priority
    @Query("SELECT t FROM Ticket t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:category IS NULL OR t.category = :category) " +
           "ORDER BY t.createdAt DESC")
    List<Ticket> findAllWithFilters(
            @Param("status") TicketStatus status,
            @Param("priority") TicketPriority priority,
            @Param("category") TicketCategory category
    );

    // Count open tickets
    long countByStatus(TicketStatus status);
}