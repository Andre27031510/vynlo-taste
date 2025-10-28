package com.vynlotaste.repository.church;

import com.vynlotaste.entity.church.Church;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * Repository para Church - EKKLESIA
 * ============================================================================
 * 
 * MULTI-TENANCY: Todas as queries filtram por tenant_id
 * ISOLAMENTO: Igrejas de Tenant X não vê igrejas de Tenant Y
 * 
 * @version 1.0.0
 * @author Vynlo Tech - EKKLESIA Implementation
 * @created 2025-10-28
 * ============================================================================
 */
@Repository
public interface ChurchRepository extends JpaRepository<Church, Long> {
    
    /**
     * Buscar igrejas por tenant_id (MULTI-TENANCY)
     */
    Page<Church> findAllByTenantId(Long tenantId, Pageable pageable);
    
    /**
     * Buscar igrejas por tenant_id e status
     */
    Page<Church> findByTenantIdAndStatus(Long tenantId, String status, Pageable pageable);
    
    /**
     * Buscar igreja por ID e tenant_id (MULTI-TENANCY)
     */
    Optional<Church> findByIdAndTenantId(Long id, Long tenantId);
    
    /**
     * Buscar igrejas por porte
     */
    @Query("SELECT c FROM Church c WHERE c.tenantId = :tenantId AND c.porte = :porte AND c.deletedAt IS NULL")
    Page<Church> findByTenantIdAndPorte(@Param("tenantId") Long tenantId, @Param("porte") String porte, Pageable pageable);
    
    /**
     * Buscar igrejas por cidade
     */
    @Query("SELECT c FROM Church c WHERE c.tenantId = :tenantId AND LOWER(c.cidade) LIKE LOWER(CONCAT('%', :cidade, '%')) AND c.deletedAt IS NULL")
    Page<Church> findByTenantIdAndCidadeContaining(@Param("tenantId") Long tenantId, @Param("cidade") String cidade, Pageable pageable);
    
    /**
     * Listar todas as igrejas ativas por tenant (sem paginação)
     */
    List<Church> findAllByTenantIdAndStatusAndDeletedAtIsNull(Long tenantId, String status);
}

