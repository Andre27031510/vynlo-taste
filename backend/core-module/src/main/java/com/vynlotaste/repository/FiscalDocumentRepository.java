package com.vynlotaste.repository;

import com.vynlotaste.entity.FiscalDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

/**
 * Repository for FiscalDocument entity operations
 * Provides data access methods for fiscal document management
 * Multi-Tenancy Support
 */
@Repository
public interface FiscalDocumentRepository extends JpaRepository<FiscalDocument, Long>, JpaSpecificationExecutor<FiscalDocument> {
    
    // ============================================================================
    // QUERIES GLOBAIS (APENAS SUPER ADMIN - sem filtro tenant_id)
    // ============================================================================
    
    /**
     * Find fiscal documents by type with pagination
     * @param type Document type (NFE, NFCE, CTE)
     * @param pageable Pagination parameters
     * @return Page of fiscal documents
     */
    Page<FiscalDocument> findByType(String type, Pageable pageable);
    
    /**
     * Find fiscal documents by status with pagination
     * @param status Document status (PENDING, AUTHORIZED, CANCELLED, REJECTED)
     * @param pageable Pagination parameters
     * @return Page of fiscal documents
     */
    Page<FiscalDocument> findByStatus(String status, Pageable pageable);
    
    /**
     * Find fiscal document by number
     * @param number Document number
     * @return Optional fiscal document
     */
    Optional<FiscalDocument> findByNumber(String number);
    
    /**
     * Find fiscal documents between issue dates with pagination
     * @param start Start date (inclusive)
     * @param end End date (inclusive)
     * @param pageable Pagination parameters
     * @return Page of fiscal documents
     */
    Page<FiscalDocument> findByIssueDateBetween(LocalDate start, LocalDate end, Pageable pageable);
    
    // ============================================================================
    // MULTI-TENANCY: Queries com filtro de tenant_id
    // ============================================================================
    
    @org.springframework.data.jpa.repository.Query("SELECT f FROM FiscalDocument f WHERE f.tenantId = :tenantId")
    Page<FiscalDocument> findAllByTenantId(@org.springframework.data.repository.query.Param("tenantId") Long tenantId, Pageable pageable);
}