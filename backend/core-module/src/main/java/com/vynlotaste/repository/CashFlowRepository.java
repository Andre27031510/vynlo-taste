package com.vynlotaste.repository;

import com.vynlotaste.entity.CashFlow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for CashFlow entity operations
 * Provides data access methods for cash flow management
 * Multi-Tenancy Support
 */
@Repository
public interface CashFlowRepository extends JpaRepository<CashFlow, Long>, JpaSpecificationExecutor<CashFlow> {
    
    // ============================================================================
    // QUERIES GLOBAIS (APENAS SUPER ADMIN - sem filtro tenant_id)
    // ============================================================================
    
    /**
     * Find cash flow entries by type with pagination
     * @param type Cash flow type (INCOME or EXPENSE)
     * @param pageable Pagination parameters
     * @return Page of cash flow entries
     */
    Page<CashFlow> findByType(String type, Pageable pageable);
    
    /**
     * Find cash flow entries by status with pagination
     * @param status Cash flow status (CONFIRMED, PENDING, CANCELLED)
     * @param pageable Pagination parameters
     * @return Page of cash flow entries
     */
    Page<CashFlow> findByStatus(String status, Pageable pageable);
    
    /**
     * Find cash flow entries between dates with pagination
     * @param start Start date (inclusive)
     * @param end End date (inclusive)
     * @param pageable Pagination parameters
     * @return Page of cash flow entries
     */
    Page<CashFlow> findByDateBetween(LocalDate start, LocalDate end, Pageable pageable);
    
    /**
     * Find cash flow entries by category with pagination
     * @param category Cash flow category
     * @param pageable Pagination parameters
     * @return Page of cash flow entries
     */
    Page<CashFlow> findByCategory(String category, Pageable pageable);
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    @org.springframework.data.jpa.repository.Query("SELECT c FROM CashFlow c WHERE c.tenantId = :tenantId")
    Page<CashFlow> findAllByTenantId(@org.springframework.data.repository.query.Param("tenantId") Long tenantId, Pageable pageable);
    
    @org.springframework.data.jpa.repository.Query("SELECT c FROM CashFlow c WHERE c.tenantId = :tenantId AND c.type = :type")
    Page<CashFlow> findByTypeAndTenantId(@org.springframework.data.repository.query.Param("type") String type, @org.springframework.data.repository.query.Param("tenantId") Long tenantId, Pageable pageable);

    // ✅ NOVO: Métodos para integração com pedidos e transações financeiras

    /**
     * Buscar entradas de fluxo de caixa por pedido
     */
    @org.springframework.data.jpa.repository.Query("SELECT c FROM CashFlow c WHERE c.orderId = :orderId")
    List<CashFlow> findByOrderId(@org.springframework.data.repository.query.Param("orderId") Long orderId);

    /**
     * Buscar entradas de fluxo de caixa por transação financeira
     */
    @org.springframework.data.jpa.repository.Query("SELECT c FROM CashFlow c WHERE c.financialTransactionId = :financialTransactionId")
    List<CashFlow> findByFinancialTransactionId(@org.springframework.data.repository.query.Param("financialTransactionId") Long financialTransactionId);

    /**
     * Buscar entradas de fluxo de caixa por pedido e tenant
     */
    @org.springframework.data.jpa.repository.Query("SELECT c FROM CashFlow c WHERE c.orderId = :orderId AND c.tenantId = :tenantId")
    List<CashFlow> findByOrderIdAndTenantId(@org.springframework.data.repository.query.Param("orderId") Long orderId, @org.springframework.data.repository.query.Param("tenantId") Long tenantId);

    /**
     * Buscar entradas de fluxo de caixa por transação financeira e tenant
     */
    @org.springframework.data.jpa.repository.Query("SELECT c FROM CashFlow c WHERE c.financialTransactionId = :financialTransactionId AND c.tenantId = :tenantId")
    List<CashFlow> findByFinancialTransactionIdAndTenantId(@org.springframework.data.repository.query.Param("financialTransactionId") Long financialTransactionId, @org.springframework.data.repository.query.Param("tenantId") Long tenantId);

    /**
     * Contar entradas de fluxo de caixa por status e tenant
     */
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(c) FROM CashFlow c WHERE c.status = :status AND c.tenantId = :tenantId")
    long countByStatusAndTenantId(@org.springframework.data.repository.query.Param("status") String status, @org.springframework.data.repository.query.Param("tenantId") Long tenantId);

    /**
     * Somar entradas de fluxo de caixa por tipo e período
     */
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(c.amount), 0) FROM CashFlow c WHERE c.type = :type AND c.status = 'CONFIRMED' AND c.date BETWEEN :startDate AND :endDate AND c.tenantId = :tenantId")
    java.math.BigDecimal sumByTypeAndPeriodAndTenantId(@org.springframework.data.repository.query.Param("type") String type, @org.springframework.data.repository.query.Param("startDate") LocalDate startDate, @org.springframework.data.repository.query.Param("endDate") LocalDate endDate, @org.springframework.data.repository.query.Param("tenantId") Long tenantId);
}