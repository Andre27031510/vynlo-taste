package com.vynlotaste.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate Limiting Simples e Robusto para Alta Escala
 * - Sem dependências externas
 * - Cache local com sincronização leve
 * - Proteção contra DDoS
 * - Performance máxima
 */
@Slf4j
@Component
public class SimpleRateLimitInterceptor implements HandlerInterceptor {

    // Cache local para máxima velocidade
    private final Map<String, RateLimitInfo> rateLimitCache = new ConcurrentHashMap<>();
    
    // Limites configuráveis
    private static final int DEFAULT_LIMIT = 100; // requests por minuto
    private static final int AUTH_LIMIT = 10;     // login por minuto
    private static final int API_LIMIT = 1000;    // API geral por minuto
    private static final long WINDOW_MS = 60000;  // 1 minuto

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = getClientIp(request);
        String path = request.getRequestURI();
        
        // Verificar rate limit
        if (isRateLimited(clientIp, path)) {
            log.warn("Rate limit exceeded for IP: {} on path: {}", clientIp, path);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("Retry-After", "60");
            response.getWriter().write("Rate limit exceeded. Please try again later.");
            return false;
        }
        
        return true;
    }

    private boolean isRateLimited(String clientIp, String path) {
        long currentTime = System.currentTimeMillis();
        String key = clientIp + ":" + path;
        
        RateLimitInfo info = rateLimitCache.compute(key, (k, v) -> {
            if (v == null || currentTime - v.windowStart > WINDOW_MS) {
                // Nova janela de tempo
                return new RateLimitInfo(currentTime, getLimitForPath(path));
            }
            return v;
        });
        
        // Incrementar contador
        int currentCount = info.counter.incrementAndGet();
        
        // Verificar se excedeu o limite
        if (currentCount > info.limit) {
            log.debug("Rate limit check - IP: {}, Path: {}, Count: {}, Limit: {}", 
                     clientIp, path, currentCount, info.limit);
            return true;
        }
        
        return false;
    }

    private int getLimitForPath(String path) {
        if (path.startsWith("/api/v1/auth/")) {
            return AUTH_LIMIT;
        } else if (path.startsWith("/api/")) {
            return API_LIMIT;
        }
        return DEFAULT_LIMIT;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    // Classe interna para armazenar informações de rate limit
    private static class RateLimitInfo {
        final long windowStart;
        final int limit;
        final AtomicInteger counter;

        RateLimitInfo(long windowStart, int limit) {
            this.windowStart = windowStart;
            this.limit = limit;
            this.counter = new AtomicInteger(0);
        }
    }

    // Método para limpeza periódica do cache (opcional)
    public void cleanupExpiredEntries() {
        long currentTime = System.currentTimeMillis();
        rateLimitCache.entrySet().removeIf(entry -> 
            currentTime - entry.getValue().windowStart > WINDOW_MS * 2);
    }
}
