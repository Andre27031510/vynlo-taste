package com.vynlotaste.repository;

import com.vynlotaste.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * ProductRepository - Multi-Tenancy Support
 * Commit: Multi-tenancy implementation (isolamento de dados)
 * 
 * IMPORTANTE: Todas as queries DEVEM filtrar por tenant_id
 * EXCEÇÃO: Super Admins usam métodos sem filtro (findAll, etc)
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    // ✅ CRÍTICO: Buscar produto por ID e tenant_id (segurança multi-tenant)
    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.tenantId = :tenantId AND p.deleted = false")
    java.util.Optional<Product> findByIdAndTenantId(@Param("id") Long id, @Param("tenantId") Long tenantId);
    
    /**
     * Buscar todos os produtos de um tenant específico
     * USO: ProductService quando usuário NÃO é Super Admin
     */
    @Query("SELECT p FROM Product p WHERE p.tenantId = :tenantId AND p.deleted = false")
    List<Product> findByTenantId(@Param("tenantId") Long tenantId);
    
    /**
     * Buscar produtos disponíveis de um tenant específico
     * USO: Clientes normais (Admin Restaurante X vê apenas produtos do Restaurante X)
     */
    @Query("SELECT p FROM Product p WHERE p.tenantId = :tenantId AND p.available = true AND p.deleted = false")
    List<Product> findByAvailableTrueAndTenantId(@Param("tenantId") Long tenantId);
    
    /**
     * Buscar produtos disponíveis paginados de um tenant
     */
    @Query("SELECT p FROM Product p WHERE p.tenantId = :tenantId AND p.available = true AND p.deleted = false")
    Page<Product> findByAvailableTrueAndTenantId(@Param("tenantId") Long tenantId, Pageable pageable);
    
    /**
     * Buscar produtos por categoria de um tenant
     */
    @Query("SELECT p FROM Product p WHERE p.tenantId = :tenantId AND p.category = :category AND p.deleted = false")
    List<Product> findByCategoryAndTenantId(@Param("category") String category, @Param("tenantId") Long tenantId);
    
    /**
     * Contar produtos disponíveis de um tenant
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.tenantId = :tenantId AND p.available = true AND p.deleted = false")
    long countByAvailableTrueAndTenantId(@Param("tenantId") Long tenantId);
    
    /**
     * Buscar produtos com estoque baixo de um tenant
     */
    @Query("SELECT p FROM Product p WHERE p.tenantId = :tenantId AND p.stockQuantity < :threshold AND p.deleted = false")
    List<Product> findByStockQuantityLessThanAndTenantId(@Param("threshold") Integer threshold, @Param("tenantId") Long tenantId);
    
    /**
     * Buscar TODOS os produtos de um tenant PAGINADOS (com soft delete)
     * USO: ProductService.findAll(Pageable) para clientes normais
     */
    @Query("SELECT p FROM Product p WHERE p.tenantId = :tenantId AND p.deleted = false")
    Page<Product> findAllByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);
    
    /**
     * Buscar produtos por nome de um tenant (para search)
     */
    @Query("SELECT p FROM Product p WHERE p.tenantId = :tenantId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) AND p.deleted = false")
    List<Product> findByNameContainingIgnoreCaseAndTenantId(@Param("name") String name, @Param("tenantId") Long tenantId);
    
    // ============================================================================
    // ⚠️ QUERIES GLOBAIS (APENAS SUPER ADMIN) - USO RESTRITO
    // ============================================================================
    // 🚨 SEGURANÇA: Estas queries retornam dados de TODOS os tenants
    // 🚨 USO: Apenas Super Admins podem usar (TenantContext.isSuperAdmin() == true)
    // 🚨 VALIDAÇÃO: Services DEVEM verificar TenantContext.isSuperAdmin() antes de usar
    // ============================================================================
    
    /**
     * ⚠️ GLOBAL: Buscar todos os produtos disponíveis (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @Query("SELECT p FROM Product p WHERE p.available = true AND p.deleted = false")
    List<Product> findByAvailableTrue();
    
    /**
     * ⚠️ GLOBAL: Buscar produtos por nome (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) AND p.deleted = false")
    List<Product> findByNameContainingIgnoreCase(@Param("name") String name);
    
    /**
     * ⚠️ GLOBAL: Buscar produtos disponíveis paginados (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @Query("SELECT p FROM Product p WHERE p.available = true AND p.deleted = false")
    Page<Product> findByAvailableTrue(Pageable pageable);
    
    /**
     * ⚠️ GLOBAL: Buscar produtos por categoria (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.deleted = false")
    List<Product> findByCategory(@Param("category") String category);
    
    /**
     * ⚠️ GLOBAL: Buscar produtos por faixa de preço (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice AND p.deleted = false")
    List<Product> findByPriceBetween(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    /**
     * ⚠️ GLOBAL: Buscar produtos com estoque baixo (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= :threshold AND p.deleted = false")
    List<Product> findByStockQuantityLessThanEqual(@Param("threshold") Integer threshold);
    
    /**
     * ⚠️ GLOBAL: Buscar produtos com estoque baixo (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @Query("SELECT p FROM Product p WHERE p.stockQuantity < :threshold AND p.deleted = false")
    List<Product> findByStockQuantityLessThan(@Param("threshold") Integer threshold);
    
    // ✅ FIX: Incluir soft delete para consistência com findAll()
    @Query("SELECT COUNT(p) FROM Product p WHERE p.available = true AND p.deleted = false")
    long countByAvailableTrue();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity < :threshold AND p.deleted = false")
    long countByStockQuantityLessThan(@Param("threshold") Integer threshold);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.available = false AND p.deleted = false")
    long countByAvailableFalseAndDeletedFalse();
}
// Modified: 2025-10-14 21:25 UTC | CRITICAL FIX: Soft delete consistency - Card vs List discrepancy resolved