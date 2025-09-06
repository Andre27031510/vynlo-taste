package com.vynlotaste.service;

import io.micrometer.core.instrument.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApiPerformanceMetricsService {

    private final MeterRegistry meterRegistry;
    private final ConcurrentHashMap<String, Timer> endpointTimers = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Counter> endpointCounters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> endpointErrors = new ConcurrentHashMap<>();

    public void recordApiCall(String endpoint, String method, long durationMs, int statusCode) {
        String key = method + "_" + endpoint;
        
        // Timer para duração
        Timer timer = endpointTimers.computeIfAbsent(key, k -> 
            Timer.builder("vynlo.api.request.duration")
                .description("API request duration")
                .tag("endpoint", endpoint)
                .tag("method", method)
                .register(meterRegistry));
        
        timer.record(durationMs, java.util.concurrent.TimeUnit.MILLISECONDS);
        
        // Counter para total de chamadas
        Counter counter = endpointCounters.computeIfAbsent(key, k ->
            Counter.builder("vynlo.api.request.total")
                .description("Total API requests")
                .tag("endpoint", endpoint)
                .tag("method", method)
                .tag("status", String.valueOf(statusCode))
                .register(meterRegistry));
        
        counter.increment();
        
        // Counter para erros
        if (statusCode >= 400) {
            Counter.builder("vynlo.api.request.errors")
                .description("API request errors")
                .tag("endpoint", endpoint)
                .tag("method", method)
                .tag("status", String.valueOf(statusCode))
                .register(meterRegistry)
                .increment();
            
            endpointErrors.computeIfAbsent(key, k -> new AtomicLong(0)).incrementAndGet();
            
            log.warn("API error recorded: {} {} - Status: {}, Duration: {}ms", 
                method, endpoint, statusCode, durationMs);
        }
        
        log.debug("API call recorded: {} {} - Status: {}, Duration: {}ms", 
            method, endpoint, statusCode, durationMs);
    }

    public void recordSlowQuery(String queryType, String table, long durationMs) {
        Timer.builder("vynlo.database.query.duration")
            .description("Database query duration")
            .tag("type", queryType)
            .tag("table", table)
            .register(meterRegistry)
            .record(durationMs, java.util.concurrent.TimeUnit.MILLISECONDS);
        
        if (durationMs > 1000) { // Queries > 1s são consideradas lentas
            Counter.builder("vynlo.database.query.slow")
                .description("Slow database queries")
                .tag("type", queryType)
                .tag("table", table)
                .register(meterRegistry)
                .increment();
            
            log.warn("Slow query detected: {} on {} - Duration: {}ms", queryType, table, durationMs);
        }
    }

    public void recordCacheHit(String cacheName, String operation) {
        Counter.builder("vynlo.cache.hits")
            .description("Cache hits")
            .tag("cache", cacheName)
            .tag("operation", operation)
            .register(meterRegistry)
            .increment();
        
        log.debug("Cache hit: {} - {}", cacheName, operation);
    }

    public void recordCacheMiss(String cacheName, String operation) {
        Counter.builder("vynlo.cache.misses")
            .description("Cache misses")
            .tag("cache", cacheName)
            .tag("operation", operation)
            .register(meterRegistry)
            .increment();
        
        log.debug("Cache miss: {} - {}", cacheName, operation);
    }

    public void recordResourceUsage(String resource, double value, String unit) {
        final double val = value;
        Gauge.builder("vynlo.system.resource.usage", val, Double::doubleValue)
            .description("System resource usage")
            .tag("resource", resource)
            .tag("unit", unit)
            .register(meterRegistry);
        
        log.debug("Resource usage recorded: {} = {} {}", resource, value, unit);
    }

    public void recordThroughput(String operation, long count) {
        Counter.builder("vynlo.system.throughput")
            .description("System throughput")
            .tag("operation", operation)
            .register(meterRegistry)
            .increment(count);
        
        log.debug("Throughput recorded: {} = {}", operation, count);
    }

    public double getApiErrorRate(String endpoint, String method) {
        String key = method + "_" + endpoint;
        AtomicLong errors = endpointErrors.get(key);
        Counter counter = endpointCounters.get(key);
        
        if (counter == null || counter.count() == 0) return 0.0;
        
        long errorCount = errors != null ? errors.get() : 0;
        return (double) errorCount / counter.count() * 100;
    }

    public double getAverageResponseTime(String endpoint, String method) {
        String key = method + "_" + endpoint;
        Timer timer = endpointTimers.get(key);
        
        if (timer == null || timer.count() == 0) return 0.0;
        
        return timer.mean(java.util.concurrent.TimeUnit.MILLISECONDS);
    }
}