package com.vynlotaste.aspect;

import com.vynlotaste.annotation.RetryableOperation;
import com.vynlotaste.service.RetryMetricsService;
import io.github.resilience4j.retry.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.function.Supplier;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RetryAspect {

    private final Retry databaseRetry;
    private final Retry firebaseRetry;
    private final Retry redisRetry;
    private final Retry externalServiceRetry;
    private final RetryMetricsService retryMetricsService;

    @Around("@annotation(retryableOperation)")
    public Object executeWithRetry(ProceedingJoinPoint joinPoint, RetryableOperation retryableOperation) throws Throwable {
        String operationName = getOperationName(joinPoint, retryableOperation);
        Retry retry = getRetryForType(retryableOperation.type());
        
        long startTime = System.currentTimeMillis();
        final int[] attemptCount = {0};

        Supplier<Object> decoratedSupplier = Retry.decorateSupplier(retry, () -> {
            int currentAttempt = ++attemptCount[0];
            String metricName = retryableOperation.type().name().toLowerCase() + "." + operationName;
            retryMetricsService.recordRetryAttempt(metricName, currentAttempt);
            
            log.debug("Executing retryable operation: {} (attempt {})", operationName, currentAttempt);
            
            try {
                Object result = joinPoint.proceed();
                if (currentAttempt > 1) {
                    long duration = System.currentTimeMillis() - startTime;
                    retryMetricsService.recordRetrySuccess(metricName, currentAttempt, duration);
                }
                return result;
            } catch (Throwable e) {
                log.warn("Retryable operation failed: {} (attempt {}): {}", 
                    operationName, currentAttempt, e.getMessage());
                
                if (shouldIgnoreException(e, retryableOperation)) {
                    throw new RuntimeException("Non-retryable exception", e);
                }
                
                if (currentAttempt >= retry.getRetryConfig().getMaxAttempts()) {
                    retryMetricsService.recordRetryExhausted(metricName, e.getClass().getSimpleName());
                } else {
                    retryMetricsService.recordRetryFailure(metricName, e.getClass().getSimpleName(), currentAttempt);
                }
                
                if (e instanceof RuntimeException) {
                    throw (RuntimeException) e;
                } else {
                    throw new RuntimeException(e);
                }
            }
        });

        try {
            return decoratedSupplier.get();
        } catch (Exception e) {
            log.error("Retryable operation failed permanently: {} after {} attempts", operationName, attemptCount, e);
            
            if (retryableOperation.silentFallback()) {
                log.warn("Returning null due to silent fallback for operation: {}", operationName);
                return null;
            }
            
            throw e;
        }
    }

    private String getOperationName(ProceedingJoinPoint joinPoint, RetryableOperation retryableOperation) {
        if (!retryableOperation.value().isEmpty()) {
            return retryableOperation.value();
        }
        return joinPoint.getSignature().getName();
    }

    private Retry getRetryForType(RetryableOperation.RetryType type) {
        return switch (type) {
            case DATABASE -> databaseRetry;
            case FIREBASE -> firebaseRetry;
            case REDIS -> redisRetry;
            case EXTERNAL_SERVICE -> externalServiceRetry;
        };
    }

    private boolean shouldIgnoreException(Throwable e, RetryableOperation retryableOperation) {
        for (Class<? extends Exception> ignoreClass : retryableOperation.ignoreExceptions()) {
            if (ignoreClass.isAssignableFrom(e.getClass())) {
                return true;
            }
        }
        return false;
    }
}