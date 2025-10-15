package com.vynlotaste.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.CacheErrorHandler;

import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

// Modified: 2025-10-14 20:40 UTC | Cursor recommendations: PRODUCT_STATS_CACHE 30s + PRODUCTS_CACHE 15min
// Modified: 2025-10-14 20:45 UTC | Production-ready cache optimization - Sistema 3M+ usuários
@Slf4j
@Configuration
@EnableCaching
public class CacheConfig implements CachingConfigurer {

    public static final String USERS_CACHE = "users";
    public static final String PRODUCTS_CACHE = "products";
    public static final String PRODUCT_STATS_CACHE = "product-stats"; // ✅ Cache específico para stats de produtos (30s TTL)
    public static final String ORDERS_CACHE = "orders";
    public static final String SYSTEM_CONFIG_CACHE = "system-config";
    public static final String PRODUCT_CATEGORIES_CACHE = "product-categories";
    public static final String USER_STATS_CACHE = "userStats";
    public static final String DRIVER_STATS_CACHE = "driverStats";
    public static final String ORDER_STATS_CACHE = "orderStats";

    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(objectMapper);

        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer))
            .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Cache de usuários - TTL 15 minutos
        cacheConfigurations.put(USERS_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // Cache de produtos - TTL 15 minutos (reduzido de 1h para contexto administrativo)
        cacheConfigurations.put(PRODUCTS_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // Cache de stats de produtos - TTL 30 segundos (reflete cadastros rapidamente)
        cacheConfigurations.put(PRODUCT_STATS_CACHE, defaultConfig.entryTtl(Duration.ofSeconds(30)));
        
        // Cache de pedidos recentes - TTL 5 minutos
        cacheConfigurations.put(ORDERS_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Cache de configurações - TTL 24 horas
        cacheConfigurations.put(SYSTEM_CONFIG_CACHE, defaultConfig.entryTtl(Duration.ofHours(24)));
        
        // Cache de categorias - TTL 2 horas
        cacheConfigurations.put(PRODUCT_CATEGORIES_CACHE, defaultConfig.entryTtl(Duration.ofHours(2)));
        
        // Cache de estatísticas - TTL 30 segundos (alta carga, dados dinâmicos)
        cacheConfigurations.put(USER_STATS_CACHE, defaultConfig.entryTtl(Duration.ofSeconds(30)));
        cacheConfigurations.put(DRIVER_STATS_CACHE, defaultConfig.entryTtl(Duration.ofSeconds(30)));
        cacheConfigurations.put(ORDER_STATS_CACHE, defaultConfig.entryTtl(Duration.ofSeconds(30)));

        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigurations)
            .transactionAware()
            .build();
    }

    @Bean
    @ConditionalOnProperty(name = "spring.cache.type", havingValue = "none", matchIfMissing = false)
    public CacheManager fallbackCacheManager() {
        log.warn("Redis indisponível - usando cache em memória como fallback");
        return new org.springframework.cache.concurrent.ConcurrentMapCacheManager(
            USERS_CACHE, PRODUCTS_CACHE, PRODUCT_STATS_CACHE, ORDERS_CACHE, SYSTEM_CONFIG_CACHE, PRODUCT_CATEGORIES_CACHE,
            USER_STATS_CACHE, DRIVER_STATS_CACHE, ORDER_STATS_CACHE
        );
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }

    @Override
    public CacheErrorHandler errorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException exception, org.springframework.cache.Cache cache, Object key) {
                log.warn("Cache GET error for key: {} in cache: {}", key, cache.getName(), exception);
            }

            @Override
            public void handleCachePutError(RuntimeException exception, org.springframework.cache.Cache cache, Object key, Object value) {
                log.warn("Cache PUT error for key: {} in cache: {}", key, cache.getName(), exception);
            }

            @Override
            public void handleCacheEvictError(RuntimeException exception, org.springframework.cache.Cache cache, Object key) {
                log.warn("Cache EVICT error for key: {} in cache: {}", key, cache.getName(), exception);
            }

            @Override
            public void handleCacheClearError(RuntimeException exception, org.springframework.cache.Cache cache) {
                log.warn("Cache CLEAR error in cache: {}", cache.getName(), exception);
            }
        };
    }

    @Override
    public KeyGenerator keyGenerator() {
        return (target, method, params) -> {
            StringBuilder sb = new StringBuilder();
            sb.append(target.getClass().getSimpleName()).append(":");
            sb.append(method.getName()).append(":");
            for (Object param : params) {
                sb.append(param != null ? param.toString() : "null").append(":");
            }
            return sb.toString();
        };
    }
}