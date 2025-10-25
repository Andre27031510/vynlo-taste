package com.vynlotaste.repository;

import com.vynlotaste.entity.Integration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * IntegrationRepository - Multi-Tenancy Support
 * IMPORTANTE: Queries globais + queries filtradas por tenant_id
 * Updated: 2025-10-25 | Validação de unicidade por tenant (LGPD Art. 46)
 */
@Repository
public interface IntegrationRepository extends JpaRepository<Integration, Long>, JpaSpecificationExecutor<Integration> {
    
    // ============================================================================
    // QUERIES GLOBAIS (APENAS SUPER ADMIN - sem filtro tenant_id)
    // ============================================================================
    
    @Query("SELECT i FROM Integration i WHERE i.active = true")
    List<Integration> findByActiveTrue();
    
    @Query("SELECT i FROM Integration i WHERE i.type = :type AND i.active = true")
    List<Integration> findByTypeAndActiveTrue(@Param("type") Integration.IntegrationType type);
    
    @Query("SELECT i FROM Integration i WHERE i.status = :status")
    List<Integration> findByStatus(@Param("status") Integration.IntegrationStatus status);
    
    @Query("SELECT COUNT(i) FROM Integration i WHERE i.active = true")
    long countActiveIntegrations();
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    @Query("SELECT i FROM Integration i WHERE i.tenantId = :tenantId")
    Page<Integration> findAllByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);
    
    @Query("SELECT i FROM Integration i WHERE i.tenantId = :tenantId AND i.active = true")
    List<Integration> findByActiveTrueAndTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT i FROM Integration i WHERE i.tenantId = :tenantId AND i.type = :type")
    List<Integration> findByTenantIdAndType(@Param("tenantId") Long tenantId, @Param("type") Integration.IntegrationType type);
    
    @Query("SELECT i FROM Integration i WHERE i.tenantId = :tenantId AND i.status = :status")
    List<Integration> findByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") Integration.IntegrationStatus status);
    
    @Query("SELECT i FROM Integration i WHERE i.tenantId = :tenantId AND i.name = :name")
    Optional<Integration> findByTenantIdAndName(@Param("tenantId") Long tenantId, @Param("name") String name);
    
    @Query("SELECT i FROM Integration i WHERE i.tenantId = :tenantId AND i.apiKey = :apiKey")
    Optional<Integration> findByTenantIdAndApiKey(@Param("tenantId") Long tenantId, @Param("apiKey") String apiKey);
    
    @Query("SELECT COUNT(i) FROM Integration i WHERE i.tenantId = :tenantId AND i.active = true")
    long countActiveIntegrationsByTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT SUM(i.ordersCount) FROM Integration i WHERE i.tenantId = :tenantId AND i.active = true")
    Long sumOrdersCountByTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT i FROM Integration i WHERE i.apiKey = :apiKey")
    Optional<Integration> findByApiKey(@Param("apiKey") String apiKey);
}
