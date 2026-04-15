package com.nexus.scampus.dto.request;

import com.nexus.scampus.model.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateStaffRequest(
        @NotBlank(message = "Google ID is required") String googleId,
        @NotBlank(message = "Email is required") @Email(message = "Invalid email") String email,
        @NotBlank(message = "Name is required") String name,
        String pictureUrl,
        @NotNull(message = "Role is required") Role role   // ADMIN or TECHNICIAN only
) {}
