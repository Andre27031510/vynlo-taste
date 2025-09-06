package com.vynlotaste.exception;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
public class ErrorMetricsService {

    private final MeterRegistry meterRegistry;
    private final ConcurrentHashMap<String, AtomicLong> errorCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Counter> errorCounters = new ConcurrentHashMap<>();

    public void recordError(String errorType) {
        recordError(errorType, "unknown");
    }

    public void recordError(String errorType, String endpoint) {
        // Contador por tipo de erro
        Counter errorCounter = errorCounters.computeIfAbsent(errorType, 
            type -> Counter.builder("vynlo.errors.total")
                .tag("type", type)
                .description("Total errors by type")
                .register(meterRegistry));
        errorCounter.increment();

        // Contador por endpoint
        Counter endpointCounter = errorCounters.computeIfAbsent(endpoint + "_errors",
            ep -> Counter.builder("vynlo.endpoint.errors")
                .tag("endpoint", endpoint)
                .description("Errors by endpoint")
                .register(meterRegistry));
        endpointCounter.increment();

        // Contador interno para alertas
        errorCounts.computeIfAbsent(errorType, k -> new AtomicLong(0)).incrementAndGet();
        
        log.debug("Error recorded - Type: {}, Endpoint: {}", errorType, endpoint);
    }

    public void recordCriticalError(String errorType, String message, Exception ex) {
        recordError("CRITICAL_" + errorType, "system");
        
        // Log estruturado para erro crítico
        log.error("CRITICAL ERROR - Type: {}, Message: {}", errorType, message, ex);
        
        // Aqui poderia integrar com sistema de notificação (Slack, PagerDuty, etc.)
        sendCriticalErrorNotification(errorType, message, ex);
    }

    @Scheduled(fixedRate = 60000) // A cada minuto
    public void checkErrorRates() {
        errorCounts.forEach((errorType, count) -> {
            long currentCount = count.get();
            if (currentCount > 10) { // Mais de 10 erros por minuto
                log.warn("High error rate detected - Type: {}, Count: {}", errorType, currentCount);
                // Aqui poderia disparar alertas
            }
        });
        
        // Reset contadores
        errorCounts.clear();
    }

    private void sendCriticalErrorNotification(String errorType, String message, Exception ex) {
        // Implementação de notificação (Slack, email, etc.)
        log.error("CRITICAL_ERROR_NOTIFICATION - Type: {}, Message: {}", errorType, message);
    }

    public double getErrorRate(String errorType) {
        AtomicLong count = errorCounts.get(errorType);
        return count != null ? count.get() : 0.0;
    }
}