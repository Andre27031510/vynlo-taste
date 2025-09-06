package com.vynlotaste.service;

import io.github.resilience4j.retry.Retry;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
public class RetryMetricsService {

    private final MeterRegistry meterRegistry;
    private final ConcurrentHashMap<String, AtomicLong> retryAttempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> retryFailures = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> lastFailureTime = new ConcurrentHashMap<>();

    public void recordRetryAttempt(String operation, int attemptNumber) {
        // Contador de tentativas
        Counter.builder("vynlo.retry.attempts")
            .tag("operation", operation)
            .tag("attempt", String.valueOf(attemptNumber))
            .register(meterRegistry)
            .increment();

        // Contador interno
        retryAttempts.computeIfAbsent(operation, k -> new AtomicLong(0)).incrementAndGet();
        
        log.debug("Retry attempt {} recorded for operation: {}", attemptNumber, operation);
    }

    public void recordRetrySuccess(String operation, int totalAttempts, long durationMs) {
        // Timer de sucesso
        Timer.builder("vynlo.retry.success")
            .tag("operation", operation)
            .register(meterRegistry)
            .record(durationMs, java.util.concurrent.TimeUnit.MILLISECONDS);

        // Gauge de tentativas até sucesso
        Gauge.builder("vynlo.retry.attempts.until.success", totalAttempts, Integer::doubleValue)
            .tag("operation", operation)
            .register(meterRegistry);

        log.info("Retry success for operation: {} after {} attempts in {}ms", 
            operation, totalAttempts, durationMs);
    }

    public void recordRetryFailure(String operation, String errorType, int totalAttempts) {
        // Contador de falhas
        Counter.builder("vynlo.retry.failures")
            .tag("operation", operation)
            .tag("error.type", errorType)
            .register(meterRegistry)
            .increment();

        // Contador interno
        retryFailures.computeIfAbsent(operation, k -> new AtomicLong(0)).incrementAndGet();
        lastFailureTime.put(operation, LocalDateTime.now());

        log.error("Retry failure for operation: {} with error: {} after {} attempts", 
            operation, errorType, totalAttempts);

        // Alerta para falhas persistentes
        if (totalAttempts >= 3) {
            sendPersistentFailureAlert(operation, errorType, totalAttempts);
        }
    }

    public void recordRetryExhausted(String operation, String finalError) {
        Counter.builder("vynlo.retry.exhausted")
            .tag("operation", operation)
            .tag("final.error", finalError)
            .register(meterRegistry)
            .increment();

        log.error("Retry exhausted for operation: {} with final error: {}", operation, finalError);
        sendRetryExhaustedAlert(operation, finalError);
    }

    @Scheduled(fixedRate = 60000) // A cada minuto
    public void publishMetrics() {
        retryAttempts.forEach((operation, attempts) -> {
            Gauge.builder("vynlo.retry.total.attempts", attempts, AtomicLong::doubleValue)
                .tag("operation", operation)
                .register(meterRegistry);
        });

        retryFailures.forEach((operation, failures) -> {
            Gauge.builder("vynlo.retry.total.failures", failures, AtomicLong::doubleValue)
                .tag("operation", operation)
                .register(meterRegistry);
        });
    }

    @Scheduled(fixedRate = 300000) // A cada 5 minutos
    public void checkHealthMetrics() {
        retryFailures.forEach((operation, failures) -> {
            long failureCount = failures.get();
            if (failureCount > 10) { // Mais de 10 falhas em 5 minutos
                log.warn("High retry failure rate detected for operation: {} with {} failures", 
                    operation, failureCount);
                sendHighFailureRateAlert(operation, failureCount);
            }
        });

        // Reset contadores
        retryAttempts.clear();
        retryFailures.clear();
    }

    private void sendPersistentFailureAlert(String operation, String errorType, int attempts) {
        // Implementar integração com sistema de alertas (Slack, PagerDuty, etc.)
        log.error("ALERT: Persistent failure detected - Operation: {}, Error: {}, Attempts: {}", 
            operation, errorType, attempts);
    }

    private void sendRetryExhaustedAlert(String operation, String finalError) {
        // Implementar integração com sistema de alertas críticos
        log.error("CRITICAL ALERT: Retry exhausted - Operation: {}, Final Error: {}", 
            operation, finalError);
    }

    private void sendHighFailureRateAlert(String operation, long failureCount) {
        // Implementar integração com sistema de alertas
        log.error("ALERT: High failure rate - Operation: {}, Failures: {}", 
            operation, failureCount);
    }

    public double getRetrySuccessRate(String operation) {
        AtomicLong attempts = retryAttempts.get(operation);
        AtomicLong failures = retryFailures.get(operation);
        
        if (attempts == null || attempts.get() == 0) return 1.0;
        
        long totalAttempts = attempts.get();
        long totalFailures = failures != null ? failures.get() : 0;
        
        return (double) (totalAttempts - totalFailures) / totalAttempts;
    }
}