package com.vynlotaste.service;

import com.vynlotaste.exception.payment.PaymentFailedException;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    @CircuitBreaker(name = "payment", fallbackMethod = "processPaymentFallback")
    @Retry(name = "payment")
    @TimeLimiter(name = "payment")
    @Bulkhead(name = "payment")
    public CompletableFuture<Boolean> processPayment(String paymentId, BigDecimal amount, String method) {
        return CompletableFuture.supplyAsync(() -> {
            log.info("Processing payment: {} for amount: {} via {}", paymentId, amount, method);
            
            try {
                // Simulação de processamento de pagamento
                Thread.sleep(1000);
                
                boolean success = Math.random() > 0.1; // 90% sucesso
                
                if (success) {
                    log.info("Payment processed successfully: {}", paymentId);
                    return true;
                } else {
                    throw new PaymentFailedException(paymentId, "Payment declined by gateway");
                }
                
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new PaymentFailedException(paymentId, "Payment processing interrupted", e);
            }
        });
    }

    @CircuitBreaker(name = "payment", fallbackMethod = "refundPaymentFallback")
    @Retry(name = "payment")
    @TimeLimiter(name = "payment")
    public CompletableFuture<Boolean> refundPayment(String paymentId, BigDecimal amount) {
        return CompletableFuture.supplyAsync(() -> {
            log.info("Processing refund for payment: {} amount: {}", paymentId, amount);
            
            try {
                Thread.sleep(800);
                
                boolean success = Math.random() > 0.05; // 95% sucesso para refunds
                
                if (success) {
                    log.info("Refund processed successfully: {}", paymentId);
                    return true;
                } else {
                    throw new PaymentFailedException(paymentId, "Refund failed");
                }
                
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new PaymentFailedException(paymentId, "Refund processing interrupted", e);
            }
        });
    }

    // Fallback methods
    public CompletableFuture<Boolean> processPaymentFallback(String paymentId, BigDecimal amount, String method, Exception ex) {
        log.error("Payment processing fallback triggered for payment: {}", paymentId, ex);
        
        // Em caso de falha, podemos tentar um método alternativo ou marcar para processamento posterior
        if (amount.compareTo(new BigDecimal("50.00")) <= 0) {
            log.info("Small payment amount, allowing fallback success for: {}", paymentId);
            return CompletableFuture.completedFuture(true);
        }
        
        return CompletableFuture.completedFuture(false);
    }

    public CompletableFuture<Boolean> refundPaymentFallback(String paymentId, BigDecimal amount, Exception ex) {
        log.error("Refund processing fallback triggered for payment: {}", paymentId, ex);
        
        // Marcar refund para processamento manual
        log.warn("Refund marked for manual processing: {} - amount: {}", paymentId, amount);
        return CompletableFuture.completedFuture(false);
    }

    public boolean processPaymentSync(String paymentId, BigDecimal amount, String method) {
        try {
            CompletableFuture<Boolean> future = processPayment(paymentId, amount, method);
            return future.get();
        } catch (Exception e) {
            log.error("Synchronous payment processing failed for: {}", paymentId, e);
            return false;
        }
    }

    public boolean isPaymentGatewayAvailable() {
        try {
            // Simulação de health check
            Thread.sleep(100);
            return Math.random() > 0.1;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
}