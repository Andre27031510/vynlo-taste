package com.vynlotaste.controller;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.service.TenantCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller para operações de cache tenant-aware
 * CRÍTICO: Endpoints de emergência para sistemas de 3M+ usuários
 * 
 * Segurança:
 * - Apenas Super Admins podem invalidar cache global
 * - Tenants podem invalidar apenas seu próprio cache
 * - Auditoria completa de todas as operações
 * 
 * @version 1.0.0
 * @author Vynlo Tech - Security Team
 */
@Slf4j
@RestController
@RequestMapping("/v1/cache")
@RequiredArgsConstructor
public class CacheManagementController {

    private final TenantCacheService tenantCacheService;

    /**
     * Invalida cache de produtos do tenant atual
     * SEGURO: Cada tenant só pode invalidar seu próprio cache
     */
    @PostMapping("/products/evict")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> evictProductCache() {
        try {
            String tenantKey = TenantContext.isSuperAdmin() ? "super" : 
                              TenantContext.getCurrentTenantId().toString();
            
            tenantCacheService.evictProductCacheForCurrentTenant();
            
            log.info("✅ Cache de produtos invalidado via API [tenant={}]", tenantKey);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cache de produtos invalidado com sucesso",
                "tenant", tenantKey,
                "timestamp", System.currentTimeMillis()
            ));
            
        } catch (Exception e) {
            log.error("❌ Erro ao invalidar cache via API", e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Erro interno ao invalidar cache",
                "error", e.getMessage()
            ));
        }
    }

    /**
     * EMERGÊNCIA: Invalida TODO o cache de produtos
     * CRÍTICO: Apenas Super Admins em caso de vazamento de dados
     */
    @PostMapping("/products/evict-all")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> evictAllProductCache() {
        try {
            log.warn("🚨 OPERAÇÃO DE EMERGÊNCIA: Invalidação total de cache solicitada via API");
            
            tenantCacheService.evictAllProductCache();
            
            log.warn("🚨 OPERAÇÃO DE EMERGÊNCIA CONCLUÍDA: Todo cache de produtos invalidado");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "EMERGÊNCIA: Todo cache de produtos invalidado",
                "operation", "EMERGENCY_CACHE_CLEAR",
                "timestamp", System.currentTimeMillis()
            ));
            
        } catch (Exception e) {
            log.error("❌ FALHA CRÍTICA na operação de emergência", e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "FALHA CRÍTICA na invalidação de emergência",
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Invalida chave específica de cache
     * ADMIN: Apenas Super Admins para debugging
     */
    @PostMapping("/evict-key")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> evictSpecificKey(
            @RequestParam String cacheName,
            @RequestParam String key) {
        
        try {
            tenantCacheService.evictSpecificKey(cacheName, key);
            
            log.info("✅ Chave específica invalidada via API: cache={}, key={}", 
                    sanitizeForLog(cacheName), sanitizeForLog(key));
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Chave específica invalidada",
                "cacheName", cacheName,
                "key", key
            ));
            
        } catch (SecurityException e) {
            log.warn("🚫 Tentativa de acesso negado: {}", e.getMessage());
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "message", "Acesso negado",
                "error", e.getMessage()
            ));
            
        } catch (Exception e) {
            log.error("❌ Erro ao invalidar chave específica: cache={}, key={}", 
                    sanitizeForLog(cacheName), sanitizeForLog(key), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Erro interno",
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Obtém estatísticas de cache do tenant atual
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        try {
            TenantCacheService.CacheStats stats = tenantCacheService.getCacheStatsForCurrentTenant();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "stats", Map.of(
                    "tenantKey", stats.getTenantKey(),
                    "hitCount", stats.getHitCount(),
                    "missCount", stats.getMissCount(),
                    "hitRatio", stats.getHitRatio()
                ),
                "timestamp", System.currentTimeMillis()
            ));
            
        } catch (Exception e) {
            log.error("❌ Erro ao obter estatísticas de cache", e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Erro ao obter estatísticas",
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Health check do sistema de cache
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> cacheHealthCheck() {
        try {
            String tenantInfo = TenantContext.isSuperAdmin() ? "super" : 
                               (TenantContext.getCurrentTenantId() != null ? 
                                TenantContext.getCurrentTenantId().toString() : "unauthenticated");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Sistema de cache operacional",
                "tenantContext", tenantInfo,
                "timestamp", System.currentTimeMillis()
            ));
            
        } catch (Exception e) {
            log.error("❌ Erro no health check do cache", e);
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Erro no sistema de cache",
                "error", e.getMessage()
            ));
        }
    }
    
    /**
     * Sanitiza dados para logs (previne log injection)
     */
    private String sanitizeForLog(String input) {
        if (input == null) return "null";
        return input.replaceAll("[\r\n\t]", "_")
                   .replaceAll("[<>\"'&]", "*")
                   .substring(0, Math.min(input.length(), 50));
    }
}