package com.vynlotaste.service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
public class CacheMetricsService {

    private final MeterRegistry meterRegistry;
    private final RedisTemplate<String, Object> redisTemplate;
    
    private final ConcurrentHashMap<String, AtomicLong> cacheHits = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> cacheMisses = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Timer> cacheTimers = new ConcurrentHashMap<>();

    public void recordCacheHit(String cacheName, String operation, long durationMs) {
        cacheHits.computeIfAbsent(cacheName, k -> new AtomicLong(0)).incrementAndGet();
        
        Counter.builder("vynlo.cache.hits")
            .description("Cache hits")
            .tag("cache", cacheName)
            .tag("operation", operation)
            .register(meterRegistry)
            .increment();
        
        Timer timer = cacheTimers.computeIfAbsent(cacheName + "_" + operation, k ->
            Timer.builder("vynlo.cache.operation.duration")
                .description("Cache operation duration")
                .tag("cache", cacheName)
                .tag("operation", operation)
                .tag("result", "hit")
                .register(meterRegistry));
        
        timer.record(durationMs, java.util.concurrent.TimeUnit.MILLISECONDS);
        
        log.debug("Cache hit: {} - {} ({}ms)", cacheName, operation, durationMs);
    }

    public void recordCacheMiss(String cacheName, String operation, long durationMs) {
        cacheMisses.computeIfAbsent(cacheName, k -> new AtomicLong(0)).incrementAndGet();
        
        Counter.builder("vynlo.cache.misses")
            .description("Cache misses")
            .tag("cache", cacheName)
            .tag("operation", operation)
            .register(meterRegistry)
            .increment();
        
        Timer timer = cacheTimers.computeIfAbsent(cacheName + "_" + operation, k ->
            Timer.builder("vynlo.cache.operation.duration")
                .description("Cache operation duration")
                .tag("cache", cacheName)
                .tag("operation", operation)
                .tag("result", "miss")
                .register(meterRegistry));
        
        timer.record(durationMs, java.util.concurrent.TimeUnit.MILLISECONDS);
        
        log.debug("Cache miss: {} - {} ({}ms)", cacheName, operation, durationMs);
    }

    public void recordCacheEviction(String cacheName, String reason) {
        Counter.builder("vynlo.cache.evictions")
            .description("Cache evictions")
            .tag("cache", cacheName)
            .tag("reason", reason)
            .register(meterRegistry)
            .increment();
        
        log.info("Cache eviction: {} - reason: {}", cacheName, reason);
    }

    @Scheduled(fixedRate = 60000) // A cada minuto
    public void updateCacheMetrics() {
        cacheHits.forEach((cacheName, hits) -> {
            AtomicLong misses = cacheMisses.getOrDefault(cacheName, new AtomicLong(0));
            long totalRequests = hits.get() + misses.get();
            
            if (totalRequests > 0) {
                double hitRatio = (double) hits.get() / totalRequests * 100;
                
                final double ratio = hitRatio;
                Gauge.builder("vynlo.cache.hit.ratio", ratio, Double::doubleValue)
                    .description("Cache hit ratio percentage")
                    .tag("cache", cacheName)
                    .register(meterRegistry);
                
                log.debug("Cache hit ratio for {}: {:.2f}%", cacheName, hitRatio);
            }
        });
    }

    @Scheduled(fixedRate = 300000) // A cada 5 minutos
    public void updateRedisMetrics() {
        try {
            // Métricas do Redis
            String info = redisTemplate.getConnectionFactory()
                .getConnection()
                .serverCommands()
                .info().getProperty("memory");
            
            if (info != null) {
                String[] lines = info.split("\r\n");
                for (String line : lines) {
                    if (line.startsWith("used_memory:")) {
                        long usedMemory = Long.parseLong(line.split(":")[1]);
                        Gauge.builder("vynlo.redis.memory.used", usedMemory, Long::doubleValue)
                            .description("Redis used memory in bytes")
                            .register(meterRegistry);
                    }
                    if (line.startsWith("connected_clients:")) {
                        long connectedClients = Long.parseLong(line.split(":")[1]);
                        Gauge.builder("vynlo.redis.clients.connected", connectedClients, Long::doubleValue)
                            .description("Redis connected clients")
                            .register(meterRegistry);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error updating Redis metrics", e);
        }
    }

    public double getCacheHitRatio(String cacheName) {
        AtomicLong hits = cacheHits.get(cacheName);
        AtomicLong misses = cacheMisses.get(cacheName);
        
        if (hits == null && misses == null) return 0.0;
        
        long totalHits = hits != null ? hits.get() : 0;
        long totalMisses = misses != null ? misses.get() : 0;
        long total = totalHits + totalMisses;
        
        return total > 0 ? (double) totalHits / total * 100 : 0.0;
    }
}