package com.nexus.scampus.controller;

import com.nexus.scampus.dto.request.CreateStaffRequest;
import com.nexus.scampus.dto.response.UserResponse;
import com.nexus.scampus.exception.BadRequestException;
import com.nexus.scampus.exception.ResourceNotFoundException;
import com.nexus.scampus.exception.UnauthorizedException;
import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.AccountStatus;
import com.nexus.scampus.model.enums.NotificationType;
import com.nexus.scampus.model.enums.Role;
import com.nexus.scampus.repository.UserRepository;
import com.nexus.scampus.security.UserPrincipal;
import com.nexus.scampus.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // ─────────────────────────────────────────────────────────────────────────
    // GET — list users
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/users — list all users (excludes super admin from view).
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findByRoleNot(Role.SUPER_ADMIN)
                .stream().map(UserResponse::from).toList();
        return ResponseEntity.ok(users);
    }

    /**
     * GET /api/admin/users/pending — list users awaiting approval.
     */
    @GetMapping("/users/pending")
    public ResponseEntity<List<UserResponse>> getPendingUsers() {
        List<UserResponse> pending = userRepository.findByStatus(AccountStatus.PENDING)
                .stream().map(UserResponse::from).toList();
        return ResponseEntity.ok(pending);
    }

    /**
     * GET /api/admin/stats — basic dashboard statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalUsers      = userRepository.findByRole(Role.USER).size();
        long totalAdmins     = userRepository.findByRole(Role.ADMIN).size();
        long totalTechnicians = userRepository.findByRole(Role.TECHNICIAN).size();
        long pendingApprovals = userRepository.findByStatus(AccountStatus.PENDING).size();
        return ResponseEntity.ok(Map.of(
                "totalUsers",       totalUsers,
                "totalAdmins",      totalAdmins,
                "totalTechnicians", totalTechnicians,
                "pendingApprovals", pendingApprovals
        ));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST — super admin creates admin / technician accounts
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * POST /api/admin/users — super admin pre-creates an admin or technician account.
     * The account is ACTIVE immediately (no approval needed for staff).
     */
    @PostMapping("/users")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> createStaff(@Valid @RequestBody CreateStaffRequest req,
                                                     @AuthenticationPrincipal UserPrincipal principal) {
        if (req.role() == Role.SUPER_ADMIN || req.role() == Role.USER) {
            throw new BadRequestException("You can only create ADMIN or TECHNICIAN accounts");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new BadRequestException("A user with this email already exists");
        }
        if (req.googleId() != null && !req.googleId().isBlank() && userRepository.existsByGoogleId(req.googleId())) {
            throw new BadRequestException("A user with this Google ID already exists");
        }

        User staff = User.builder()
                .googleId(req.googleId())
                .email(req.email())
                .name(req.name())
                .pictureUrl(req.pictureUrl())
                .role(req.role())
                .status(AccountStatus.ACTIVE)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserResponse.from(userRepository.save(staff)));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUT — super admin updates a user's role
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * PUT /api/admin/users/{id}/role — super admin changes a user's role.
     */
    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable Long id,
                                                        @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new UnauthorizedException("Cannot change the role of the super admin");
        }

        Role newRole = Role.valueOf(body.get("role").toUpperCase());
        if (newRole == Role.SUPER_ADMIN) {
            throw new BadRequestException("Cannot assign SUPER_ADMIN role via this endpoint");
        }

        user.setRole(newRole);
        return ResponseEntity.ok(UserResponse.from(userRepository.save(user)));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PATCH — approve or reject a pending user
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * PATCH /api/admin/users/{id}/approve — approve a pending user.
     * Sends them an ACCOUNT_APPROVED notification.
     */
    @PatchMapping("/users/{id}/approve")
    public ResponseEntity<UserResponse> approveUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        if (user.getStatus() != AccountStatus.PENDING) {
            throw new BadRequestException("User is not in PENDING status");
        }

        user.setStatus(AccountStatus.ACTIVE);
        userRepository.save(user);

        notificationService.send(
                user,
                NotificationType.ACCOUNT_APPROVED,
                "Account Approved",
                "Your account has been approved. You can now log in to the Smart Campus system.",
                user.getId(),
                "USER"
        );

        return ResponseEntity.ok(UserResponse.from(user));
    }

    /**
     * PATCH /api/admin/users/{id}/reject — reject a pending user.
     * Sends them an ACCOUNT_REJECTED notification.
     */
    @PatchMapping("/users/{id}/reject")
    public ResponseEntity<UserResponse> rejectUser(@PathVariable Long id,
                                                    @RequestBody(required = false) Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        if (user.getStatus() != AccountStatus.PENDING) {
            throw new BadRequestException("User is not in PENDING status");
        }

        user.setStatus(AccountStatus.REJECTED);
        userRepository.save(user);

        String reason = (body != null && body.containsKey("reason"))
                ? body.get("reason")
                : "Your account request has been reviewed and was not approved.";

        notificationService.send(
                user,
                NotificationType.ACCOUNT_REJECTED,
                "Account Request Rejected",
                reason,
                user.getId(),
                "USER"
        );

        return ResponseEntity.ok(UserResponse.from(user));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE — remove a user
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * DELETE /api/admin/users/{id}
     * - SUPER_ADMIN: can delete any user except themselves and other super admins.
     * - ADMIN: can only delete regular USER role accounts.
     */
    @Transactional
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id,
                                            @AuthenticationPrincipal UserPrincipal principal) {
        User target = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));

        if (target.getRole() == Role.SUPER_ADMIN) {
            throw new UnauthorizedException("Super admin account cannot be deleted");
        }
        if (target.getId().equals(principal.getId())) {
            throw new BadRequestException("You cannot delete your own account");
        }

        boolean callerIsSuperAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (!callerIsSuperAdmin && target.getRole() != Role.USER) {
            throw new UnauthorizedException("Admins can only delete regular USER accounts");
        }

        userRepository.delete(target);
        return ResponseEntity.noContent().build();
    }
}
