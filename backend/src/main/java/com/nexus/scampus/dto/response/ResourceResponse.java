package com.nexus.scampus.dto.response;

import com.nexus.scampus.model.Resource;
import com.nexus.scampus.model.enums.ResourceStatus;
import com.nexus.scampus.model.enums.ResourceType;

import java.time.LocalDateTime;

public record ResourceResponse(
        Long id,
        String name,
        ResourceType type,
        Integer capacity,
        String location,
        String availabilityWindows,
        ResourceStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ResourceResponse from(Resource resource) {
        return new ResourceResponse(
                resource.getId(),
                resource.getName(),
                resource.getType(),
                resource.getCapacity(),
                resource.getLocation(),
                resource.getAvailabilityWindows(),
                resource.getStatus(),
                resource.getCreatedAt(),
                resource.getUpdatedAt()
        );
    }
}