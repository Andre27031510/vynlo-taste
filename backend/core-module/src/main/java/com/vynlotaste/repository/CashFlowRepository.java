package com.vynlotaste.repository;

import com.vynlotaste.entity.CashFlow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

/**
 * Repository for CashFlow entity operations
 * Provides data access methods for cash flow management
 */
@Repository
public interface CashFlowRepository extends JpaRepository<CashFlow, Long>, JpaSpecificationExecutor<CashFlow> {
    
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
}