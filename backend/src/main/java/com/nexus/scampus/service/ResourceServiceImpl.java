package com.nexus.scampus.service;

import com.nexus.scampus.dto.request.ResourceRequest;
import com.nexus.scampus.dto.response.ResourceResponse;
import com.nexus.scampus.exception.ResourceNotFoundException;
import com.nexus.scampus.model.Resource;
import com.nexus.scampus.model.enums.ResourceStatus;
import com.nexus.scampus.model.enums.ResourceType;
import com.nexus.scampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    @Transactional
    public ResourceResponse createResource(ResourceRequest request) {
        log.info("Creating new resource: {}", request.name());

        Resource resource = Resource.builder()
                .name(request.name())
                .type(request.type())
                .capacity(request.capacity())
                .location(request.location())
                .availabilityWindows(request.availabilityWindows())
                .status(request.status())
                .build();

        Resource savedResource = resourceRepository.save(resource);
        log.info("Resource created with ID: {}", savedResource.getId());

        return ResourceResponse.from(savedResource);
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceResponse getResourceById(Long id) {
        log.debug("Fetching resource with ID: {}", id);

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource", id));

        return ResourceResponse.from(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ResourceResponse> getAllResources(Pageable pageable) {
        log.debug("Fetching all resources with pagination");

        return resourceRepository.findAll(pageable)
                .map(ResourceResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> getAllResources() {
        log.debug("Fetching all resources");

        return resourceRepository.findAll().stream()
                .map(ResourceResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public ResourceResponse updateResource(Long id, ResourceRequest request) {
        log.info("Updating resource with ID: {}", id);

        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource", id));

        resource.setName(request.name());
        resource.setType(request.type());
        resource.setCapacity(request.capacity());
        resource.setLocation(request.location());
        resource.setAvailabilityWindows(request.availabilityWindows());
        resource.setStatus(request.status());

        Resource updatedResource = resourceRepository.save(resource);
        log.info("Resource updated with ID: {}", updatedResource.getId());

        return ResourceResponse.from(updatedResource);
    }

    @Override
    @Transactional
    public void deleteResource(Long id) {
        log.info("Deleting resource with ID: {}", id);

        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource", id);
        }

        resourceRepository.deleteById(id);
        log.info("Resource deleted with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> searchResources(ResourceType type, Integer minCapacity, String location, ResourceStatus status) {
        log.debug("Searching resources with filters - type: {}, minCapacity: {}, location: {}, status: {}",
                  type, minCapacity, location, status);

        List<Resource> resources = resourceRepository.findByFilters(type, minCapacity, location, status);

        return resources.stream()
                .map(ResourceResponse::from)
                .toList();
    }
}