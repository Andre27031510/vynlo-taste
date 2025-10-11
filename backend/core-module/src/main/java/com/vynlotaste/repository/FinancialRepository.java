package com.vynlotaste.repository;

import com.vynlotaste.entity.Financial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

/**
 * Repository for Financial entity operations
 * Provides data access methods for financial transactions
 */
@Repository
public interface FinancialRepository extends JpaRepository<Financial, Long>, JpaSpecificationExecutor<Financial> {
    
    /**
     * Find financial transactions by type with pagination
     * @param type Transaction type (INCOME or EXPENSE)
     * @param pageable Pagination parameters
     * @return Page of financial transactions
     */
    Page<Financial> findByType(String type, Pageable pageable);
    
    /**
     * Find financial transactions by status with pagination
     * @param status Transaction status (PENDING, CONFIRMED, CANCELLED)
     * @param pageable Pagination parameters
     * @return Page of financial transactions
     */
    Page<Financial> findByStatus(String status, Pageable pageable);
    
    /**
     * Find financial transactions between dates with pagination
     * @param start Start date (inclusive)
     * @param end End date (inclusive)
     * @param pageable Pagination parameters
     * @return Page of financial transactions
     */
    Page<Financial> findByDateBetween(LocalDate start, LocalDate end, Pageable pageable);
    
    /**
     * Find financial transactions by user ID with pagination
     * @param userId User ID
     * @param pageable Pagination parameters
     * @return Page of financial transactions
     */
    Page<Financial> findByUserId(Long userId, Pageable pageable);
}