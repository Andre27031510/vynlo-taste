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
    
    // ============================================================================
    // QUERIES GLOBAIS (APENAS SUPER ADMIN)
    // Mantidas para compatibilidade, mas devem ser usadas apenas por Super Admins
    // ============================================================================
    
    List<Product> findByAvailableTrue();
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    Page<Product> findByAvailableTrue(Pageable pageable);
    
    List<Product> findByCategory(String category);
    
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= :threshold")
    List<Product> findByStockQuantityLessThanEqual(@Param("threshold") Integer threshold);
    
    List<Product> findByStockQuantityLessThan(Integer threshold);
    
    // ✅ FIX: Incluir soft delete para consistência com findAll()
    @Query("SELECT COUNT(p) FROM Product p WHERE p.available = true AND p.deleted = false")
    long countByAvailableTrue();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity < :threshold AND p.deleted = false")
    long countByStockQuantityLessThan(@Param("threshold") Integer threshold);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.available = false AND p.deleted = false")
    long countByAvailableFalseAndDeletedFalse();
}
// Modified: 2025-10-14 21:25 UTC | CRITICAL FIX: Soft delete consistency - Card vs List discrepancy resolved