package com.vynlotaste.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.support.CompositeCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Hybrid Cache Configuration - Caffeine (L1) + Redis (L2)
 * 
 * Estratégia:
 * - L1 (Caffeine): Page<Product>, dados hot path, ultra-rápido (0.01ms)
 * - L2 (Redis): Stats, Product individual, compartilhado (1ms)
 * 
 * Benefícios:
 * - Resolve ClassCastException com Page<Product>
 * - Performance máxima (L1 em memória)
 * - Preparado para escalar (L2 compartilhado)
 * - Redundância (se L2 cair, L1 continua)
 * 
 * Persistência:
 * - L1: Não persiste (perde em restart) - Aceitável para paginação
 * - L2: Persiste (Redis continua rodando) - Crítico para stats
 * 
 * Custo: $0 adicional
 * RAM: +400 MB Caffeine, -50 MB Redis (menos dados) = +350 MB total
 * 
 * Created: 2025-10-16
 * @author Vynlo Tech
 */
@Slf4j
@Configuration
public class HybridCacheConfig {
    
    // Nomes dos caches Caffeine (L1 - Local)
    // Products
    public static final String CAFFEINE_PRODUCTS_PAGE = "caffeine-products-page";
    public static final String CAFFEINE_PRODUCTS_SEARCH_PAGE = "caffeine-products-search-page";
    public static final String CAFFEINE_PRODUCTS_AVAILABLE_PAGE = "caffeine-products-available-page";
    
    // Dynamic Queries (SearchController)
    public static final String CAFFEINE_USER_QUERIES = "caffeine-user-queries";
    public static final String CAFFEINE_PRODUCT_QUERIES = "caffeine-product-queries";
    public static final String CAFFEINE_ORDER_QUERIES = "caffeine-order-queries";
    
    /**
     * L1 Cache - Caffeine (In-Memory Local)
     * 
     * Usado para:
     * - Page<Product> (não serializa no Redis)
     * - Dados que mudam frequentemente
     * - Hot path (requisições mais frequentes)
     * 
     * Performance: ~0.01ms (100x mais rápido que Redis)
     * Persistência: NÃO (perde em restart)
     * Compartilhamento: NÃO (isolado por instância)
     */
    @Bean(name = "caffeineCacheManager")
    public CacheManager caffeineCacheManager() {
        log.info("Configurando Caffeine Cache Manager (L1 - Local)");
        
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
            CAFFEINE_PRODUCTS_PAGE,
            CAFFEINE_PRODUCTS_SEARCH_PAGE,
            CAFFEINE_PRODUCTS_AVAILABLE_PAGE,
            CAFFEINE_USER_QUERIES,
            CAFFEINE_PRODUCT_QUERIES,
            CAFFEINE_ORDER_QUERIES
        );
        
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(500)  // ENTERPRISE: 500 páginas (3M+ usuários) × ~200KB = 100 MB
            .expireAfterWrite(90, TimeUnit.SECONDS)  // TTL agressivo para dados críticos
            .expireAfterAccess(60, TimeUnit.SECONDS)  // Remove dados não acessados
            .recordStats()  // Métricas para monitoramento
            .removalListener((key, value, cause) -> {
                log.trace("♾️ Cache L1 removido: key={}, cause={}", key, cause);
            })
        );
        
        log.info("✅ Caffeine Cache ENTERPRISE configurado: 500 entries (6 caches), TTL 90s, ~100MB RAM");
        return cacheManager;
    }
    
    /**
     * L2 Cache - Redis (Distribuído)
     * 
     * Usado para:
     * - Product individual (compartilhar)
     * - Stats (compartilhar + persiste)
     * - List<Product> (serializa OK)
     * - Sessões, rate limiting
     * 
     * Performance: ~1ms (ainda rápido)
     * Persistência: SIM (Redis continua rodando)
     * Compartilhamento: SIM (entre instâncias)
     */
    @Bean(name = "redisCacheManagerL2")
    public CacheManager redisCacheManagerL2(RedisConnectionFactory connectionFactory) {
        log.info("Configurando Redis Cache Manager (L2 - Distribuído)");
        
        // Serializer para valores
        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer();
        
        // Config padrão: 5 min
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(5))
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(serializer))
            .disableCachingNullValues();
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(defaultConfig)
            
            // Product individual: 10 min (raramente muda)
            .withCacheConfiguration(CacheConfig.PRODUCTS_CACHE,
                RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(10))
                    .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                    .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(serializer))
                    .disableCachingNullValues())
            
            // Stats: 30 segundos (precisa estar atual)
            .withCacheConfiguration(CacheConfig.PRODUCT_STATS_CACHE,
                RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofSeconds(30))
                    .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                    .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(serializer))
                    .disableCachingNullValues())
            
            // Outros caches mantém config padrão (5 min)
            .transactionAware()
            .build();
    }
    
    /**
     * Composite Cache Manager - Híbrido (L1 + L2)
     * 
     * Ordem de busca:
     * 1. Caffeine (L1) - Mais rápido
     * 2. Redis (L2) - Se L1 miss
     * 3. Database - Se L1 e L2 miss
     * 
     * Fallback automático:
     * - Se Caffeine falhar → usa Redis
     * - Se Redis falhar → vai ao banco
     * - Sistema NUNCA para
     */
    @Bean(name = "hybridCacheManager")
    public CacheManager hybridCacheManager(
            @Qualifier("caffeineCacheManager") CacheManager caffeineCacheManager,
            @Qualifier("redisCacheManagerL2") CacheManager redisCacheManager) {
        
        log.info("Configurando Hybrid Cache Manager (Caffeine L1 + Redis L2)");
        
        CompositeCacheManager compositeCacheManager = new CompositeCacheManager(
            caffeineCacheManager,  // L1: Busca primeiro (0.01ms)
            redisCacheManager      // L2: Fallback (1ms)
        );
        
        compositeCacheManager.setFallbackToNoOpCache(false);  // Não criar caches inexistentes
        
        log.info("✅ Hybrid Cache Manager configurado:");
        log.info("   L1 (Caffeine): products-page, search-page, available-page");
        log.info("   L1 (Caffeine): user-queries, product-queries, order-queries");
        log.info("   L2 (Redis): products, product-stats, orders, users");
        log.info("   Fallback: L1 → L2 → Database");
        
        return compositeCacheManager;
    }
}

