package com.vynlotaste.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Filtro de Rate Limiting para proteção contra ataques de força bruta
 * Implementa diferentes limites por endpoint e IP
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitingFilter.class);
    
    // Cache de buckets por IP
    private final ConcurrentHashMap<String, Bucket> ipBuckets = new ConcurrentHashMap<>();
    
    // Cache de buckets por endpoint sensível
    private final ConcurrentHashMap<String, Bucket> endpointBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String clientIp = getClientIpAddress(request);
        String endpoint = request.getRequestURI();
        String method = request.getMethod();
        
        try {
            // Verificar rate limit por IP
            if (!checkIpRateLimit(clientIp)) {
                handleRateLimitExceeded(response, "IP rate limit exceeded", clientIp, endpoint);
                return;
            }
            
            // Verificar rate limit por endpoint sensível
            if (isSensitiveEndpoint(endpoint, method) && !checkEndpointRateLimit(clientIp + ":" + endpoint)) {
                handleRateLimitExceeded(response, "Endpoint rate limit exceeded", clientIp, endpoint);
                return;
            }
            
            filterChain.doFilter(request, response);
            
        } catch (Exception e) {
            logger.error("Erro no filtro de rate limiting: {}", e.getMessage());
            filterChain.doFilter(request, response);
        }
    }

    private boolean checkIpRateLimit(String clientIp) {
        Bucket bucket = ipBuckets.computeIfAbsent(clientIp, this::createIpBucket);
        return bucket.tryConsume(1);
    }

    private boolean checkEndpointRateLimit(String key) {
        Bucket bucket = endpointBuckets.computeIfAbsent(key, this::createEndpointBucket);
        return bucket.tryConsume(1);
    }

    private Bucket createIpBucket(String ip) {
        // Limite geral: 1000 requisições por hora por IP
        Bandwidth limit = Bandwidth.builder()
            .capacity(1000)
            .refillGreedy(1000, Duration.ofHours(1))
            .build();
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    private Bucket createEndpointBucket(String key) {
        String endpoint = key.split(":")[1];
        
        // Limites específicos por tipo de endpoint
        if (endpoint.contains("/auth/login")) {
            // Login: 5 tentativas por minuto
            Bandwidth limit = Bandwidth.builder()
                .capacity(5)
                .refillGreedy(5, Duration.ofMinutes(1))
                .build();
            return Bucket.builder().addLimit(limit).build();
        }
        
        if (endpoint.contains("/auth/register")) {
            // Registro: 3 tentativas por minuto
            Bandwidth limit = Bandwidth.builder()
                .capacity(3)
                .refillGreedy(3, Duration.ofMinutes(1))
                .build();
            return Bucket.builder().addLimit(limit).build();
        }
        
        if (endpoint.contains("/admin/")) {
            // Endpoints admin: 100 requisições por hora
            Bandwidth limit = Bandwidth.builder()
                .capacity(100)
                .refillGreedy(100, Duration.ofHours(1))
                .build();
            return Bucket.builder().addLimit(limit).build();
        }
        
        if (endpoint.contains("/financial/") || endpoint.contains("/reports/")) {
            // Endpoints financeiros: 200 requisições por hora
            Bandwidth limit = Bandwidth.builder()
                .capacity(200)
                .refillGreedy(200, Duration.ofHours(1))
                .build();
            return Bucket.builder().addLimit(limit).build();
        }
        
        // Limite padrão para endpoints sensíveis: 500 por hora
        Bandwidth limit = Bandwidth.builder()
            .capacity(500)
            .refillGreedy(500, Duration.ofHours(1))
            .build();
        return Bucket.builder().addLimit(limit).build();
    }

    private boolean isSensitiveEndpoint(String endpoint, String method) {
        return endpoint.contains("/auth/") ||
               endpoint.contains("/admin/") ||
               endpoint.contains("/financial/") ||
               endpoint.contains("/reports/") ||
               endpoint.contains("/users/") ||
               (method.equals("DELETE") && !endpoint.startsWith("/api/v1/public/")) ||
               endpoint.contains("/password");
    }

    private void handleRateLimitExceeded(HttpServletResponse response, String message, 
                                       String clientIp, String endpoint) throws IOException {
        
        // Log de segurança
        logger.warn("RATE_LIMIT_EXCEEDED ip={} endpoint={} message={}", clientIp, endpoint, message);
        
        // Configurar resposta HTTP 429
        response.setStatus(429);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Headers de rate limiting
        response.setHeader("X-RateLimit-Limit", "1000");
        response.setHeader("X-RateLimit-Remaining", "0");
        response.setHeader("X-RateLimit-Reset", String.valueOf(System.currentTimeMillis() + 3600000));
        response.setHeader("Retry-After", "3600");
        
        // Corpo da resposta
        String jsonResponse = String.format(
            "{\"error\":\"Rate limit exceeded\",\"message\":\"%s\",\"timestamp\":\"%s\"}",
            message, java.time.Instant.now().toString()
        );
        
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }

    private String getClientIpAddress(HttpServletRequest request) {
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
}