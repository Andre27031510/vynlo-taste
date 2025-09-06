package com.vynlotaste.service;

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
public class CorsMonitoringService {

    private final MeterRegistry meterRegistry;
    private final ConcurrentHashMap<String, AtomicLong> corsRequestsByOrigin = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> corsBlockedByOrigin = new ConcurrentHashMap<>();

    public void recordCorsRequest(String origin, boolean allowed) {
        // Métricas por origin
        corsRequestsByOrigin.computeIfAbsent(origin, k -> new AtomicLong(0)).incrementAndGet();
        
        if (!allowed) {
            corsBlockedByOrigin.computeIfAbsent(origin, k -> new AtomicLong(0)).incrementAndGet();
        }

        // Métricas Micrometer
        Counter.builder("vynlo.cors.requests")
                .tag("origin", sanitizeOrigin(origin))
                .tag("allowed", String.valueOf(allowed))
                .description("CORS requests by origin")
                .register(meterRegistry)
                .increment();
    }

    public void recordRateLimitExceeded(String origin) {
        Counter.builder("vynlo.cors.rate_limit_exceeded")
                .tag("origin", sanitizeOrigin(origin))
                .description("CORS rate limit exceeded by origin")
                .register(meterRegistry)
                .increment();
    }

    @Scheduled(fixedRate = 300000) // A cada 5 minutos
    public void logCorsStatistics() {
        if (corsRequestsByOrigin.isEmpty()) {
            return;
        }

        log.info("=== CORS Statistics (last 5 minutes) ===");
        corsRequestsByOrigin.forEach((origin, requests) -> {
            AtomicLong blocked = corsBlockedByOrigin.getOrDefault(origin, new AtomicLong(0));
            long requestCount = requests.get();
            long blockedCount = blocked.get();
            double blockRate = requestCount > 0 ? (blockedCount * 100.0 / requestCount) : 0;
            
            log.info("Origin: {} - Requests: {}, Blocked: {} ({}%)", 
                origin, requestCount, blockedCount, String.format("%.1f", blockRate));
        });

        // Reset contadores
        corsRequestsByOrigin.clear();
        corsBlockedByOrigin.clear();
    }

    private String sanitizeOrigin(String origin) {
        if (origin == null) {
            return "null";
        }
        // Remove caracteres especiais para métricas
        return origin.replaceAll("[^a-zA-Z0-9.-]", "_");
    }

    public long getCorsRequestCount(String origin) {
        return corsRequestsByOrigin.getOrDefault(origin, new AtomicLong(0)).get();
    }

    public long getCorsBlockedCount(String origin) {
        return corsBlockedByOrigin.getOrDefault(origin, new AtomicLong(0)).get();
    }
}