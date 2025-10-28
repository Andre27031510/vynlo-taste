package com.vynlotaste.repository.church;

import com.vynlotaste.entity.church.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 * Repository para Member - EKKLESIA
 * ============================================================================
 * 
 * MULTI-TENANCY: Todas as queries filtram por tenant_id
 * ISOLAMENTO: Membros de Igreja X não vê membros de Igreja Y
 * 
 * @version 1.0.0
 * @author Vynlo Tech - EKKLESIA Implementation
 * @created 2025-10-28
 * ============================================================================
 */
@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    
    /**
     * Buscar membros por tenant_id (MULTI-TENANCY)
     */
    Page<Member> findAllByTenantId(Long tenantId, Pageable pageable);
    
    /**
     * Buscar membros por tenant_id e status
     */
    Page<Member> findByTenantIdAndStatus(Long tenantId, String status, Pageable pageable);
    
    /**
     * Buscar membros por tenant_id e célula
     */
    Page<Member> findByTenantIdAndCellGroupId(Long tenantId, Long cellGroupId, Pageable pageable);
    
    /**
     * Buscar membros por tenant_id e ministério
     */
    Page<Member> findByTenantIdAndMinistryId(Long tenantId, Long ministryId, Pageable pageable);
    
    /**
     * Buscar membros por tenant_id e status espiritual
     */
    Page<Member> findByTenantIdAndSpiritualStatus(Long tenantId, String spiritualStatus, Pageable pageable);
    
    /**
     * Buscar membro por ID e tenant_id (MULTI-TENANCY)
     */
    Optional<Member> findByIdAndTenantId(Long id, Long tenantId);
    
    /**
     * Contar membros ativos por tenant
     */
    @Query("SELECT COUNT(m) FROM Member m WHERE m.tenantId = :tenantId AND m.status = 'ACTIVE' AND m.deletedAt IS NULL")
    Long countActiveMembersByTenantId(@Param("tenantId") Long tenantId);
    
    /**
     * Buscar membros com filtros complexos
     */
    @Query("SELECT m FROM Member m WHERE m.tenantId = :tenantId " +
           "AND (:status IS NULL OR m.status = :status) " +
           "AND (:spiritualStatus IS NULL OR m.spiritualStatus = :spiritualStatus) " +
           "AND (:cellGroupId IS NULL OR m.cellGroupId = :cellGroupId) " +
           "AND (:ministryId IS NULL OR m.ministryId = :ministryId) " +
           "AND m.deletedAt IS NULL")
    Page<Member> findByTenantIdWithFilters(
        @Param("tenantId") Long tenantId,
        @Param("status") String status,
        @Param("spiritualStatus") String spiritualStatus,
        @Param("cellGroupId") Long cellGroupId,
        @Param("ministryId") Long ministryId,
        Pageable pageable
    );
    
    /**
     * Buscar membros por período de ingresso
     */
    @Query("SELECT m FROM Member m WHERE m.tenantId = :tenantId " +
           "AND m.joinDate >= :startDate AND m.joinDate <= :endDate " +
           "AND m.deletedAt IS NULL")
    Page<Member> findByTenantIdAndJoinDateBetween(
        @Param("tenantId") Long tenantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    /**
     * Buscar membros por nome (busca parcial)
     */
    @Query("SELECT m FROM Member m WHERE m.tenantId = :tenantId " +
           "AND m.name ILIKE %:search% " +
           "AND m.deletedAt IS NULL")
    Page<Member> findByTenantIdAndNameContaining(@Param("tenantId") Long tenantId, @Param("search") String search, Pageable pageable);
    
    /**
     * Listar todos os membros ativos por tenant (sem paginação)
     */
    List<Member> findAllByTenantIdAndStatusAndDeletedAtIsNull(Long tenantId, String status);
}

