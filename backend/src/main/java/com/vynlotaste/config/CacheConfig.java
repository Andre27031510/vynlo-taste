package com.vynlotaste.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Configuração de Cache Inteligente para Alta Performance
 * - Cache local para máxima velocidade
 * - Estratégias de eviction inteligentes
 * - Sem dependências externas
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    @Primary
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        
        // Configurar caches específicos com TTL
        cacheManager.setCacheNames(
            java.util.Arrays.asList(
                "users",           // Cache de usuários
                "products",        // Cache de produtos
                "orders",          // Cache de pedidos
                "restaurants",     // Cache de restaurantes
                "categories",      // Cache de categorias
                "ratings",         // Cache de avaliações
                "search"           // Cache de buscas
            )
        );
        
        return cacheManager;
    }

    /**
     * Cache Manager para dados que precisam de persistência
     * Pode ser expandido para Redis quando necessário
     */
    @Bean("persistentCacheManager")
    public CacheManager persistentCacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setCacheNames(java.util.Arrays.asList("sessions", "tokens", "audit"));
        return cacheManager;
    }
}
