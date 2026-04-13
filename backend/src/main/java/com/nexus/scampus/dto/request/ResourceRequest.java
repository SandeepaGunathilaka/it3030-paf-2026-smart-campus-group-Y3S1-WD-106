package com.nexus.scampus.dto.request;

import com.nexus.scampus.model.enums.ResourceStatus;
import com.nexus.scampus.model.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ResourceRequest(
        @NotBlank(message = "Name is required")
        String name,

        @NotNull(message = "Type is required")
        ResourceType type,

        @NotNull(message = "Capacity is required")
        @Min(value = 1, message = "Capacity must be at least 1")
        Integer capacity,

        @NotBlank(message = "Location is required")
        String location,

        String availabilityWindows,

        @NotNull(message = "Status is required")
        ResourceStatus status
) {
}