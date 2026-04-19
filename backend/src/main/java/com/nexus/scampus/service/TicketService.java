package com.nexus.scampus.service;

import com.nexus.scampus.dto.request.TicketAssignRequest;
import com.nexus.scampus.dto.request.TicketCommentRequest;
import com.nexus.scampus.dto.request.TicketRequest;
import com.nexus.scampus.dto.request.TicketStatusUpdateRequest;
import com.nexus.scampus.dto.response.TicketCommentResponse;
import com.nexus.scampus.dto.response.TicketResponse;
import com.nexus.scampus.exception.BadRequestException;
import com.nexus.scampus.exception.ResourceNotFoundException;
import com.nexus.scampus.exception.UnauthorizedException;
import com.nexus.scampus.model.Resource;
import com.nexus.scampus.model.Ticket;
import com.nexus.scampus.model.TicketAttachment;
import com.nexus.scampus.model.TicketComment;
import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.NotificationType;
import com.nexus.scampus.model.enums.Role;
import com.nexus.scampus.model.enums.TicketCategory;
import com.nexus.scampus.model.enums.TicketPriority;
import com.nexus.scampus.model.enums.TicketStatus;
import com.nexus.scampus.repository.ResourceRepository;
import com.nexus.scampus.repository.TicketAttachmentRepository;
import com.nexus.scampus.repository.TicketCommentRepository;
import com.nexus.scampus.repository.TicketRepository;
import com.nexus.scampus.repository.UserRepository;
import com.nexus.scampus.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketAttachmentRepository attachmentRepository;
    private final TicketCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;
    private Optional<CloudinaryService> cloudinaryService;

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
    }

    private Ticket getTicket(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", ticketId));
    }

    private boolean isAdmin(UserPrincipal user) {
        return user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_SUPER_ADMIN"));
    }

    private boolean isTechnician(UserPrincipal user) {
        return user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICIAN"));
    }

    // ── Create Ticket ─────────────────────────────────────────────────────────

    @Transactional
    public TicketResponse createTicket(TicketRequest request,
                                       List<MultipartFile> files,
                                       UserPrincipal currentUser) {
        if (files != null && files.size() > 3) {
            throw new BadRequestException("Maximum 3 attachments allowed per ticket");
        }

        User reporter = getUser(currentUser.getId());

        Resource resource = null;
        if (request.resourceId() != null) {
            resource = resourceRepository.findById(request.resourceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resource", request.resourceId()));
        }

        Ticket ticket = Ticket.builder()
                .reporter(reporter)
                .resource(resource)
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .priority(request.priority())
                .status(TicketStatus.OPEN)
                .location(request.location())
                .contactDetails(request.contactDetails())
                .build();

        Ticket saved = ticketRepository.save(ticket);

        // Upload attachments to Cloudinary
        if (files != null && !files.isEmpty() && cloudinaryService.isPresent()) {
            List<TicketAttachment> attachments = new ArrayList<>();
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileUrl = cloudinaryService.get().uploadFile(file);
                    TicketAttachment attachment = TicketAttachment.builder()
                            .ticket(saved)
                            .fileName(file.getOriginalFilename())
                            .fileUrl(fileUrl)
                            .fileType(file.getContentType())
                            .build();
                    attachments.add(attachmentRepository.save(attachment));
                }
            }
            saved.setAttachments(attachments);
        }

        return TicketResponse.from(saved);
    }

    // ── Get Ticket By ID ──────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long ticketId, UserPrincipal currentUser) {
        Ticket ticket = getTicket(ticketId);

        boolean isOwner = ticket.getReporter().getId().equals(currentUser.getId());
        boolean isAssigned = ticket.getAssignedTo() != null &&
                ticket.getAssignedTo().getId().equals(currentUser.getId());

        if (!isOwner && !isAssigned && !isAdmin(currentUser) && !isTechnician(currentUser)) {
            throw new UnauthorizedException("Access denied");
        }

        return TicketResponse.from(ticket);
    }

    // ── Get My Tickets ────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TicketResponse> getMyTickets(UserPrincipal currentUser) {
        return ticketRepository.findByReporterIdOrderByCreatedAtDesc(currentUser.getId())
                .stream().map(TicketResponse::from).toList();
    }

    // ── Get All Tickets (Admin/Technician) ────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets(TicketStatus status,
                                              TicketPriority priority,
                                              TicketCategory category) {
        return ticketRepository.findAllWithFilters(status, priority, category)
                .stream().map(TicketResponse::from).toList();
    }

    // ── Get Assigned Tickets (Technician) ─────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TicketResponse> getAssignedTickets(UserPrincipal currentUser) {
        return ticketRepository.findByAssignedToIdOrderByCreatedAtDesc(currentUser.getId())
                .stream().map(TicketResponse::from).toList();
    }

    // ── Update Ticket Status ──────────────────────────────────────────────────

    @Transactional
    public TicketResponse updateTicketStatus(Long ticketId,
                                             TicketStatusUpdateRequest request,
                                             UserPrincipal currentUser) {
        Ticket ticket = getTicket(ticketId);

        boolean isAssigned = ticket.getAssignedTo() != null &&
                ticket.getAssignedTo().getId().equals(currentUser.getId());

        if (!isAdmin(currentUser) && !isAssigned) {
            throw new UnauthorizedException("Only admins or assigned technicians can update ticket status");
        }

        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new BadRequestException("Cannot update a closed ticket");
        }

        if (request.status() == TicketStatus.REJECTED && request.rejectionReason() == null) {
            throw new BadRequestException("Rejection reason is required when rejecting a ticket");
        }

        ticket.setStatus(request.status());

        if (request.resolutionNotes() != null) {
            ticket.setResolutionNotes(request.resolutionNotes());
        }
        if (request.rejectionReason() != null) {
            ticket.setRejectionReason(request.rejectionReason());
        }

        Ticket saved = ticketRepository.save(ticket);

        notificationService.send(
                ticket.getReporter(),
                NotificationType.TICKET_STATUS_CHANGED,
                "Ticket Status Updated",
                "Your ticket \"" + ticket.getTitle() + "\" status changed to " + request.status(),
                saved.getId(),
                "TICKET"
        );

        return TicketResponse.from(saved);
    }

    // ── Assign Technician ─────────────────────────────────────────────────────

    @Transactional
    public TicketResponse assignTechnician(Long ticketId,
                                           TicketAssignRequest request,
                                           UserPrincipal currentUser) {
        if (!isAdmin(currentUser)) {
            throw new UnauthorizedException("Only admins can assign technicians");
        }

        Ticket ticket = getTicket(ticketId);
        User technician = getUser(request.technicianId());

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new BadRequestException("Assigned user must have TECHNICIAN role");
        }

        ticket.setAssignedTo(technician);
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        Ticket saved = ticketRepository.save(ticket);

        notificationService.send(
                technician,
                NotificationType.TICKET_ASSIGNED,
                "Ticket Assigned",
                "You have been assigned to ticket: \"" + ticket.getTitle() + "\"",
                saved.getId(),
                "TICKET"
        );

        notificationService.send(
                ticket.getReporter(),
                NotificationType.TICKET_STATUS_CHANGED,
                "Technician Assigned",
                "A technician has been assigned to your ticket: \"" + ticket.getTitle() + "\"",
                saved.getId(),
                "TICKET"
        );

        return TicketResponse.from(saved);
    }

    // ── Add Comment ───────────────────────────────────────────────────────────

    @Transactional
    public TicketCommentResponse addComment(Long ticketId,
                                            TicketCommentRequest request,
                                            UserPrincipal currentUser) {
        Ticket ticket = getTicket(ticketId);
        User author = getUser(currentUser.getId());

        boolean isOwner = ticket.getReporter().getId().equals(currentUser.getId());
        boolean isAssigned = ticket.getAssignedTo() != null &&
                ticket.getAssignedTo().getId().equals(currentUser.getId());

        if (!isOwner && !isAssigned && !isAdmin(currentUser) && !isTechnician(currentUser)) {
            throw new UnauthorizedException("You don't have access to comment on this ticket");
        }

        TicketComment comment = TicketComment.builder()
                .ticket(ticket)
                .author(author)
                .content(request.content())
                .build();

        TicketComment saved = commentRepository.save(comment);

        if (!ticket.getReporter().getId().equals(currentUser.getId())) {
            notificationService.send(
                    ticket.getReporter(),
                    NotificationType.TICKET_COMMENT_ADDED,
                    "New Comment on Your Ticket",
                    author.getName() + " commented on your ticket: \"" + ticket.getTitle() + "\"",
                    ticket.getId(),
                    "TICKET"
            );
        }

        return TicketCommentResponse.from(saved);
    }

    // ── Edit Comment ──────────────────────────────────────────────────────────

    @Transactional
    public TicketCommentResponse editComment(Long ticketId,
                                             Long commentId,
                                             TicketCommentRequest request,
                                             UserPrincipal currentUser) {
        getTicket(ticketId);

        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(request.content());
        return TicketCommentResponse.from(commentRepository.save(comment));
    }

    // ── Delete Comment ────────────────────────────────────────────────────────

    @Transactional
    public void deleteComment(Long ticketId,
                              Long commentId,
                              UserPrincipal currentUser) {
        getTicket(ticketId);

        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));

        boolean isAuthor = comment.getAuthor().getId().equals(currentUser.getId());

        if (!isAuthor && !isAdmin(currentUser)) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    // ── Delete Ticket ─────────────────────────────────────────────────────────

    @Transactional
    public void deleteTicket(Long ticketId, UserPrincipal currentUser) {
        Ticket ticket = getTicket(ticketId);

        boolean isOwner = ticket.getReporter().getId().equals(currentUser.getId());

        if (!isOwner && !isAdmin(currentUser)) {
            throw new UnauthorizedException("You can only delete your own tickets");
        }

        // Delete attachments from Cloudinary first
        if (cloudinaryService.isPresent()) {
            ticket.getAttachments().forEach(attachment ->
                    cloudinaryService.get().deleteFile(attachment.getFileUrl()));
        }

        ticketRepository.delete(ticket);
    }
}