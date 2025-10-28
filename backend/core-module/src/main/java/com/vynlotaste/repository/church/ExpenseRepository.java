package com.vynlotaste.repository.church;

import com.vynlotaste.entity.church.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    Page<Expense> findAllByTenantId(Long tenantId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(e.amount),0) FROM Expense e WHERE e.tenantId = :tenantId AND e.paymentDate BETWEEN :start AND :end")
    BigDecimal sumByTenantAndPeriod(@Param("tenantId") Long tenantId,
                                    @Param("start") LocalDate start,
                                    @Param("end") LocalDate end);
}


