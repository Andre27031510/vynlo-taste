package com.vynlotaste.financial.repository;

import com.vynlotaste.financial.FinancialAccount;
import com.vynlotaste.entity.enums.AccountStatus;
import com.vynlotaste.entity.enums.AccountType;
import com.vynlotaste.entity.enums.AccountCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialAccountRepository extends JpaRepository<FinancialAccount, Long> {

    // Buscas básicas
    List<FinancialAccount> findByRestaurantId(Long restaurantId);
    List<FinancialAccount> findByRestaurantIdAndStatus(Long restaurantId, AccountStatus status);
    List<FinancialAccount> findByRestaurantIdAndType(Long restaurantId, AccountType type);
    List<FinancialAccount> findByRestaurantIdAndCategory(Long restaurantId, AccountCategory category);
    
    // Buscas por status
    List<FinancialAccount> findByStatus(AccountStatus status);
    List<FinancialAccount> findByStatusIn(List<AccountStatus> statuses);
    
    // Buscas por tipo
    List<FinancialAccount> findByType(AccountType type);
    List<FinancialAccount> findByTypeIn(List<AccountType> types);
    
    // Buscas por categoria
    List<FinancialAccount> findByCategory(AccountCategory category);
    List<FinancialAccount> findByCategoryIn(List<AccountCategory> categories);
    
    // Buscas por saldo
    List<FinancialAccount> findByCurrentBalanceGreaterThan(BigDecimal amount);
    List<FinancialAccount> findByCurrentBalanceLessThan(BigDecimal amount);
    List<FinancialAccount> findByCurrentBalanceBetween(BigDecimal minAmount, BigDecimal maxAmount);
    
    // Buscas por limite de crédito
    List<FinancialAccount> findByCreditLimitGreaterThan(BigDecimal limit);
    List<FinancialAccount> findByCreditLimitLessThan(BigDecimal limit);
    
    // Buscas por banco
    List<FinancialAccount> findByBankCode(String bankCode);
    List<FinancialAccount> findByBankNameContainingIgnoreCase(String bankName);
    List<FinancialAccount> findByBankCodeAndAccountNumber(String bankCode, String accountNumber);
    
    // Buscas por PIX
    List<FinancialAccount> findByPixKeyContainingIgnoreCase(String pixKey);
    List<FinancialAccount> findByPixKeyType(String pixKeyType);
    
    // Buscas por cartão
    List<FinancialAccount> findByCardLastFourDigits(String lastFourDigits);
    List<FinancialAccount> findByCardBrand(String cardBrand);
    List<FinancialAccount> findByCardExpirationMonthAndCardExpirationYear(Integer month, Integer year);
    
    // Buscas por datas
    List<FinancialAccount> findByDueDateBefore(LocalDateTime date);
    List<FinancialAccount> findByClosingDateBefore(LocalDateTime date);
    List<FinancialAccount> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<FinancialAccount> findByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Buscas por usuário
    List<FinancialAccount> findByCreatedBy(Long userId);
    List<FinancialAccount> findByUpdatedBy(Long userId);
    
    // Buscas combinadas
    List<FinancialAccount> findByRestaurantIdAndTypeAndStatus(Long restaurantId, AccountType type, AccountStatus status);
    List<FinancialAccount> findByRestaurantIdAndCategoryAndStatus(Long restaurantId, AccountCategory category, AccountStatus status);
    
    // Buscas paginadas
    Page<FinancialAccount> findByRestaurantId(Long restaurantId, Pageable pageable);
    Page<FinancialAccount> findByRestaurantIdAndStatus(Long restaurantId, AccountStatus status, Pageable pageable);
    Page<FinancialAccount> findByRestaurantIdAndType(Long restaurantId, AccountType type, Pageable pageable);
    Page<FinancialAccount> findByRestaurantIdAndCategory(Long restaurantId, AccountCategory category, Pageable pageable);
    
    // Consultas personalizadas com JPQL
    @Query("SELECT a FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.status = :status AND a.currentBalance > :minBalance")
    List<FinancialAccount> findActiveAccountsWithMinBalance(@Param("restaurantId") Long restaurantId, 
                                                          @Param("status") AccountStatus status, 
                                                          @Param("minBalance") BigDecimal minBalance);
    
    @Query("SELECT a FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.type = :type AND a.currentBalance BETWEEN :minBalance AND :maxBalance")
    List<FinancialAccount> findAccountsByTypeAndBalanceRange(@Param("restaurantId") Long restaurantId, 
                                                            @Param("type") AccountType type, 
                                                            @Param("minBalance") BigDecimal minBalance, 
                                                            @Param("maxBalance") BigDecimal maxBalance);
    
    @Query("SELECT a FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.category = :category AND a.status = :status AND a.currentBalance > 0")
    List<FinancialAccount> findActivePositiveBalanceAccountsByCategory(@Param("restaurantId") Long restaurantId, 
                                                                      @Param("category") AccountCategory category, 
                                                                      @Param("status") AccountStatus status);
    
    // Consultas de agregação
    @Query("SELECT SUM(a.currentBalance) FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.status = :status")
    BigDecimal calculateTotalBalanceByRestaurantAndStatus(@Param("restaurantId") Long restaurantId, 
                                                        @Param("status") AccountStatus status);
    
    @Query("SELECT SUM(a.currentBalance) FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.type = :type")
    BigDecimal calculateTotalBalanceByRestaurantAndType(@Param("restaurantId") Long restaurantId, 
                                                      @Param("type") AccountType type);
    
    @Query("SELECT SUM(a.currentBalance) FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.category = :category")
    BigDecimal calculateTotalBalanceByRestaurantAndCategory(@Param("restaurantId") Long restaurantId, 
                                                          @Param("category") AccountCategory category);
    
    @Query("SELECT COUNT(a) FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.status = :status")
    Long countAccountsByRestaurantAndStatus(@Param("restaurantId") Long restaurantId, 
                                           @Param("status") AccountStatus status);
    
    @Query("SELECT COUNT(a) FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.type = :type")
    Long countAccountsByRestaurantAndType(@Param("restaurantId") Long restaurantId, 
                                         @Param("type") AccountType type);
    
    // Consultas de análise
    @Query("SELECT a.type, COUNT(a), SUM(a.currentBalance) FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId GROUP BY a.type")
    List<Object[]> getAccountSummaryByType(@Param("restaurantId") Long restaurantId);
    
    @Query("SELECT a.category, COUNT(a), SUM(a.currentBalance) FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId GROUP BY a.category")
    List<Object[]> getAccountSummaryByCategory(@Param("restaurantId") Long restaurantId);
    
    @Query("SELECT a.status, COUNT(a), SUM(a.currentBalance) FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId GROUP BY a.status")
    List<Object[]> getAccountSummaryByStatus(@Param("restaurantId") Long restaurantId);
    
    // Consultas de alertas
    @Query("SELECT a FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.dueDate <= :date AND a.status = :status")
    List<FinancialAccount> findAccountsWithUpcomingDueDate(@Param("restaurantId") Long restaurantId, 
                                                          @Param("date") LocalDateTime date, 
                                                          @Param("status") AccountStatus status);
    
    @Query("SELECT a FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.currentBalance < 0 AND a.status = :status")
    List<FinancialAccount> findOverdraftAccounts(@Param("restaurantId") Long restaurantId, 
                                                @Param("status") AccountStatus status);
    
    @Query("SELECT a FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.currentBalance > a.creditLimit AND a.status = :status")
    List<FinancialAccount> findAccountsExceedingCreditLimit(@Param("restaurantId") Long restaurantId, 
                                                           @Param("status") AccountStatus status);
    
    // Consultas de relatórios
    @Query("SELECT a FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.createdAt BETWEEN :startDate AND :endDate")
    List<FinancialAccount> findAccountsCreatedInPeriod(@Param("restaurantId") Long restaurantId, 
                                                      @Param("startDate") LocalDateTime startDate, 
                                                      @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM FinancialAccount a WHERE a.restaurant.id = :restaurantId AND a.updatedAt BETWEEN :startDate AND :endDate")
    List<FinancialAccount> findAccountsUpdatedInPeriod(@Param("restaurantId") Long restaurantId, 
                                                      @Param("startDate") LocalDateTime startDate, 
                                                      @Param("endDate") LocalDateTime endDate);
    
    // Consultas de existência
    boolean existsByRestaurantIdAndAccountCode(Long restaurantId, String accountCode);
    boolean existsByRestaurantIdAndBankCodeAndAccountNumber(Long restaurantId, String bankCode, String accountNumber);
    boolean existsByRestaurantIdAndPixKey(Long restaurantId, String pixKey);
    boolean existsByRestaurantIdAndCardNumber(Long restaurantId, String cardNumber);
    
    // Busca por código da conta
    Optional<FinancialAccount> findByRestaurantIdAndAccountCode(Long restaurantId, String accountCode);
    
    // Busca por número da conta bancária
    Optional<FinancialAccount> findByRestaurantIdAndBankCodeAndAccountNumber(Long restaurantId, String bankCode, String accountNumber);
    
    // Busca por chave PIX
    Optional<FinancialAccount> findByRestaurantIdAndPixKey(Long restaurantId, String pixKey);
    
    // Busca por número do cartão
    Optional<FinancialAccount> findByRestaurantIdAndCardNumber(Long restaurantId, String cardNumber);
}
