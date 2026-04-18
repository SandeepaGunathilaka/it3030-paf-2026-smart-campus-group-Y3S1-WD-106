package com.nexus.scampus.repository;

import com.nexus.scampus.model.Booking;
import com.nexus.scampus.model.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ── Conflict-check queries ────────────────────────────────────────────────
    // Two ranges overlap when: existingStart < requestedEnd AND existingEnd > requestedStart
    @Query("""
        SELECT b FROM Booking b
        WHERE b.resourceId = :resourceId
          AND b.status IN (:activeStatuses)
          AND b.startTime < :endTime
          AND b.endTime   > :startTime
    """)
    List<Booking> findConflictingBookings(
            @Param("resourceId")     Long resourceId,
            @Param("startTime")      LocalDateTime startTime,
            @Param("endTime")        LocalDateTime endTime,
            @Param("activeStatuses") List<BookingStatus> activeStatuses
    );

    @Query("""
        SELECT b FROM Booking b
        WHERE b.resourceId = :resourceId
          AND b.id        != :excludeId
          AND b.status    IN (:activeStatuses)
          AND b.startTime  < :endTime
          AND b.endTime    > :startTime
    """)
    List<Booking> findConflictingBookingsExcluding(
            @Param("resourceId")     Long resourceId,
            @Param("excludeId")      Long excludeId,
            @Param("startTime")      LocalDateTime startTime,
            @Param("endTime")        LocalDateTime endTime,
            @Param("activeStatuses") List<BookingStatus> activeStatuses
    );

    // ── User queries ──────────────────────────────────────────────────────────
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, BookingStatus status);

    // ── Admin queries ─────────────────────────────────────────────────────────
    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    List<Booking> findByResourceIdOrderByCreatedAtDesc(Long resourceId);
}