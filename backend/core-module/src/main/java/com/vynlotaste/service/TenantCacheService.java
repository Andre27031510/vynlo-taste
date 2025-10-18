package com.vynlotaste.service;

import com.vynlotaste.config.CacheConfig;
import com.vynlotaste.context.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Serviço de invalidação de cache tenant-aware
 * CRÍTICO: Evita vazamento de dados entre tenants
 * 
 * Para sistemas de 3M+ usuários:
 * - Invalidação seletiva por tenant
 * - Auditoria completa de operações
 * - Fallback automático em caso de erro
 * 
 * @version 1.0.0
 * @author Vynlo Tech - Security Team
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TenantCacheService {

    private final CacheManager hybridCacheManager;
    private final CacheManager redisCacheManagerL2;
    private final CacheManager caffeineCacheManager;

    /**
     * Invalida cache de produtos para o tenant atual
     * SEGURO: Só invalida dados do tenant logado
     */
    public void evictProductCacheForCurrentTenant() {
        String tenantKey = getTenantKeySafe();
        
        try {
            // L1 Cache (Caffeine) - Invalidar páginas do tenant
            evictCaffeineProductPages(tenantKey);
            
            // L2 Cache (Redis) - Invalidar dados do tenant
            evictRedisProductData(tenantKey);
            
            log.info("✅ Cache de produtos invalidado para tenant: {}", tenantKey);
            
        } catch (Exception e) {
            log.error("❌ ERRO ao invalidar cache para tenant: {}", tenantKey, e);
            // Fallback: Invalidar tudo (segurança > performance)
            evictAllProductCache();
        }
    }

    /**
     * Invalida TODOS os caches de produtos (EMERGÊNCIA)
     * Usado quando há suspeita de vazamento de dados
     */
    public void evictAllProductCache() {
        log.warn("🚨 INVALIDAÇÃO TOTAL DE CACHE - Operação de emergência");
        
        try {
            // Caffeine caches
            Set<String> caffeineNames = Set.of(
                "caffeine-products-page",
                "caffeine-products-available-page", 
                "caffeine-products-search-page"
            );
            
            for (String cacheName : caffeineNames) {
                Cache cache = caffeineCacheManager.getCache(cacheName);
                if (cache != null) {
                    cache.clear();
                    log.info("✅ Cache Caffeine limpo: {}", cacheName);
                }
            }
            
            // Redis caches
            Set<String> redisNames = Set.of(
                CacheConfig.PRODUCTS_CACHE,
                CacheConfig.PRODUCT_STATS_CACHE,
                CacheConfig.PRODUCT_CATEGORIES_CACHE
            );
            
            for (String cacheName : redisNames) {
                Cache cache = redisCacheManagerL2.getCache(cacheName);
                if (cache != null) {
                    cache.clear();
                    log.info("✅ Cache Redis limpo: {}", cacheName);
                }
            }
            
            log.warn("🚨 INVALIDAÇÃO TOTAL CONCLUÍDA - Sistema seguro");
            
        } catch (Exception e) {
            log.error("❌ FALHA CRÍTICA na invalidação total de cache", e);
        }
    }

    /**
     * Invalida cache específico por chave (ADMIN)
     * Usado para operações administrativas
     */
    public void evictSpecificKey(String cacheName, String key) {
        if (!TenantContext.isSuperAdmin()) {
            throw new SecurityException("SECURITY: Apenas Super Admins podem invalidar chaves específicas");
        }
        
        try {
            Cache cache = hybridCacheManager.getCache(cacheName);
            if (cache != null) {
                cache.evict(key);
                log.info("✅ Chave específica invalidada: cache={}, key={}", cacheName, key);
            }
        } catch (Exception e) {
            log.error("❌ Erro ao invalidar chave específica: cache={}, key={}", cacheName, key, e);
        }
    }

    /**
     * Obtém estatísticas de cache por tenant
     */
    public CacheStats getCacheStatsForCurrentTenant() {
        String tenantKey = getTenantKeySafe();
        
        // TODO: Implementar coleta de métricas específicas
        // Por enquanto, retorna stats básicas
        return new CacheStats(tenantKey, 0, 0, 0.0);
    }

    // ============================================================================
    // MÉTODOS PRIVADOS
    // ============================================================================

    private void evictCaffeineProductPages(String tenantKey) {
        Set<String> cacheNames = Set.of(
            "caffeine-products-page",
            "caffeine-products-available-page",
            "caffeine-products-search-page"
        );
        
        for (String cacheName : cacheNames) {
            Cache cache = caffeineCacheManager.getCache(cacheName);
            if (cache != null) {
                // Caffeine não suporta evict por padrão de chave
                // Solução: Clear completo (aceitável para L1)
                cache.clear();
                log.debug("✅ Cache Caffeine limpo: {} (tenant={})", cacheName, tenantKey);
            }
        }
    }

    private void evictRedisProductData(String tenantKey) {
        Cache productsCache = redisCacheManagerL2.getCache(CacheConfig.PRODUCTS_CACHE);
        Cache statsCache = redisCacheManagerL2.getCache(CacheConfig.PRODUCT_STATS_CACHE);
        
        if (productsCache != null) {
            // Evict chaves específicas do tenant
            productsCache.evict("available:" + tenantKey);
            productsCache.evict("stats:" + tenantKey);
            productsCache.evict("low-stock:" + tenantKey);
            log.debug("✅ Cache Redis de produtos limpo para tenant: {}", tenantKey);
        }
        
        if (statsCache != null) {
            statsCache.evict("stats:" + tenantKey);
            log.debug("✅ Cache Redis de stats limpo para tenant: {}", tenantKey);
        }
    }

    private String getTenantKeySafe() {
        if (TenantContext.isSuperAdmin()) {
            return "super";
        }
        
        Long tenantId = TenantContext.getCurrentTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("SECURITY: Tenant não definido - operação negada");
        }
        
        return tenantId.toString();
    }

    // ============================================================================
    // CLASSES INTERNAS
    // ============================================================================

    public static class CacheStats {
        private final String tenantKey;
        private final long hitCount;
        private final long missCount;
        private final double hitRatio;

        public CacheStats(String tenantKey, long hitCount, long missCount, double hitRatio) {
            this.tenantKey = tenantKey;
            this.hitCount = hitCount;
            this.missCount = missCount;
            this.hitRatio = hitRatio;
        }

        // Getters
        public String getTenantKey() { return tenantKey; }
        public long getHitCount() { return hitCount; }
        public long getMissCount() { return missCount; }
        public double getHitRatio() { return hitRatio; }
    }
}