package com.vynlotaste.repository;

import com.vynlotaste.entity.ExternalOrder;
import com.vynlotaste.entity.Integration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * ExternalOrderRepository - Multi-Tenancy Support
 * IMPORTANTE: Queries globais + queries filtradas por tenant_id
 * Updated: 2025-10-25 | Validação de unicidade por tenant (LGPD Art. 46)
 */
@Repository
public interface ExternalOrderRepository extends JpaRepository<ExternalOrder, Long>, JpaSpecificationExecutor<ExternalOrder> {
    
    // ============================================================================
    // QUERIES GLOBAIS (APENAS SUPER ADMIN - sem filtro tenant_id)
    // ============================================================================
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.integration = :integration")
    List<ExternalOrder> findByIntegration(@Param("integration") Integration integration);
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.externalId = :externalId")
    Optional<ExternalOrder> findByExternalId(@Param("externalId") String externalId);
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.status = :status")
    List<ExternalOrder> findByStatus(@Param("status") ExternalOrder.ExternalOrderStatus status);
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.syncStatus = :syncStatus")
    List<ExternalOrder> findBySyncStatus(@Param("syncStatus") String syncStatus);
    
    @Query("SELECT COUNT(eo) FROM ExternalOrder eo WHERE eo.createdAt >= :since")
    long countByCreatedAtAfter(@Param("since") LocalDateTime since);
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.tenantId = :tenantId")
    Page<ExternalOrder> findAllByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.tenantId = :tenantId AND eo.integration = :integration")
    List<ExternalOrder> findByTenantIdAndIntegration(@Param("tenantId") Long tenantId, @Param("integration") Integration integration);
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.tenantId = :tenantId AND eo.externalId = :externalId")
    Optional<ExternalOrder> findByTenantIdAndExternalId(@Param("tenantId") Long tenantId, @Param("externalId") String externalId);
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.tenantId = :tenantId AND eo.status = :status")
    List<ExternalOrder> findByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") ExternalOrder.ExternalOrderStatus status);
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.tenantId = :tenantId AND eo.syncStatus = :syncStatus")
    List<ExternalOrder> findByTenantIdAndSyncStatus(@Param("tenantId") Long tenantId, @Param("syncStatus") String syncStatus);
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.tenantId = :tenantId AND eo.createdAt >= :since")
    List<ExternalOrder> findByTenantIdAndCreatedAtAfter(@Param("tenantId") Long tenantId, @Param("since") LocalDateTime since);
    
    @Query("SELECT eo FROM ExternalOrder eo WHERE eo.tenantId = :tenantId AND eo.internalOrderId IS NULL")
    List<ExternalOrder> findByTenantIdAndInternalOrderIdIsNull(@Param("tenantId") Long tenantId);
    
    @Query("SELECT COUNT(eo) FROM ExternalOrder eo WHERE eo.tenantId = :tenantId AND eo.createdAt >= :since")
    long countByTenantIdAndCreatedAtAfter(@Param("tenantId") Long tenantId, @Param("since") LocalDateTime since);
    
    @Query("SELECT SUM(eo.totalAmount) FROM ExternalOrder eo WHERE eo.tenantId = :tenantId AND eo.createdAt >= :since")
    java.math.BigDecimal sumTotalAmountByTenantIdAndCreatedAtAfter(@Param("tenantId") Long tenantId, @Param("since") LocalDateTime since);
}
