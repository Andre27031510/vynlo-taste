package com.vynlotaste.controller;

import com.vynlotaste.service.ApiPerformanceMetricsService;
import com.vynlotaste.service.BusinessMetricsService;
import com.vynlotaste.service.CacheMetricsService;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/metrics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class MetricsController {

    private final MeterRegistry meterRegistry;
    private final BusinessMetricsService businessMetricsService;
    private final ApiPerformanceMetricsService apiMetricsService;
    private final CacheMetricsService cacheMetricsService;

    @GetMapping("/business")
    public ResponseEntity<Map<String, Object>> getBusinessMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Métricas de contadores
        metrics.put("ordersCreated", getCounterValue("vynlo.business.orders.created"));
        metrics.put("ordersCompleted", getCounterValue("vynlo.business.orders.completed"));
        metrics.put("ordersCancelled", getCounterValue("vynlo.business.orders.cancelled"));
        metrics.put("usersRegistered", getCounterValue("vynlo.business.users.registered"));
        metrics.put("productsViewed", getCounterValue("vynlo.business.products.viewed"));
        
        // Métricas de gauge
        metrics.put("activeUsers", getGaugeValue("vynlo.business.users.active"));
        metrics.put("pendingOrders", getGaugeValue("vynlo.business.orders.pending"));
        metrics.put("totalRevenue", getGaugeValue("vynlo.business.revenue.total"));
        metrics.put("conversionRate", getGaugeValue("vynlo.business.conversion.rate"));
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/api-performance")
    public ResponseEntity<Map<String, Object>> getApiPerformanceMetrics(
            @RequestParam(required = false) String endpoint,
            @RequestParam(required = false) String method) {
        
        Map<String, Object> metrics = new HashMap<>();
        
        if (endpoint != null && method != null) {
            metrics.put("errorRate", apiMetricsService.getApiErrorRate(endpoint, method));
            metrics.put("averageResponseTime", apiMetricsService.getAverageResponseTime(endpoint, method));
        }
        
        // Métricas gerais de API
        metrics.put("totalRequests", getCounterValue("vynlo.api.request.total"));
        metrics.put("totalErrors", getCounterValue("vynlo.api.request.errors"));
        metrics.put("slowQueries", getCounterValue("vynlo.database.query.slow"));
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/cache")
    public ResponseEntity<Map<String, Object>> getCacheMetrics(
            @RequestParam(required = false) String cacheName) {
        
        Map<String, Object> metrics = new HashMap<>();
        
        if (cacheName != null) {
            metrics.put("hitRatio", cacheMetricsService.getCacheHitRatio(cacheName));
        }
        
        // Métricas gerais de cache
        metrics.put("totalHits", getCounterValue("vynlo.cache.hits"));
        metrics.put("totalMisses", getCounterValue("vynlo.cache.misses"));
        metrics.put("evictions", getCounterValue("vynlo.cache.evictions"));
        
        // Métricas do Redis
        metrics.put("redisMemoryUsed", getGaugeValue("vynlo.redis.memory.used"));
        metrics.put("redisConnectedClients", getGaugeValue("vynlo.redis.clients.connected"));
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/database")
    public ResponseEntity<Map<String, Object>> getDatabaseMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Métricas de queries
        metrics.put("totalQueries", getCounterValue("vynlo.database.query.total"));
        metrics.put("slowQueries", getCounterValue("vynlo.database.query.slow"));
        metrics.put("queryErrors", getCounterValue("vynlo.database.query.errors"));
        
        // Métricas de conexões
        metrics.put("activeConnections", getGaugeValue("vynlo.database.connections.active"));
        metrics.put("poolActive", getGaugeValue("vynlo.database.pool.active"));
        metrics.put("poolIdle", getGaugeValue("vynlo.database.pool.idle"));
        metrics.put("poolTotal", getGaugeValue("vynlo.database.pool.total"));
        
        // Métricas de transações
        metrics.put("transactionsCommitted", getCounterValue("vynlo.database.transaction.total"));
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/system")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Métricas de sistema
        Runtime runtime = Runtime.getRuntime();
        metrics.put("maxMemory", runtime.maxMemory());
        metrics.put("totalMemory", runtime.totalMemory());
        metrics.put("freeMemory", runtime.freeMemory());
        metrics.put("usedMemory", runtime.totalMemory() - runtime.freeMemory());
        metrics.put("availableProcessors", runtime.availableProcessors());
        
        // Métricas de alertas
        metrics.put("totalAlerts", getCounterValue("vynlo.alerts.total"));
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // KPIs principais para dashboard
        dashboard.put("business", Map.of(
            "ordersToday", getGaugeValue("vynlo.business.orders.daily"),
            "revenueToday", getGaugeValue("vynlo.business.revenue.daily"),
            "activeUsers", getGaugeValue("vynlo.business.users.active"),
            "conversionRate", getGaugeValue("vynlo.business.conversion.rate")
        ));
        
        dashboard.put("performance", Map.of(
            "avgResponseTime", getTimerMean("vynlo.api.request.duration"),
            "errorRate", calculateErrorRate(),
            "cacheHitRatio", getAverageCacheHitRatio(),
            "slowQueries", getCounterValue("vynlo.database.query.slow")
        ));
        
        dashboard.put("system", Map.of(
            "memoryUsage", calculateMemoryUsagePercent(),
            "activeConnections", getGaugeValue("vynlo.database.connections.active"),
            "redisMemory", getGaugeValue("vynlo.redis.memory.used"),
            "alerts", getCounterValue("vynlo.alerts.total")
        ));
        
        return ResponseEntity.ok(dashboard);
    }

    private double getCounterValue(String name) {
        return meterRegistry.find(name).counter() != null ? 
            meterRegistry.find(name).counter().count() : 0.0;
    }

    private double getGaugeValue(String name) {
        return meterRegistry.find(name).gauge() != null ? 
            meterRegistry.find(name).gauge().value() : 0.0;
    }

    private double getTimerMean(String name) {
        return meterRegistry.find(name).timer() != null ? 
            meterRegistry.find(name).timer().mean(java.util.concurrent.TimeUnit.MILLISECONDS) : 0.0;
    }

    private double calculateErrorRate() {
        double totalRequests = getCounterValue("vynlo.api.request.total");
        double totalErrors = getCounterValue("vynlo.api.request.errors");
        return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0.0;
    }

    private double getAverageCacheHitRatio() {
        String[] caches = {"users", "products", "orders"};
        double totalRatio = 0.0;
        int count = 0;
        
        for (String cache : caches) {
            double ratio = cacheMetricsService.getCacheHitRatio(cache);
            if (ratio > 0) {
                totalRatio += ratio;
                count++;
            }
        }
        
        return count > 0 ? totalRatio / count : 0.0;
    }

    private double calculateMemoryUsagePercent() {
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long usedMemory = runtime.totalMemory() - runtime.freeMemory();
        return (double) usedMemory / maxMemory * 100;
    }
}