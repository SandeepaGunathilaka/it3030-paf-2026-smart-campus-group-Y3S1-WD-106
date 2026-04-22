package com.nexus.scampus.service;

import com.nexus.scampus.dto.request.ResourceRequest;
import com.nexus.scampus.dto.response.ResourceResponse;
import com.nexus.scampus.exception.ResourceNotFoundException;
import com.nexus.scampus.model.Resource;
import com.nexus.scampus.model.enums.ResourceStatus;
import com.nexus.scampus.model.enums.ResourceType;
import com.nexus.scampus.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private ResourceServiceImpl resourceService;

    private Resource resource;
    private ResourceRequest request;

    @BeforeEach
    void setUp() {
        resource = Resource.builder()
                .id(1L)
                .name("Lecture Hall A")
                .type(ResourceType.LECTURE_HALL)
                .capacity(100)
                .location("Building A")
                .availabilityWindows("Mon-Fri 9AM-5PM")
                .status(ResourceStatus.ACTIVE)
                .build();

        request = new ResourceRequest(
                "Lecture Hall A",
                ResourceType.LECTURE_HALL,
                100,
                "Building A",
                "Mon-Fri 9AM-5PM",
                ResourceStatus.ACTIVE
        );
    }

    @Test
    void createResource_ShouldReturnResourceResponse() {
        when(resourceRepository.save(any(Resource.class))).thenReturn(resource);

        ResourceResponse response = resourceService.createResource(request);

        assertThat(response).isNotNull();
        assertThat(response.name()).isEqualTo("Lecture Hall A");
        assertThat(response.type()).isEqualTo(ResourceType.LECTURE_HALL);
        verify(resourceRepository).save(any(Resource.class));
    }

    @Test
    void getResourceById_ShouldReturnResource_WhenExists() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(resource));

        ResourceResponse response = resourceService.getResourceById(1L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
    }

    @Test
    void getResourceById_ShouldThrowException_WhenNotExists() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resourceService.getResourceById(1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getAllResources_ShouldReturnPagedResources() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Resource> page = new PageImpl<>(List.of(resource));
        when(resourceRepository.findAll(pageable)).thenReturn(page);

        Page<ResourceResponse> response = resourceService.getAllResources(pageable);

        assertThat(response).isNotNull();
        assertThat(response.getContent()).hasSize(1);
    }

    @Test
    void updateResource_ShouldReturnUpdatedResource() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(resource));
        when(resourceRepository.save(any(Resource.class))).thenReturn(resource);

        ResourceResponse response = resourceService.updateResource(1L, request);

        assertThat(response).isNotNull();
        verify(resourceRepository).save(resource);
    }

    @Test
    void deleteResource_ShouldDelete_WhenExists() {
        when(resourceRepository.existsById(1L)).thenReturn(true);

        resourceService.deleteResource(1L);

        verify(resourceRepository).deleteById(1L);
    }

    @Test
    void deleteResource_ShouldThrowException_WhenNotExists() {
        when(resourceRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> resourceService.deleteResource(1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void searchResources_ShouldReturnFilteredResources() {
        when(resourceRepository.findByFilters(ResourceType.LECTURE_HALL, null, null, null))
                .thenReturn(List.of(resource));

        List<ResourceResponse> responses = resourceService.searchResources(
                ResourceType.LECTURE_HALL, null, null, null);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).type()).isEqualTo(ResourceType.LECTURE_HALL);
    }
}