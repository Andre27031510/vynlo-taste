package com.vynlotaste.service;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertService {

    private final MeterRegistry meterRegistry;
    private final BusinessMetricsService businessMetricsService;
    private final ApiPerformanceMetricsService apiMetricsService;
    private final CacheMetricsService cacheMetricsService;
    private final DatabaseMetricsService databaseMetricsService;

    @Scheduled(fixedRate = 60000) // A cada minuto
    public void checkCriticalMetrics() {
        checkApiPerformance();
        checkCachePerformance();
        checkBusinessMetrics();
    }

    private void checkApiPerformance() {
        // Verificar APIs com alta taxa de erro
        String[] criticalEndpoints = {"/api/orders", "/api/payments", "/api/users"};
        
        for (String endpoint : criticalEndpoints) {
            double errorRate = apiMetricsService.getApiErrorRate(endpoint, "POST");
            if (errorRate > 5.0) { // > 5% de erro
                sendAlert("HIGH_API_ERROR_RATE", 
                    String.format("High error rate on %s: %.2f%%", endpoint, errorRate),
                    "CRITICAL");
            }
            
            double avgResponseTime = apiMetricsService.getAverageResponseTime(endpoint, "GET");
            if (avgResponseTime > 2000) { // > 2 segundos
                sendAlert("SLOW_API_RESPONSE", 
                    String.format("Slow response time on %s: %.0fms", endpoint, avgResponseTime),
                    "WARNING");
            }
        }
    }

    private void checkCachePerformance() {
        String[] caches = {"users", "products", "orders"};
        
        for (String cache : caches) {
            double hitRatio = cacheMetricsService.getCacheHitRatio(cache);
            if (hitRatio < 80.0) { // < 80% hit ratio
                sendAlert("LOW_CACHE_HIT_RATIO", 
                    String.format("Low cache hit ratio for %s: %.2f%%", cache, hitRatio),
                    "WARNING");
            }
        }
    }

    private void checkBusinessMetrics() {
        // Verificar métricas de negócio críticas
        // Implementar verificações específicas baseadas nos KPIs
        log.debug("Checking business metrics for alerts");
    }

    @Scheduled(fixedRate = 300000) // A cada 5 minutos
    public void checkResourceUsage() {
        // Verificar uso de recursos do sistema
        checkMemoryUsage();
        checkDatabaseConnections();
    }

    private void checkMemoryUsage() {
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        double memoryUsagePercent = (double) usedMemory / maxMemory * 100;
        
        if (memoryUsagePercent > 85.0) { // > 85% de uso de memória
            sendAlert("HIGH_MEMORY_USAGE", 
                String.format("High memory usage: %.2f%%", memoryUsagePercent),
                "CRITICAL");
        }
    }

    private void checkDatabaseConnections() {
        // Verificar pool de conexões do banco
        // Implementar verificação específica do pool
        log.debug("Checking database connection pool");
    }

    private void sendAlert(String alertType, String message, String severity) {
        Map<String, Object> alertData = new HashMap<>();
        alertData.put("type", alertType);
        alertData.put("message", message);
        alertData.put("severity", severity);
        alertData.put("timestamp", System.currentTimeMillis());
        
        // Log estruturado para alertas
        log.error("ALERT [{}] {}: {}", severity, alertType, message);
        
        // Incrementar contador de alertas
        meterRegistry.counter("vynlo.alerts.total", 
            "type", alertType, 
            "severity", severity)
            .increment();
        
        // Aqui seria implementada a integração com:
        // - Slack
        // - PagerDuty
        // - Email
        // - SMS
        // - Webhook
        
        switch (severity) {
            case "CRITICAL" -> sendCriticalAlert(alertData);
            case "WARNING" -> sendWarningAlert(alertData);
            default -> log.info("Alert sent: {}", alertData);
        }
    }

    private void sendCriticalAlert(Map<String, Object> alertData) {
        // Implementar notificação crítica imediata
        log.error("CRITICAL ALERT: {}", alertData);
        // Integração com PagerDuty, SMS, etc.
    }

    private void sendWarningAlert(Map<String, Object> alertData) {
        // Implementar notificação de warning
        log.warn("WARNING ALERT: {}", alertData);
        // Integração com Slack, email, etc.
    }
}