package com.nexus.scampus.controller;

import com.nexus.scampus.dto.request.ResourceRequest;
import com.nexus.scampus.dto.response.ResourceResponse;
import com.nexus.scampus.model.enums.ResourceStatus;
import com.nexus.scampus.model.enums.ResourceType;
import com.nexus.scampus.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    /**
     * POST /api/resources — Create a new resource
     */
    @PostMapping
    public ResponseEntity<ResourceResponse> createResource(@Valid @RequestBody ResourceRequest request) {
        ResourceResponse response = resourceService.createResource(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/resources — Get all resources with optional pagination and sorting
     */
    @GetMapping
    public ResponseEntity<?> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<ResourceResponse> resources = resourceService.getAllResources(pageable);
        return ResponseEntity.ok(resources);
    }

    /**
     * GET /api/resources/{id} — Get resource by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResourceById(@PathVariable Long id) {
        ResourceResponse response = resourceService.getResourceById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/resources/{id} — Update resource
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponse> updateResource(@PathVariable Long id,
                                                           @Valid @RequestBody ResourceRequest request) {
        ResourceResponse response = resourceService.updateResource(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/resources/{id} — Delete resource
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/resources/search — Search resources with filters
     */
    @GetMapping("/search")
    public ResponseEntity<List<ResourceResponse>> searchResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ResourceStatus status) {

        List<ResourceResponse> resources = resourceService.searchResources(type, minCapacity, location, status);
        return ResponseEntity.ok(resources);
    }
}