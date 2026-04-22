package com.nexus.scampus.controller;

import com.nexus.scampus.dto.request.TicketAssignRequest;
import com.nexus.scampus.dto.request.TicketCommentRequest;
import com.nexus.scampus.dto.request.TicketRequest;
import com.nexus.scampus.dto.request.TicketStatusUpdateRequest;
import com.nexus.scampus.dto.response.TicketCommentResponse;
import com.nexus.scampus.dto.response.TicketResponse;
import com.nexus.scampus.model.enums.TicketCategory;
import com.nexus.scampus.model.enums.TicketPriority;
import com.nexus.scampus.model.enums.TicketStatus;
import com.nexus.scampus.security.UserPrincipal;
import com.nexus.scampus.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // ── POST /api/tickets ─────────────────────────────────────────────────────
    // Any authenticated user can create a ticket with optional image attachments
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestPart("ticket") TicketRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        TicketResponse response = ticketService.createTicket(request, files, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── GET /api/tickets/my ───────────────────────────────────────────────────
    // Logged-in user sees only their own tickets
    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(ticketService.getMyTickets(currentUser));
    }

    // ── GET /api/tickets/assigned ─────────────────────────────────────────────
    // Technician sees tickets assigned to them
    @GetMapping("/assigned")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<List<TicketResponse>> getAssignedTickets(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(ticketService.getAssignedTickets(currentUser));
    }

    // ── GET /api/tickets/{id} ─────────────────────────────────────────────────
    // Owner, assigned technician, or admin can view a ticket
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicketById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(ticketService.getTicketById(id, currentUser));
    }

    // ── GET /api/tickets ──────────────────────────────────────────────────────
    // Admin and Technician can view all tickets with optional filters
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<TicketResponse>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) TicketCategory category) {

        return ResponseEntity.ok(ticketService.getAllTickets(status, priority, category));
    }

    // ── PATCH /api/tickets/{id}/status ────────────────────────────────────────
    // Admin or assigned technician can update ticket status
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(ticketService.updateTicketStatus(id, request, currentUser));
    }

    // ── PATCH /api/tickets/{id}/assign ────────────────────────────────────────
    // Admin only — assign a technician to a ticket
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<TicketResponse> assignTechnician(
            @PathVariable Long id,
            @Valid @RequestBody TicketAssignRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(ticketService.assignTechnician(id, request, currentUser));
    }

    // ── POST /api/tickets/{id}/comments ──────────────────────────────────────
    // Any user involved in the ticket can add a comment
    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketCommentResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody TicketCommentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        TicketCommentResponse response = ticketService.addComment(id, request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── PATCH /api/tickets/{id}/comments/{commentId} ──────────────────────────
    // Comment author can edit their own comment
    @PatchMapping("/{id}/comments/{commentId}")
    public ResponseEntity<TicketCommentResponse> editComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @Valid @RequestBody TicketCommentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        return ResponseEntity.ok(ticketService.editComment(id, commentId, request, currentUser));
    }

    // ── DELETE /api/tickets/{id}/comments/{commentId} ─────────────────────────
    // Comment author or admin can delete a comment
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        ticketService.deleteComment(id, commentId, currentUser);
        return ResponseEntity.noContent().build();
    }

    // ── DELETE /api/tickets/{id} ──────────────────────────────────────────────
    // Ticket owner or admin can delete a ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        ticketService.deleteTicket(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}