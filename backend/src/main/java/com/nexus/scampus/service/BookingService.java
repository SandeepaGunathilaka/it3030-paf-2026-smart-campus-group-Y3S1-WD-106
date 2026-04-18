package com.nexus.scampus.service;

import com.nexus.scampus.dto.request.BookingActionRequest;
import com.nexus.scampus.dto.request.BookingRequest;
import com.nexus.scampus.dto.response.BookingResponse;
import com.nexus.scampus.exception.BadRequestException;
import com.nexus.scampus.exception.ResourceNotFoundException;
import com.nexus.scampus.exception.UnauthorizedException;
import com.nexus.scampus.model.Booking;
import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.BookingStatus;
import com.nexus.scampus.model.enums.NotificationType;
import com.nexus.scampus.repository.BookingRepository;
import com.nexus.scampus.repository.UserRepository;
import com.nexus.scampus.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository   bookingRepository;
    private final UserRepository      userRepository;
    private final NotificationService notificationService;

    private static final List<BookingStatus> ACTIVE_STATUSES =
            List.of(BookingStatus.PENDING, BookingStatus.APPROVED);

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }

    private Booking getBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));
    }

    private BookingResponse toResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .resourceId(b.getResourceId())
                .userId(b.getUser().getId())
                .userName(b.getUser().getName())
                .userEmail(b.getUser().getEmail())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .purpose(b.getPurpose())
                .expectedAttendees(b.getExpectedAttendees())
                .status(b.getStatus())
                .adminNote(b.getAdminNote())
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }

    private void checkForConflicts(Long resourceId, LocalDateTime start, LocalDateTime end) {
        if (!end.isAfter(start)) {
            throw new BadRequestException("End time must be after start time");
        }
        List<Booking> conflicts = bookingRepository
                .findConflictingBookings(resourceId, start, end, ACTIVE_STATUSES);
        if (!conflicts.isEmpty()) {
            throw new BadRequestException(
                    "This resource is already booked during the requested time slot");
        }
    }

    // ── Create ────────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponse createBooking(BookingRequest req, UserPrincipal currentUser) {
        checkForConflicts(req.getResourceId(), req.getStartTime(), req.getEndTime());

        User user = getUser(currentUser.getId());

        Booking booking = Booking.builder()
                .resourceId(req.getResourceId())
                .user(user)
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .purpose(req.getPurpose())
                .expectedAttendees(req.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        return toResponse(bookingRepository.save(booking));
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    public BookingResponse getBookingById(Long id, UserPrincipal currentUser) {
        Booking booking = getBooking(id);
        boolean isOwner = booking.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("Access denied");
        }
        return toResponse(booking);
    }

    public List<BookingResponse> getMyBookings(UserPrincipal currentUser) {
        return bookingRepository
                .findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream().map(this::toResponse).toList();
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream().map(this::toResponse).toList();
    }

    public List<BookingResponse> getBookingsByResource(Long resourceId) {
        return bookingRepository.findByResourceIdOrderByCreatedAtDesc(resourceId)
                .stream().map(this::toResponse).toList();
    }

    // ── Approve ───────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponse approveBooking(Long id, BookingActionRequest req) {
        Booking booking = getBooking(id);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminNote(req.getAdminNote());

        Booking saved = bookingRepository.save(booking);

        notificationService.send(
                booking.getUser(),
                NotificationType.BOOKING_APPROVED,
                "Booking Approved",
                "Your booking for resource #" + booking.getResourceId()
                        + " on " + booking.getStartTime().toLocalDate() + " has been approved.",
                saved.getId(),
                "BOOKING"
        );

        return toResponse(saved);
    }

    // ── Reject ────────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponse rejectBooking(Long id, BookingActionRequest req) {
        Booking booking = getBooking(id);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminNote(req.getAdminNote());

        Booking saved = bookingRepository.save(booking);

        notificationService.send(
                booking.getUser(),
                NotificationType.BOOKING_REJECTED,
                "Booking Rejected",
                "Your booking for resource #" + booking.getResourceId()
                        + " was rejected."
                        + (req.getAdminNote() != null ? " Reason: " + req.getAdminNote() : ""),
                saved.getId(),
                "BOOKING"
        );

        return toResponse(saved);
    }

    // ── Cancel ────────────────────────────────────────────────────────────────

    @Transactional
    public BookingResponse cancelBooking(Long id, UserPrincipal currentUser) {
        Booking booking = getBooking(id);

        boolean isOwner = booking.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING
                && booking.getStatus() != BookingStatus.APPROVED) {
            throw new BadRequestException("Only PENDING or APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);

        notificationService.send(
                booking.getUser(),
                NotificationType.BOOKING_CANCELLED,
                "Booking Cancelled",
                "Your booking for resource #" + booking.getResourceId()
                        + " on " + booking.getStartTime().toLocalDate() + " has been cancelled.",
                saved.getId(),
                "BOOKING"
        );

        return toResponse(saved);
    }
}