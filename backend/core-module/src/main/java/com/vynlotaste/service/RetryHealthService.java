package com.vynlotaste.service;

import io.github.resilience4j.retry.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RetryHealthService implements HealthIndicator {

    private final Retry databaseRetry;
    private final Retry firebaseRetry;
    private final Retry redisRetry;
    private final Retry externalServiceRetry;
    private final RetryMetricsService retryMetricsService;

    @Override
    public Health health() {
        Map<String, Object> details = new HashMap<>();
        boolean allHealthy = true;

        // Verificar status dos retries
        details.put("database", getRetryStatus(databaseRetry, "database"));
        details.put("firebase", getRetryStatus(firebaseRetry, "firebase"));
        details.put("redis", getRetryStatus(redisRetry, "redis"));
        details.put("externalService", getRetryStatus(externalServiceRetry, "externalService"));

        // Verificar taxas de sucesso
        Map<String, Double> successRates = new HashMap<>();
        successRates.put("database", retryMetricsService.getRetrySuccessRate("database"));
        successRates.put("firebase", retryMetricsService.getRetrySuccessRate("firebase"));
        successRates.put("redis", retryMetricsService.getRetrySuccessRate("redis"));
        successRates.put("externalService", retryMetricsService.getRetrySuccessRate("externalService"));
        
        details.put("successRates", successRates);

        // Verificar se alguma taxa de sucesso está muito baixa
        for (Map.Entry<String, Double> entry : successRates.entrySet()) {
            if (entry.getValue() < 0.8) { // Menos de 80% de sucesso
                allHealthy = false;
                log.warn("Low success rate detected for {}: {}", entry.getKey(), entry.getValue());
            }
        }

        if (allHealthy) {
            return Health.up().withDetails(details).build();
        } else {
            return Health.down().withDetails(details).build();
        }
    }

    private Map<String, Object> getRetryStatus(Retry retry, String name) {
        Map<String, Object> status = new HashMap<>();
        
        status.put("name", retry.getName());
        status.put("maxAttempts", retry.getRetryConfig().getMaxAttempts());
        status.put("waitDuration", retry.getRetryConfig().getIntervalFunction().apply(1));
        
        // Métricas do retry
        Retry.Metrics metrics = retry.getMetrics();
        status.put("numberOfSuccessfulCallsWithoutRetryAttempt", 
            metrics.getNumberOfSuccessfulCallsWithoutRetryAttempt());
        status.put("numberOfSuccessfulCallsWithRetryAttempt", 
            metrics.getNumberOfSuccessfulCallsWithRetryAttempt());
        status.put("numberOfFailedCallsWithoutRetryAttempt", 
            metrics.getNumberOfFailedCallsWithoutRetryAttempt());
        status.put("numberOfFailedCallsWithRetryAttempt", 
            metrics.getNumberOfFailedCallsWithRetryAttempt());

        return status;
    }

    public Map<String, Object> getDetailedRetryMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        metrics.put("database", getRetryStatus(databaseRetry, "database"));
        metrics.put("firebase", getRetryStatus(firebaseRetry, "firebase"));
        metrics.put("redis", getRetryStatus(redisRetry, "redis"));
        metrics.put("externalService", getRetryStatus(externalServiceRetry, "externalService"));
        
        return metrics;
    }
}