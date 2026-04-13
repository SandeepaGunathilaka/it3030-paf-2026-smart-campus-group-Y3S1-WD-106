package com.nexus.scampus.service;

import com.nexus.scampus.dto.request.ResourceRequest;
import com.nexus.scampus.dto.response.ResourceResponse;
import com.nexus.scampus.model.enums.ResourceStatus;
import com.nexus.scampus.model.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ResourceService {

    ResourceResponse createResource(ResourceRequest request);

    ResourceResponse getResourceById(Long id);

    Page<ResourceResponse> getAllResources(Pageable pageable);

    List<ResourceResponse> getAllResources();

    ResourceResponse updateResource(Long id, ResourceRequest request);

    void deleteResource(Long id);

    List<ResourceResponse> searchResources(ResourceType type, Integer minCapacity, String location, ResourceStatus status);
}