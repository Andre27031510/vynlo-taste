package com.vynlotaste.service;

import io.github.resilience4j.retry.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.function.Supplier;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseRetryService {

    private final Retry databaseRetry;
    private final RetryMetricsService retryMetricsService;

    @Transactional(readOnly = true)
    public <T> T executeWithRetry(String operationName, Supplier<T> operation) {
        return executeWithRetry(operationName, operation, false);
    }

    @Transactional
    public <T> T executeWithRetryTransactional(String operationName, Supplier<T> operation) {
        return executeWithRetry(operationName, operation, true);
    }

    private <T> T executeWithRetry(String operationName, Supplier<T> operation, boolean transactional) {
        long startTime = System.currentTimeMillis();
        final int[] attemptCount = {0};

        Supplier<T> decoratedSupplier = Retry.decorateSupplier(databaseRetry, () -> {
            int currentAttempt = ++attemptCount[0];
            retryMetricsService.recordRetryAttempt("database." + operationName, currentAttempt);
            
            log.debug("Executing database operation: {} (attempt {})", operationName, currentAttempt);
            
            try {
                T result = operation.get();
                if (currentAttempt > 1) {
                    long duration = System.currentTimeMillis() - startTime;
                    retryMetricsService.recordRetrySuccess("database." + operationName, currentAttempt, duration);
                }
                return result;
            } catch (DataAccessException e) {
                log.warn("Database operation failed: {} (attempt {}): {}", 
                    operationName, currentAttempt, e.getMessage());
                
                if (currentAttempt >= databaseRetry.getRetryConfig().getMaxAttempts()) {
                    retryMetricsService.recordRetryExhausted("database." + operationName, e.getClass().getSimpleName());
                } else {
                    retryMetricsService.recordRetryFailure("database." + operationName, e.getClass().getSimpleName(), currentAttempt);
                }
                throw e;
            }
        });

        try {
            return decoratedSupplier.get();
        } catch (Exception e) {
            log.error("Database operation failed permanently: {} after {} attempts", operationName, attemptCount, e);
            throw new DatabaseRetryException("Database operation failed after retries: " + operationName, e);
        }
    }

    public void executeWithRetryVoid(String operationName, Runnable operation) {
        executeWithRetry(operationName, () -> {
            operation.run();
            return null;
        });
    }

    @Transactional
    public void executeWithRetryVoidTransactional(String operationName, Runnable operation) {
        executeWithRetryTransactional(operationName, () -> {
            operation.run();
            return null;
        });
    }

    public static class DatabaseRetryException extends RuntimeException {
        public DatabaseRetryException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}