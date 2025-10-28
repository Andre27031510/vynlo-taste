package com.vynlotaste.repository.church;

import com.vynlotaste.entity.church.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findAllByTenantId(Long tenantId, Pageable pageable);
    Page<Event> findByTenantIdAndStatus(Long tenantId, String status, Pageable pageable);
    Optional<Event> findByIdAndTenantId(Long id, Long tenantId);
    
    @Query("SELECT e FROM Event e WHERE e.tenantId = :tenantId " +
           "AND e.startDate >= :startDate AND e.startDate <= :endDate " +
           "AND e.deletedAt IS NULL")
    Page<Event> findByTenantIdAndStartDateBetween(
        @Param("tenantId") Long tenantId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    @Query("SELECT e FROM Event e WHERE e.tenantId = :tenantId " +
           "AND e.eventType = :eventType " +
           "AND e.deletedAt IS NULL")
    Page<Event> findByTenantIdAndEventType(Long tenantId, String eventType, Pageable pageable);
    
    List<Event> findAllByTenantIdAndStatusAndDeletedAtIsNull(Long tenantId, String status);
}

