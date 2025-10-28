package com.vynlotaste.repository.church;

import com.vynlotaste.entity.church.Tithing;
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

@Repository
public interface TithingRepository extends JpaRepository<Tithing, Long> {
    Page<Tithing> findAllByTenantId(Long tenantId, Pageable pageable);
    Page<Tithing> findByTenantIdAndMemberId(Long tenantId, Long memberId, Pageable pageable);
    Page<Tithing> findByTenantIdAndTitheType(Long tenantId, String titheType, Pageable pageable);
    Optional<Tithing> findByIdAndTenantId(Long id, Long tenantId);
    
    @Query("SELECT t FROM Tithing t WHERE t.tenantId = :tenantId " +
           "AND t.paymentDate >= :startDate AND t.paymentDate <= :endDate " +
           "AND t.deletedAt IS NULL")
    Page<Tithing> findByTenantIdAndPaymentDateBetween(
        @Param("tenantId") Long tenantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    @Query("SELECT SUM(t.amount) FROM Tithing t WHERE t.tenantId = :tenantId " +
           "AND t.paymentDate >= :startDate AND t.paymentDate <= :endDate " +
           "AND t.deletedAt IS NULL")
    BigDecimal sumByTenantIdAndPaymentDateBetween(
        @Param("tenantId") Long tenantId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    List<Tithing> findAllByTenantIdAndDeletedAtIsNull(Long tenantId);
}

