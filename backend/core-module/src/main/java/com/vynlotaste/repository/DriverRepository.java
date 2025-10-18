package com.vynlotaste.repository;

import com.vynlotaste.entity.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * DriverRepository - Multi-Tenancy Support
 * IMPORTANTE: Queries globais + queries filtradas por tenant_id
 */
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    // ============================================================================
    // QUERIES GLOBAIS (APENAS SUPER ADMIN - sem filtro tenant_id)
    // ============================================================================
    
    Optional<Driver> findByPhone(String phone);
    
    Optional<Driver> findByEmail(String email);
    
    List<Driver> findByStatus(Driver.DriverStatus status);
    
    Page<Driver> findByStatus(Driver.DriverStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(d) FROM Driver d WHERE d.status = :status")
    long countByStatus(@Param("status") Driver.DriverStatus status);
    
    @Query("SELECT AVG(d.rating) FROM Driver d")
    Double getAverageRating();
    
    @Query("SELECT d FROM Driver d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.plate) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Driver> searchDrivers(@Param("search") String search, Pageable pageable);
    
    boolean existsByPhone(String phone);
    
    boolean existsByEmail(String email);
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    @Query("SELECT d FROM Driver d WHERE d.tenantId = :tenantId")
    Page<Driver> findAllByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);
    
    @Query("SELECT d FROM Driver d WHERE d.tenantId = :tenantId AND d.status = :status")
    List<Driver> findByStatusAndTenantId(@Param("status") Driver.DriverStatus status, @Param("tenantId") Long tenantId);
    
    @Query("SELECT d FROM Driver d WHERE d.tenantId = :tenantId AND d.status = :status")
    Page<Driver> findByStatusAndTenantId(@Param("status") Driver.DriverStatus status, @Param("tenantId") Long tenantId, Pageable pageable);
    
    @Query("SELECT COUNT(d) FROM Driver d WHERE d.tenantId = :tenantId AND d.status = :status")
    long countByStatusAndTenantId(@Param("status") Driver.DriverStatus status, @Param("tenantId") Long tenantId);
    
    @Query("SELECT AVG(d.rating) FROM Driver d WHERE d.tenantId = :tenantId")
    Double getAverageRatingByTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT d FROM Driver d WHERE d.tenantId = :tenantId AND (" +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.plate) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Driver> searchDriversByTenantId(@Param("search") String search, @Param("tenantId") Long tenantId, Pageable pageable);
    
    @Query("SELECT COUNT(d) FROM Driver d WHERE d.tenantId = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);
}

