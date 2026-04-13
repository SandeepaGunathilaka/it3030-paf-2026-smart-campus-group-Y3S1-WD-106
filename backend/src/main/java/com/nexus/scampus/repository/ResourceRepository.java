package com.nexus.scampus.repository;

import com.nexus.scampus.model.Resource;
import com.nexus.scampus.model.enums.ResourceStatus;
import com.nexus.scampus.model.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Page<Resource> findAll(Pageable pageable);

    List<Resource> findByType(ResourceType type);

    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    List<Resource> findByStatus(ResourceStatus status);

    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:status IS NULL OR r.status = :status)")
    List<Resource> findByFilters(@Param("type") ResourceType type,
                                 @Param("minCapacity") Integer minCapacity,
                                 @Param("location") String location,
                                 @Param("status") ResourceStatus status);
}