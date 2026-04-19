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
import com.nexus.scampus.model.enums.Role;
import com.nexus.scampus.repository.BookingRepository;
import com.nexus.scampus.repository.UserRepository;
import com.nexus.scampus.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookingService Unit Tests")
class BookingServiceTest {

    @Mock private BookingRepository   bookingRepository;
    @Mock private UserRepository      userRepository;
    @Mock private NotificationService notificationService;

    @InjectMocks
    private BookingService bookingService;

    // ── Shared fixtures ───────────────────────────────────────────────────────

    private User        testUser;
    private UserPrincipal userPrincipal;
    private UserPrincipal adminPrincipal;

    private final LocalDateTime FUTURE_START = LocalDateTime.now().plusDays(1);
    private final LocalDateTime FUTURE_END   = LocalDateTime.now().plusDays(1).plusHours(2);

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .role(Role.USER)
                .build();

        userPrincipal = new UserPrincipal(
                1L, "test@example.com", List.of(new SimpleGrantedAuthority("ROLE_USER")), null
        );

        adminPrincipal = new UserPrincipal(
                2L, "admin@example.com", List.of(new SimpleGrantedAuthority("ROLE_ADMIN")), null
        );
    }

    private Booking buildBooking(Long id, BookingStatus status) {
        return Booking.builder()
                .id(id)
                .resourceId(10L)
                .user(testUser)
                .startTime(FUTURE_START)
                .endTime(FUTURE_END)
                .purpose("Test lecture")
                .expectedAttendees(30)
                .status(status)
                .build();
    }

    private BookingRequest buildRequest() {
        BookingRequest req = new BookingRequest();
        req.setResourceId(10L);
        req.setStartTime(FUTURE_START);
        req.setEndTime(FUTURE_END);
        req.setPurpose("Test lecture");
        req.setExpectedAttendees(30);
        return req;
    }

    // ── createBooking ─────────────────────────────────────────────────────────

    @Nested
    @DisplayName("createBooking()")
    class CreateBooking {

        @Test
        @DisplayName("should create booking when no conflicts exist")
        void shouldCreateBookingSuccessfully() {
            when(bookingRepository.findConflictingBookings(anyLong(), any(), any(), anyList()))
                    .thenReturn(Collections.emptyList());
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            Booking saved = buildBooking(1L, BookingStatus.PENDING);
            when(bookingRepository.save(any(Booking.class))).thenReturn(saved);

            BookingResponse response = bookingService.createBooking(buildRequest(), userPrincipal);

            assertThat(response).isNotNull();
            assertThat(response.getStatus()).isEqualTo(BookingStatus.PENDING);
            assertThat(response.getResourceId()).isEqualTo(10L);
            verify(bookingRepository, times(1)).save(any(Booking.class));
        }

        @Test
        @DisplayName("should throw BadRequestException when time slot is already booked")
        void shouldThrowWhenConflictExists() {
            Booking conflicting = buildBooking(99L, BookingStatus.APPROVED);
            when(bookingRepository.findConflictingBookings(anyLong(), any(), any(), anyList()))
                    .thenReturn(List.of(conflicting));

            assertThatThrownBy(() -> bookingService.createBooking(buildRequest(), userPrincipal))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("already booked");

            verify(bookingRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw BadRequestException when end time is before start time")
        void shouldThrowWhenEndBeforeStart() {
            BookingRequest req = buildRequest();
            req.setEndTime(FUTURE_START.minusHours(1)); // end before start

            // Conflict check will also catch this, but let's verify it's a BadRequest
            assertThatThrownBy(() -> bookingService.createBooking(req, userPrincipal))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("End time must be after start time");
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when user does not exist")
        void shouldThrowWhenUserNotFound() {
            when(bookingRepository.findConflictingBookings(anyLong(), any(), any(), anyList()))
                    .thenReturn(Collections.emptyList());
            when(userRepository.findById(1L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> bookingService.createBooking(buildRequest(), userPrincipal))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ── approveBooking ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("approveBooking()")
    class ApproveBooking {

        @Test
        @DisplayName("should approve a PENDING booking and send notification")
        void shouldApprovePendingBooking() {
            Booking pending = buildBooking(1L, BookingStatus.PENDING);
            when(bookingRepository.findById(1L)).thenReturn(Optional.of(pending));
            when(bookingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            BookingActionRequest action = new BookingActionRequest();
            action.setAdminNote("Approved for semester use");

            BookingResponse response = bookingService.approveBooking(1L, action);

            assertThat(response.getStatus()).isEqualTo(BookingStatus.APPROVED);
            assertThat(response.getAdminNote()).isEqualTo("Approved for semester use");
            verify(notificationService, times(1)).send(any(), any(), anyString(), anyString(), anyLong(), anyString());
        }

        @Test
        @DisplayName("should throw BadRequestException when booking is not PENDING")
        void shouldThrowWhenNotPending() {
            Booking approved = buildBooking(1L, BookingStatus.APPROVED);
            when(bookingRepository.findById(1L)).thenReturn(Optional.of(approved));

            assertThatThrownBy(() -> bookingService.approveBooking(1L, new BookingActionRequest()))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Only PENDING bookings can be approved");
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when booking does not exist")
        void shouldThrowWhenBookingNotFound() {
            when(bookingRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> bookingService.approveBooking(999L, new BookingActionRequest()))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    // ── rejectBooking ─────────────────────────────────────────────────────────

    @Nested
    @DisplayName("rejectBooking()")
    class RejectBooking {

        @Test
        @DisplayName("should reject a PENDING booking and send notification")
        void shouldRejectPendingBooking() {
            Booking pending = buildBooking(1L, BookingStatus.PENDING);
            when(bookingRepository.findById(1L)).thenReturn(Optional.of(pending));
            when(bookingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            BookingActionRequest action = new BookingActionRequest();
            action.setAdminNote("Room under maintenance");

            BookingResponse response = bookingService.rejectBooking(1L, action);

            assertThat(response.getStatus()).isEqualTo(BookingStatus.REJECTED);
            verify(notificationService, times(1)).send(any(), any(), anyString(), anyString(), anyLong(), anyString());
        }

        @Test
        @DisplayName("should throw BadRequestException when booking is already REJECTED")
        void shouldThrowWhenAlreadyRejected() {
            Booking rejected = buildBooking(1L, BookingStatus.REJECTED);
            when(bookingRepository.findById(1L)).thenReturn(Optional.of(rejected));

            assertThatThrownBy(() -> bookingService.rejectBooking(1L, new BookingActionRequest()))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Only PENDING bookings can be rejected");
        }
    }

    // ── cancelBooking ─────────────────────────────────────────────────────────

    @Nested
    @DisplayName("cancelBooking()")
    class CancelBooking {

        @Test
        @DisplayName("should allow owner to cancel their own PENDING booking")
        void ownerShouldCancelPendingBooking() {
            Booking pending = buildBooking(1L, BookingStatus.PENDING);
            when(bookingRepository.findById(1L)).thenReturn(Optional.of(pending));
            when(bookingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            BookingResponse response = bookingService.cancelBooking(1L, userPrincipal);

            assertThat(response.getStatus()).isEqualTo(BookingStatus.CANCELLED);
            verify(notificationService, times(1)).send(any(), any(), anyString(), anyString(), anyLong(), anyString());
        }

        @Test
        @DisplayName("should allow owner to cancel their own APPROVED booking")
        void ownerShouldCancelApprovedBooking() {
            Booking approved = buildBooking(1L, BookingStatus.APPROVED);
            when(bookingRepository.findById(1L)).thenReturn(Optional.of(approved));
            when(bookingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            BookingResponse response = bookingService.cancelBooking(1L, userPrincipal);

            assertThat(response.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        }

        @Test
        @DisplayName("should throw UnauthorizedException when non-owner tries to cancel")
        void shouldThrowWhenNonOwnerCancels() {
            Booking pending = buildBooking(1L, BookingStatus.PENDING);
            when(bookingRepository.findById(1L)).thenReturn(Optional.of(pending));

            // adminPrincipal has id=2, booking owner is id=1, and this principal is not ADMIN role
            UserPrincipal otherUser = new UserPrincipal(
                    2L, "other@example.com", List.of(new SimpleGrantedAuthority("ROLE_USER")), null
            );

            assertThatThrownBy(() -> bookingService.cancelBooking(1L, otherUser))
                    .isInstanceOf(UnauthorizedException.class);
        }

        @Test
        @DisplayName("should allow admin to cancel any booking")
        void adminShouldCancelAnyBooking() {
            Booking pending = buildBooking(1L, BookingStatus.PENDING); // owned by user id=1
            when(bookingRepository.findById(1L)).thenReturn(Optional.of(pending));
            when(bookingRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            // adminPrincipal has id=2 but ROLE_ADMIN
            BookingResponse response = bookingService.cancelBooking(1L, adminPrincipal);

            assertThat(response.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        }

        @Test
        @DisplayName("should throw BadRequestException when trying to cancel a REJECTED booking")
        void shouldThrowWhenCancellingRejected() {
            Booking rejected = buildBooking(1L, BookingStatus.REJECTED);
            when(bookingRepository.findById(1L)).thenReturn(Optional.of(rejected));

            assertThatThrownBy(() -> bookingService.cancelBooking(1L, userPrincipal))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Only PENDING or APPROVED bookings can be cancelled");
        }
    }

    // ── getMyBookings ─────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getMyBookings()")
    class GetMyBookings {

        @Test
        @DisplayName("should return only the current user's bookings")
        void shouldReturnUsersBookings() {
            List<Booking> myBookings = List.of(
                    buildBooking(1L, BookingStatus.PENDING),
                    buildBooking(2L, BookingStatus.APPROVED)
            );
            when(bookingRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(myBookings);

            List<BookingResponse> result = bookingService.getMyBookings(userPrincipal);

            assertThat(result).hasSize(2);
            assertThat(result).extracting(BookingResponse::getStatus)
                    .containsExactly(BookingStatus.PENDING, BookingStatus.APPROVED);
        }

        @Test
        @DisplayName("should return empty list when user has no bookings")
        void shouldReturnEmptyListWhenNoBookings() {
            when(bookingRepository.findByUserIdOrderByCreatedAtDesc(1L))
                    .thenReturn(Collections.emptyList());

            List<BookingResponse> result = bookingService.getMyBookings(userPrincipal);

            assertThat(result).isEmpty();
        }
    }

    // ── conflict check logic ──────────────────────────────────────────────────

    @Nested
    @DisplayName("Conflict detection")
    class ConflictDetection {

        @Test
        @DisplayName("should detect overlap when new booking starts inside existing booking")
        void shouldDetectPartialOverlap() {
            // Existing: 10:00 - 12:00  |  New: 11:00 - 13:00  → overlaps
            Booking existing = buildBooking(99L, BookingStatus.APPROVED);
            when(bookingRepository.findConflictingBookings(anyLong(), any(), any(), anyList()))
                    .thenReturn(List.of(existing));

            BookingRequest req = buildRequest();
            req.setStartTime(FUTURE_START.plusHours(1));
            req.setEndTime(FUTURE_END.plusHours(1));

            assertThatThrownBy(() -> bookingService.createBooking(req, userPrincipal))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("already booked");
        }

        @Test
        @DisplayName("should allow booking that starts exactly when another ends (no overlap)")
        void shouldAllowAdjacentBooking() {
            // No conflicts returned for adjacent slot
            when(bookingRepository.findConflictingBookings(anyLong(), any(), any(), anyList()))
                    .thenReturn(Collections.emptyList());
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(bookingRepository.save(any())).thenReturn(buildBooking(2L, BookingStatus.PENDING));

            BookingRequest req = buildRequest();
            req.setStartTime(FUTURE_END);           // starts when previous ends
            req.setEndTime(FUTURE_END.plusHours(2));

            assertThatNoException().isThrownBy(
                    () -> bookingService.createBooking(req, userPrincipal)
            );
        }
    }
}