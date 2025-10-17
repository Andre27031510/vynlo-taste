package com.vynlotaste.config;

import com.github.benmanes.caffeine.cache.stats.CacheStats;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.MeterBinder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.support.CompositeCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração de Métricas para Cache Híbrido (Caffeine L1 + Redis L2)
 * 
 * Expõe métricas via Spring Boot Actuator:
 * - /actuator/metrics/caffeine.cache.hit.ratio
 * - /actuator/metrics/caffeine.cache.size
 * - /actuator/metrics/caffeine.cache.eviction.count
 * - /actuator/metrics/caffeine.cache.miss.count
 * 
 * Integração Prometheus:
 * - Scrape: /actuator/prometheus
 * - Dashboard: Grafana (visualizar hit rate, evictions, size)
 * 
 * Performance:
 * - Overhead: < 0.1ms (apenas leitura de stats)
 * - Thread-safe: Sim (Caffeine stats)
 * 
 * Alertas recomendados:
 * - Hit rate < 80% → Cache subutilizado (aumentar size/TTL)
 * - Evictions > 50/min → Cache pequeno (aumentar maximumSize)
 * - Size = maximumSize → Cache cheio (considerar aumentar)
 * 
 * Created: 2025-10-17
 * @author Vynlo Tech
 */
@Slf4j
@Configuration
public class CacheMetricsConfig {

    /**
     * Registra métricas Caffeine L1 no Micrometer/Actuator
     * 
     * Métricas disponíveis:
     * 1. caffeine.cache.hit.ratio (0.0-1.0) - Taxa de acerto
     * 2. caffeine.cache.miss.count - Total de misses
     * 3. caffeine.cache.eviction.count - Total de evictions
     * 4. caffeine.cache.size - Entries atuais no cache
     * 5. caffeine.cache.load.success.count - Loads bem-sucedidos
     * 6. caffeine.cache.load.failure.count - Loads falhados
     * 
     * Tag: cache=<nome_cache> (ex: caffeine-products-page)
     */
    @Bean
    public MeterBinder caffeineCacheMetrics(CacheManager hybridCacheManager) {
        log.info("Configurando métricas Caffeine para Actuator/Prometheus");
        
        return (MeterRegistry registry) -> {
            try {
                // Extrair Caffeine CacheManager do CompositeCacheManager
                if (!(hybridCacheManager instanceof CompositeCacheManager)) {
                    log.warn("CacheManager não é CompositeCacheManager, métricas Caffeine não disponíveis");
                    return;
                }
                
                CompositeCacheManager composite = (CompositeCacheManager) hybridCacheManager;
                CacheManager caffeineCacheManager = composite.getCacheManagers().stream()
                    .filter(cm -> cm instanceof CaffeineCacheManager)
                    .findFirst()
                    .orElse(null);
                
                if (caffeineCacheManager == null) {
                    log.warn("CaffeineCacheManager não encontrado, métricas não disponíveis");
                    return;
                }
                
                CaffeineCacheManager caffeine = (CaffeineCacheManager) caffeineCacheManager;
                
                // Registrar métricas para cada cache Caffeine
                caffeine.getCacheNames().forEach(cacheName -> {
                    try {
                        org.springframework.cache.Cache springCache = caffeine.getCache(cacheName);
                        if (springCache == null) {
                            log.warn("Cache '{}' não encontrado", cacheName);
                            return;
                        }
                        
                        // Obter cache nativo Caffeine
                        com.github.benmanes.caffeine.cache.Cache<Object, Object> nativeCache = 
                            (com.github.benmanes.caffeine.cache.Cache<Object, Object>) 
                            springCache.getNativeCache();
                        
                        CacheStats stats = nativeCache.stats();
                        
                        // Métrica 1: Hit Ratio (0.0-1.0) - CRÍTICA
                        Gauge.builder("caffeine.cache.hit.ratio", stats, CacheStats::hitRate)
                            .description("Taxa de acerto do cache Caffeine (0.0-1.0)")
                            .tag("cache", cacheName)
                            .tag("type", "L1")
                            .register(registry);
                        
                        // Métrica 2: Miss Count
                        Gauge.builder("caffeine.cache.miss.count", stats, CacheStats::missCount)
                            .description("Total de cache misses")
                            .tag("cache", cacheName)
                            .tag("type", "L1")
                            .register(registry);
                        
                        // Métrica 3: Eviction Count - IMPORTANTE
                        Gauge.builder("caffeine.cache.eviction.count", stats, CacheStats::evictionCount)
                            .description("Total de evictions (cache cheio)")
                            .tag("cache", cacheName)
                            .tag("type", "L1")
                            .register(registry);
                        
                        // Métrica 4: Cache Size (entries)
                        Gauge.builder("caffeine.cache.size", nativeCache, 
                                com.github.benmanes.caffeine.cache.Cache::estimatedSize)
                            .description("Número de entries no cache")
                            .tag("cache", cacheName)
                            .tag("type", "L1")
                            .register(registry);
                        
                        // Métrica 5: Load Success Count
                        Gauge.builder("caffeine.cache.load.success.count", stats, CacheStats::loadSuccessCount)
                            .description("Total de loads bem-sucedidos")
                            .tag("cache", cacheName)
                            .tag("type", "L1")
                            .register(registry);
                        
                        // Métrica 6: Load Failure Count
                        Gauge.builder("caffeine.cache.load.failure.count", stats, CacheStats::loadFailureCount)
                            .description("Total de loads falhados")
                            .tag("cache", cacheName)
                            .tag("type", "L1")
                            .register(registry);
                        
                        log.info("✅ Métricas registradas para cache: {} (L1 Caffeine)", cacheName);
                        
                    } catch (Exception e) {
                        log.error("Erro ao registrar métricas para cache: {}", cacheName, e);
                    }
                });
                
                log.info("✅ Configuração de métricas Caffeine concluída");
                log.info("   Acesse: /actuator/metrics/caffeine.cache.hit.ratio");
                log.info("   Prometheus: /actuator/prometheus");
                
            } catch (Exception e) {
                log.error("Erro ao configurar métricas Caffeine", e);
            }
        };
    }
}

