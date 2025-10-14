package com.vynlotaste.repository;

import com.vynlotaste.entity.PaymentRefund;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Created: 2025-10-14 19:00 UTC | Real refunds repository with BigDecimal support
// Modified: 2025-10-14 19:30 UTC | Final validation and comment added

@Repository
public interface PaymentRefundRepository extends JpaRepository<PaymentRefund, Long> {

    Page<PaymentRefund> findByStatus(PaymentRefund.RefundStatus status, Pageable pageable);

    Page<PaymentRefund> findByPaymentId(Long paymentId, Pageable pageable);

    @Query("SELECT COUNT(r) FROM PaymentRefund r WHERE r.status = :status")
    long countByStatus(@Param("status") PaymentRefund.RefundStatus status);

    @Query("SELECT COUNT(r) FROM PaymentRefund r WHERE r.createdAt >= :since")
    long countByCreatedAtAfter(@Param("since") LocalDateTime since);

    @Query("SELECT SUM(r.amount) FROM PaymentRefund r WHERE r.status = 'PROCESSED' AND r.createdAt >= :since")
    BigDecimal sumProcessedAmountSince(@Param("since") LocalDateTime since);
}
