package com.vynlotaste.repository;

import com.vynlotaste.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * OrderRepository - Multi-Tenancy Support
 * IMPORTANTE: Adicionar métodos com filtro de tenant_id
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    
    // ============================================================================
    // ⚠️ QUERIES GLOBAIS (APENAS SUPER ADMIN) - USO RESTRITO
    // ============================================================================
    // 🚨 SEGURANÇA: Estas queries retornam dados de TODOS os tenants
    // 🚨 USO: Apenas Super Admins podem usar (TenantContext.isSuperAdmin() == true)
    // 🚨 VALIDAÇÃO: Services DEVEM verificar TenantContext.isSuperAdmin() antes de usar
    // ============================================================================
    
    /**
     * ⚠️ GLOBAL: Buscar pedidos por cliente (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    List<Order> findByCustomerId(Long customerId);
    
    /**
     * ⚠️ GLOBAL: Buscar pedidos por status (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @EntityGraph(attributePaths = {"customer", "type"})
    List<Order> findByStatus(Order.OrderStatus status);
    
    /**
     * ⚠️ GLOBAL: Buscar pedido por número (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    Order findByOrderNumber(String orderNumber);
    
    /**
     * ⚠️ GLOBAL: Buscar pedidos por período (TODOS os tenants)
     * 🚨 SEGURANÇA: Usar apenas se TenantContext.isSuperAdmin() == true
     */
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :since ORDER BY o.createdAt DESC")
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    List<Order> findByCreatedAtAfterOrderByCreatedAtDesc(@Param("since") LocalDateTime since);
    
    @Query("SELECT o FROM Order o WHERE o.status IN :statuses")
    @EntityGraph(attributePaths = {"customer", "type"})
    Page<Order> findByStatusIn(@Param("statuses") List<Order.OrderStatus> statuses, Pageable pageable);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status AND o.createdAt >= :since")
    long countByStatusAndCreatedAtAfter(@Param("status") Order.OrderStatus status, @Param("since") LocalDateTime since);
    
    long countByStatus(Order.OrderStatus status);
    
    long countByCreatedAtAfter(LocalDateTime since);
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt >= :since")
    java.math.BigDecimal sumTotalAmountByCreatedAtAfter(@Param("since") LocalDateTime since);
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    // ✅ CRÍTICO: Buscar pedido por ID e tenant_id (segurança multi-tenant)
    @Query("SELECT o FROM Order o WHERE o.id = :id AND o.tenantId = :tenantId")
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    java.util.Optional<Order> findByIdAndTenantId(@Param("id") Long id, @Param("tenantId") Long tenantId);
    
    @Query("SELECT o FROM Order o WHERE o.tenantId = :tenantId")
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    Page<Order> findAllByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.tenantId = :tenantId AND o.status = :status")
    @EntityGraph(attributePaths = {"customer", "type"})
    List<Order> findByStatusAndTenantId(@Param("status") Order.OrderStatus status, @Param("tenantId") Long tenantId);
    
    @Query("SELECT o FROM Order o WHERE o.tenantId = :tenantId AND o.createdAt >= :since ORDER BY o.createdAt DESC")
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    List<Order> findByTenantIdAndCreatedAtAfter(@Param("tenantId") Long tenantId, @Param("since") LocalDateTime since);
    
    @Query("SELECT o FROM Order o WHERE o.tenantId = :tenantId AND o.createdAt BETWEEN :start AND :end")
    @EntityGraph(attributePaths = {"customer", "status", "type"})
    List<Order> findByTenantIdAndCreatedAtBetween(@Param("tenantId") Long tenantId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.tenantId = :tenantId AND o.status = :status AND o.createdAt >= :since")
    long countByTenantIdAndStatusAndCreatedAtAfter(@Param("tenantId") Long tenantId, @Param("status") Order.OrderStatus status, @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.tenantId = :tenantId AND o.status = :status")
    long countByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") Order.OrderStatus status);
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.tenantId = :tenantId AND o.createdAt >= :since")
    java.math.BigDecimal sumTotalAmountByTenantIdAndCreatedAtAfter(@Param("tenantId") Long tenantId, @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.tenantId = :tenantId AND o.createdAt >= :since")
    long countByTenantIdAndCreatedAtAfter(@Param("tenantId") Long tenantId, @Param("since") LocalDateTime since);

    // ✅ NOVO: Métodos para contar TODOS os pedidos e somar TODA a receita
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.tenantId = :tenantId")
    long countByTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.tenantId = :tenantId")
    java.math.BigDecimal sumTotalAmountByTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    java.math.BigDecimal sumTotalAmount();
}