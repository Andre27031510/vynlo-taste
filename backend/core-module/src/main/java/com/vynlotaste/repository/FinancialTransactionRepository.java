package com.vynlotaste.repository;

import com.vynlotaste.entity.FinancialTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository para transações financeiras
 * v2.1.3 - Implementação completa do fluxo financeiro
 * Baseado em melhores práticas TOTVS/SAP/Oracle
 */
@Repository
public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {

    /**
     * Buscar transação por ID e tenant_id (segurança multi-tenant)
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.id = :id AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    Optional<FinancialTransaction> findByIdAndTenantId(@Param("id") Long id, @Param("tenantId") Long tenantId);

    /**
     * Buscar transações por tenant_id (multi-tenancy)
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    Page<FinancialTransaction> findAllByTenantId(@Param("tenantId") Long tenantId, Pageable pageable);

    /**
     * ✅ NOVO: Buscar transações por tenant_id e status (multi-tenancy com filtro)
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.tenantId = :tenantId AND ft.status = :status AND ft.deletedAt IS NULL")
    Page<FinancialTransaction> findAllByTenantIdAndStatus(@Param("tenantId") Long tenantId, @Param("status") String status, Pageable pageable);

    /**
     * Buscar transações por pedido
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.orderId = :orderId AND ft.deletedAt IS NULL")
    List<FinancialTransaction> findByOrderId(@Param("orderId") Long orderId);

    /**
     * ✅ NOVO: Buscar transações por pedido e tenant (multi-tenancy seguro)
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.orderId = :orderId AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    List<FinancialTransaction> findByOrderIdAndTenantId(@Param("orderId") Long orderId, @Param("tenantId") Long tenantId);

    /**
     * Buscar transações por status
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.status = :status AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    Page<FinancialTransaction> findByStatusAndTenantId(@Param("status") FinancialTransaction.Status status, 
                                                       @Param("tenantId") Long tenantId, 
                                                       Pageable pageable);

    /**
     * Buscar transações por período
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.transactionDate BETWEEN :startDate AND :endDate AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    List<FinancialTransaction> findByTransactionDateBetweenAndTenantId(@Param("startDate") LocalDate startDate,
                                                                       @Param("endDate") LocalDate endDate,
                                                                       @Param("tenantId") Long tenantId);

    /**
     * Contar transações por status
     */
    @Query("SELECT COUNT(ft) FROM FinancialTransaction ft WHERE ft.status = :status AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    long countByStatusAndTenantId(@Param("status") FinancialTransaction.Status status, @Param("tenantId") Long tenantId);

    /**
     * Somar receitas por período
     */
    @Query("SELECT COALESCE(SUM(ft.amount), 0) FROM FinancialTransaction ft WHERE ft.type = 'INCOME' AND ft.status = 'COMPLETED' AND ft.transactionDate BETWEEN :startDate AND :endDate AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    BigDecimal sumIncomeByPeriodAndTenantId(@Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate,
                                            @Param("tenantId") Long tenantId);

    /**
     * Somar despesas por período
     */
    @Query("SELECT COALESCE(SUM(ft.amount), 0) FROM FinancialTransaction ft WHERE ft.type = 'EXPENSE' AND ft.status = 'COMPLETED' AND ft.transactionDate BETWEEN :startDate AND :endDate AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    BigDecimal sumExpenseByPeriodAndTenantId(@Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate,
                                            @Param("tenantId") Long tenantId);

    /**
     * Buscar transações pendentes
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.status = 'PENDING' AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL ORDER BY ft.transactionDate ASC")
    List<FinancialTransaction> findPendingTransactionsByTenantId(@Param("tenantId") Long tenantId);

    /**
     * Buscar transação por número de referência
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.referenceNumber = :referenceNumber AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    Optional<FinancialTransaction> findByReferenceNumberAndTenantId(@Param("referenceNumber") String referenceNumber,
                                                                    @Param("tenantId") Long tenantId);

    /**
     * Buscar transações por categoria
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.category = :category AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    Page<FinancialTransaction> findByCategoryAndTenantId(@Param("category") String category,
                                                         @Param("tenantId") Long tenantId,
                                                         Pageable pageable);

    /**
     * Buscar transações por método de pagamento
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.paymentMethod = :paymentMethod AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    Page<FinancialTransaction> findByPaymentMethodAndTenantId(@Param("paymentMethod") String paymentMethod,
                                                              @Param("tenantId") Long tenantId,
                                                              Pageable pageable);

    /**
     * Contar transações por tipo
     */
    @Query("SELECT COUNT(ft) FROM FinancialTransaction ft WHERE ft.type = :type AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    long countByTypeAndTenantId(@Param("type") FinancialTransaction.Type type, @Param("tenantId") Long tenantId);

    /**
     * Buscar transações por conta
     */
    @Query("SELECT ft FROM FinancialTransaction ft WHERE ft.accountId = :accountId AND ft.tenantId = :tenantId AND ft.deletedAt IS NULL")
    List<FinancialTransaction> findByAccountIdAndTenantId(@Param("accountId") Long accountId, @Param("tenantId") Long tenantId);
}
