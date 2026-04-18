package com.nexus.scampus.controller;

import com.nexus.scampus.dto.request.BookingActionRequest;
import com.nexus.scampus.dto.request.BookingRequest;
import com.nexus.scampus.dto.response.BookingResponse;
import com.nexus.scampus.model.enums.BookingStatus;
import com.nexus.scampus.security.UserPrincipal;
import com.nexus.scampus.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ── POST /api/bookings ────────────────────────────────────────────────────
    // Any authenticated user can create a booking request
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest req,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        BookingResponse response = bookingService.createBooking(req, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── GET /api/bookings/my ──────────────────────────────────────────────────
    // Logged-in user sees only their own bookings
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(bookingService.getMyBookings(currentUser));
    }

    // ── GET /api/bookings/{id} ────────────────────────────────────────────────
    // User can view their own; Admin can view any
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(bookingService.getBookingById(id, currentUser));
    }

    // ── GET /api/bookings ─────────────────────────────────────────────────────
    // Admin only — view all bookings, optionally filter by status or resourceId
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) Long resourceId) {

        if (status != null) {
            return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
        }
        if (resourceId != null) {
            return ResponseEntity.ok(bookingService.getBookingsByResource(resourceId));
        }
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ── PATCH /api/bookings/{id}/approve ──────────────────────────────────────
    // Admin only — approve a PENDING booking
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable Long id,
            @Valid @RequestBody(required = false) BookingActionRequest req) {

        if (req == null) req = new BookingActionRequest();
        return ResponseEntity.ok(bookingService.approveBooking(id, req));
    }

    // ── PATCH /api/bookings/{id}/reject ───────────────────────────────────────
    // Admin only — reject a PENDING booking with optional reason
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable Long id,
            @Valid @RequestBody(required = false) BookingActionRequest req) {

        if (req == null) req = new BookingActionRequest();
        return ResponseEntity.ok(bookingService.rejectBooking(id, req));
    }

    // ── PATCH /api/bookings/{id}/cancel ───────────────────────────────────────
    // Owner can cancel their own PENDING or APPROVED booking; Admin can cancel any
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(bookingService.cancelBooking(id, currentUser));
    }
}