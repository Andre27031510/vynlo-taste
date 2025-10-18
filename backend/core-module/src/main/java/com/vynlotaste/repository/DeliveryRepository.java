package com.vynlotaste.repository;

import com.vynlotaste.entity.Delivery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DeliveryRepository - Multi-Tenancy Support
 */
@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    
    // ============================================================================
    // QUERIES GLOBAIS (APENAS SUPER ADMIN - sem filtro tenant_id)
    // ============================================================================
    
    List<Delivery> findByStatus(Delivery.DeliveryStatus status);
    
    Page<Delivery> findByStatus(Delivery.DeliveryStatus status, Pageable pageable);
    
    List<Delivery> findByDriverId(Long driverId);
    
    List<Delivery> findByOrderId(Long orderId);
    
    @Query("SELECT d FROM Delivery d WHERE d.createdAt >= :since ORDER BY d.createdAt DESC")
    List<Delivery> findRecentDeliveries(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(d) FROM Delivery d WHERE d.status = :status")
    long countByStatus(@Param("status") Delivery.DeliveryStatus status);
    
    @Query("SELECT d FROM Delivery d WHERE " +
           "LOWER(d.customerName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.customerPhone) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Delivery> searchDeliveries(@Param("search") String search, Pageable pageable);
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    @Query("SELECT d FROM Delivery d WHERE d.tenantId = :tenantId")
    Page<Delivery> findAllByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);
    
    @Query("SELECT d FROM Delivery d WHERE d.tenantId = :tenantId AND d.status = :status")
    Page<Delivery> findByStatusAndTenantId(@Param("status") Delivery.DeliveryStatus status, @Param("tenantId") Long tenantId, Pageable pageable);
}

