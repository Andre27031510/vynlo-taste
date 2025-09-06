package com.vynlotaste.financial.repository;

import com.vynlotaste.financial.FinancialTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository para transações financeiras do sistema Vynlo Taste
 * Fornece métodos de busca avançados e consultas personalizadas
 */
@Repository
public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {

    // ==================== BUSCAS BÁSICAS ====================

    /**
     * Busca transações por restaurante
     */
    List<FinancialTransaction> findByRestaurantId(Long restaurantId);

    /**
     * Busca transações por conta
     */
    List<FinancialTransaction> findByAccountId(Long accountId);

    /**
     * Busca transações por tipo
     */
    List<FinancialTransaction> findByType(FinancialTransaction.TransactionType type);

    /**
     * Busca transações por categoria
     */
    List<FinancialTransaction> findByCategory(FinancialTransaction.TransactionCategory category);

    /**
     * Busca transações por status
     */
    List<FinancialTransaction> findByStatus(FinancialTransaction.TransactionStatus status);

    /**
     * Busca transações por data
     */
    List<FinancialTransaction> findByTransactionDate(LocalDate transactionDate);

    /**
     * Busca transações por período
     */
    List<FinancialTransaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);

    // ==================== BUSCAS COMBINADAS ====================

    /**
     * Busca transações por restaurante e tipo
     */
    List<FinancialTransaction> findByRestaurantIdAndType(Long restaurantId, FinancialTransaction.TransactionType type);

    /**
     * Busca transações por restaurante e categoria
     */
    List<FinancialTransaction> findByRestaurantIdAndCategory(Long restaurantId, FinancialTransaction.TransactionCategory category);

    /**
     * Busca transações por restaurante e status
     */
    List<FinancialTransaction> findByRestaurantIdAndStatus(Long restaurantId, FinancialTransaction.TransactionStatus status);

    /**
     * Busca transações por restaurante e período
     */
    List<FinancialTransaction> findByRestaurantIdAndTransactionDateBetween(Long restaurantId, LocalDate startDate, LocalDate endDate);

    /**
     * Busca transações por restaurante, tipo e período
     */
    List<FinancialTransaction> findByRestaurantIdAndTypeAndTransactionDateBetween(
        Long restaurantId, FinancialTransaction.TransactionType type, LocalDate startDate, LocalDate endDate);

    /**
     * Busca transações por restaurante, categoria e período
     */
    List<FinancialTransaction> findByRestaurantIdAndCategoryAndTransactionDateBetween(
        Long restaurantId, FinancialTransaction.TransactionCategory category, LocalDate startDate, LocalDate endDate);

    // ==================== BUSCAS PAGINADAS ====================

    /**
     * Busca transações por restaurante com paginação
     */
    Page<FinancialTransaction> findByRestaurantId(Long restaurantId, Pageable pageable);

    /**
     * Busca transações por restaurante e tipo com paginação
     */
    Page<FinancialTransaction> findByRestaurantIdAndType(Long restaurantId, FinancialTransaction.TransactionType type, Pageable pageable);

    /**
     * Busca transações por restaurante e categoria com paginação
     */
    Page<FinancialTransaction> findByRestaurantIdAndCategory(Long restaurantId, FinancialTransaction.TransactionCategory category, Pageable pageable);

    /**
     * Busca transações por restaurante e status com paginação
     */
    Page<FinancialTransaction> findByRestaurantIdAndStatus(Long restaurantId, FinancialTransaction.TransactionStatus status, Pageable pageable);

    /**
     * Busca transações por restaurante e período com paginação
     */
    Page<FinancialTransaction> findByRestaurantIdAndTransactionDateBetween(Long restaurantId, LocalDate startDate, LocalDate endDate, Pageable pageable);

    // ==================== CONSULTAS PERSONALIZADAS ====================

    /**
     * Busca transações com filtros avançados
     */
    @Query("SELECT t FROM FinancialTransaction t WHERE t.restaurant.id = :restaurantId " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:category IS NULL OR t.category = :category) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:startDate IS NULL OR t.transactionDate >= :startDate) " +
           "AND (:endDate IS NULL OR t.transactionDate <= :endDate) " +
           "AND (:minAmount IS NULL OR t.amount >= :minAmount) " +
           "AND (:maxAmount IS NULL OR t.amount <= :maxAmount) " +
           "AND (:accountId IS NULL OR t.account.id = :accountId) " +
           "AND (:search IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY t.transactionDate DESC, t.createdAt DESC")
    Page<FinancialTransaction> findTransactionsWithFilters(
        @Param("restaurantId") Long restaurantId,
        @Param("type") FinancialTransaction.TransactionType type,
        @Param("category") FinancialTransaction.TransactionCategory category,
        @Param("status") FinancialTransaction.TransactionStatus status,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("minAmount") BigDecimal minAmount,
        @Param("maxAmount") BigDecimal maxAmount,
        @Param("accountId") Long accountId,
        @Param("search") String search,
        Pageable pageable);

    /**
     * Busca transações de uma conta com filtros
     */
    @Query("SELECT t FROM FinancialTransaction t WHERE t.account.id = :accountId " +
           "AND (:startDate IS NULL OR t.transactionDate >= :startDate) " +
           "AND (:endDate IS NULL OR t.transactionDate <= :endDate) " +
           "ORDER BY t.transactionDate DESC, t.createdAt DESC")
    Page<FinancialTransaction> findAccountTransactionsWithFilters(
        @Param("accountId") Long accountId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable);

    // ==================== CONSULTAS DE AGRAGAÇÃO ====================

    /**
     * Calcula receita total por período
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.type = 'INCOME' " +
           "AND t.status = 'COMPLETED' " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalRevenue(
        @Param("restaurantId") Long restaurantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    /**
     * Calcula despesas totais por período
     */
    @Query("SELECT COALESCE(SUM(ABS(t.amount)), 0) FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.type = 'EXPENSE' " +
           "AND t.status = 'COMPLETED' " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateTotalExpenses(
        @Param("restaurantId") Long restaurantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    /**
     * Calcula receita por categoria
     */
    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) as total, COUNT(t) as count " +
           "FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.type = 'INCOME' " +
           "AND t.status = 'COMPLETED' " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.category " +
           "ORDER BY total DESC")
    List<Object[]> calculateRevenueByCategory(
        @Param("restaurantId") Long restaurantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    /**
     * Calcula despesas por categoria
     */
    @Query("SELECT t.category, COALESCE(SUM(ABS(t.amount)), 0) as total, COUNT(t) as count " +
           "FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.type = 'EXPENSE' " +
           "AND t.status = 'COMPLETED' " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.category " +
           "ORDER BY total DESC")
    List<Object[]> calculateExpensesByCategory(
        @Param("restaurantId") Long restaurantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    // ==================== CONSULTAS DE TENDÊNCIAS ====================

    /**
     * Busca tendências diárias
     */
    @Query("SELECT t.transactionDate, " +
           "COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) as revenue, " +
           "COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN ABS(t.amount) ELSE 0 END), 0) as expenses, " +
           "COUNT(t) as transactionCount " +
           "FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.status = 'COMPLETED' " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.transactionDate " +
           "ORDER BY t.transactionDate")
    List<Object[]> getDailyTrends(
        @Param("restaurantId") Long restaurantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    /**
     * Busca tendências semanais
     */
    @Query("SELECT YEARWEEK(t.transactionDate) as week, " +
           "MIN(t.transactionDate) as weekStart, " +
           "MAX(t.transactionDate) as weekEnd, " +
           "COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) as revenue, " +
           "COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN ABS(t.amount) ELSE 0 END), 0) as expenses, " +
           "COUNT(t) as transactionCount " +
           "FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.status = 'COMPLETED' " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY YEARWEEK(t.transactionDate) " +
           "ORDER BY week")
    List<Object[]> getWeeklyTrends(
        @Param("restaurantId") Long restaurantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    /**
     * Busca tendências mensais
     */
    @Query("SELECT YEAR(t.transactionDate) as year, MONTH(t.transactionDate) as month, " +
           "COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) as revenue, " +
           "COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN ABS(t.amount) ELSE 0 END), 0) as expenses, " +
           "COUNT(t) as transactionCount " +
           "FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.status = 'COMPLETED' " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(t.transactionDate), MONTH(t.transactionDate) " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> getMonthlyTrends(
        @Param("restaurantId") Long restaurantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    // ==================== CONSULTAS DE ALERTAS ====================

    /**
     * Busca pagamentos vencidos
     */
    @Query("SELECT t FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.type = 'EXPENSE' " +
           "AND t.status = 'PENDING' " +
           "AND t.dueDate < :currentDate " +
           "ORDER BY t.dueDate ASC")
    List<FinancialTransaction> findOverduePayments(
        @Param("restaurantId") Long restaurantId,
        @Param("currentDate") LocalDate currentDate);

    /**
     * Busca pagamentos próximos do vencimento
     */
    @Query("SELECT t FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.type = 'EXPENSE' " +
           "AND t.status = 'PENDING' " +
           "AND t.dueDate BETWEEN :currentDate AND :futureDate " +
           "ORDER BY t.dueDate ASC")
    List<FinancialTransaction> findUpcomingPayments(
        @Param("restaurantId") Long restaurantId,
        @Param("currentDate") LocalDate currentDate,
        @Param("futureDate") LocalDate futureDate);

    // ==================== CONSULTAS DE RELATÓRIOS ====================

    /**
     * Busca transações para relatório
     */
    @Query("SELECT t FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "ORDER BY t.transactionDate DESC, t.createdAt DESC")
    List<FinancialTransaction> findTransactionsForReport(
        @Param("restaurantId") Long restaurantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    /**
     * Conta transações por status
     */
    @Query("SELECT t.status, COUNT(t) FROM FinancialTransaction t " +
           "WHERE t.restaurant.id = :restaurantId " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.status")
    List<Object[]> countTransactionsByStatus(
        @Param("restaurantId") Long restaurantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    // ==================== MÉTODOS DE EXISTÊNCIA ====================

    /**
     * Verifica se existem transações para um restaurante
     */
    boolean existsByRestaurantId(Long restaurantId);

    /**
     * Verifica se existem transações para uma conta
     */
    boolean existsByAccountId(Long accountId);

    /**
     * Verifica se existem transações por tipo
     */
    boolean existsByRestaurantIdAndType(Long restaurantId, FinancialTransaction.TransactionType type);

    /**
     * Verifica se existem transações por categoria
     */
    boolean existsByRestaurantIdAndCategory(Long restaurantId, FinancialTransaction.TransactionCategory category);

    // ==================== MÉTODOS DE CONTAGEM ====================

    /**
     * Conta transações por restaurante
     */
    long countByRestaurantId(Long restaurantId);

    /**
     * Conta transações por conta
     */
    long countByAccountId(Long accountId);

    /**
     * Conta transações por tipo
     */
    long countByRestaurantIdAndType(Long restaurantId, FinancialTransaction.TransactionType type);

    /**
     * Conta transações por categoria
     */
    long countByRestaurantIdAndCategory(Long restaurantId, FinancialTransaction.TransactionCategory category);

    /**
     * Conta transações por status
     */
    long countByRestaurantIdAndStatus(Long restaurantId, FinancialTransaction.TransactionStatus status);
}
