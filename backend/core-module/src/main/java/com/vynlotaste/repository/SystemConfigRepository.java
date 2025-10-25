package com.vynlotaste.repository;

import com.vynlotaste.entity.SystemConfig;
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
 * SystemConfigRepository - Multi-Tenancy Support
 * IMPORTANTE: Queries globais + queries filtradas por tenant_id
 * Updated: 2025-10-25 | Validação de unicidade por tenant (LGPD Art. 46)
 */
@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long>, JpaSpecificationExecutor<SystemConfig> {
    
    // ============================================================================
    // QUERIES GLOBAIS (APENAS SUPER ADMIN - sem filtro tenant_id)
    // ============================================================================
    
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.scope = 'GLOBAL'")
    List<SystemConfig> findGlobalConfigs();
    
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.category = :category")
    List<SystemConfig> findByCategory(@Param("category") SystemConfig.ConfigCategory category);
    
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.configKey = :configKey")
    Optional<SystemConfig> findByConfigKey(@Param("configKey") String configKey);
    
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.scope = 'GLOBAL' AND sc.category = :category")
    List<SystemConfig> findGlobalConfigsByCategory(@Param("category") SystemConfig.ConfigCategory category);
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.tenantId = :tenantId")
    Page<SystemConfig> findAllByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);
    
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.tenantId = :tenantId AND sc.category = :category")
    List<SystemConfig> findByTenantIdAndCategory(@Param("tenantId") Long tenantId, @Param("category") SystemConfig.ConfigCategory category);
    
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.tenantId = :tenantId AND sc.configKey = :configKey")
    Optional<SystemConfig> findByTenantIdAndConfigKey(@Param("tenantId") Long tenantId, @Param("configKey") String configKey);
    
    @Query("SELECT sc FROM SystemConfig sc WHERE sc.tenantId = :tenantId AND sc.scope = :scope")
    List<SystemConfig> findByTenantIdAndScope(@Param("tenantId") Long tenantId, @Param("scope") SystemConfig.ConfigScope scope);
    
    // ============================================================================
    // QUERIES HÍBRIDAS (Global + Tenant específico)
    // ============================================================================
    
    @Query("""
        SELECT sc FROM SystemConfig sc 
        WHERE (sc.scope = 'GLOBAL' OR sc.tenantId = :tenantId) 
        AND sc.category = :category
        ORDER BY sc.scope ASC, sc.sortOrder ASC
        """)
    List<SystemConfig> findEffectiveConfigsByCategory(@Param("tenantId") Long tenantId, @Param("category") SystemConfig.ConfigCategory category);
    
    @Query("""
        SELECT sc FROM SystemConfig sc 
        WHERE (sc.scope = 'GLOBAL' OR sc.tenantId = :tenantId) 
        AND sc.configKey = :configKey
        ORDER BY sc.scope ASC
        """)
    List<SystemConfig> findEffectiveConfigsByKey(@Param("tenantId") Long tenantId, @Param("configKey") String configKey);
    
    // ============================================================================
    // QUERIES DE VALIDAÇÃO
    // ============================================================================
    
    @Query("SELECT COUNT(sc) FROM SystemConfig sc WHERE sc.configKey = :configKey AND sc.tenantId = :tenantId")
    long countByConfigKeyAndTenantId(@Param("configKey") String configKey, @Param("tenantId") Long tenantId);
    
    @Query("SELECT COUNT(sc) FROM SystemConfig sc WHERE sc.configKey = :configKey AND sc.scope = 'GLOBAL'")
    long countGlobalConfigsByKey(@Param("configKey") String configKey);
    
    // ============================================================================
    // QUERIES DE ESTATÍSTICAS
    // ============================================================================
    
    @Query("SELECT COUNT(sc) FROM SystemConfig sc WHERE sc.tenantId = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT COUNT(sc) FROM SystemConfig sc WHERE sc.scope = 'GLOBAL'")
    long countGlobalConfigs();
    
    @Query("SELECT sc.category, COUNT(sc) FROM SystemConfig sc WHERE sc.tenantId = :tenantId GROUP BY sc.category")
    List<Object[]> countByTenantIdAndCategory(@Param("tenantId") Long tenantId);
}
