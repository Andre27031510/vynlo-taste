package com.vynlotaste.repository;

import com.vynlotaste.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Payment entity operations
 * Provides data access methods for payment transactions
 * Modified: 2025-10-11 14:04 UTC - Added findByMethod
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {
    
    /**
     * Find payments by status with pagination
     * @param status Payment status (PENDING, APPROVED, FAILED, REFUNDED)
     * @param pageable Pagination parameters
     * @return Page of payments
     */
    Page<Payment> findByStatus(String status, Pageable pageable);
    
    /**
     * Find payments by provider with pagination
     * @param provider Payment provider (STRIPE, MERCADOPAGO, etc.)
     * @param pageable Pagination parameters
     * @return Page of payments
     */
    Page<Payment> findByProvider(String provider, Pageable pageable);
    
    /**
     * Find payments by order ID
     * @param orderId Order ID
     * @return List of payments for the order
     */
    List<Payment> findByOrderId(Long orderId);
    
    /**
     * Find payment by transaction ID
     * @param transactionId External transaction ID
     * @return Optional payment
     */
    Optional<Payment> findByTransactionId(String transactionId);
    
    /**
     * Find payments by payment method with pagination
     * @param method Payment method (CREDIT_CARD, DEBIT, PIX, CASH)
     * @param pageable Pagination parameters
     * @return Page of payments
     */
    Page<Payment> findByMethod(String method, Pageable pageable);
}
// Modified: 2025-10-11-v26 | findByMethod added