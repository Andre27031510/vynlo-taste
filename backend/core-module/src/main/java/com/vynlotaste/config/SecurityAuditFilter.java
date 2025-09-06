package com.vynlotaste.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Filtro de auditoria para logging de segurança
 * Registra todas as tentativas de acesso e operações sensíveis
 */
@Component
public class SecurityAuditFilter extends OncePerRequestFilter {

    private static final Logger auditLogger = LoggerFactory.getLogger("SECURITY_AUDIT");
    private static final Logger logger = LoggerFactory.getLogger(SecurityAuditFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String requestId = UUID.randomUUID().toString();
        String clientIp = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        String method = request.getMethod();
        String uri = request.getRequestURI();
        
        // Adicionar informações ao MDC para logging
        MDC.put("requestId", requestId);
        MDC.put("clientIp", clientIp);
        MDC.put("userAgent", userAgent);
        
        long startTime = System.currentTimeMillis();
        
        try {
            // Log da requisição de entrada
            logIncomingRequest(method, uri, clientIp, userAgent, requestId);
            
            filterChain.doFilter(request, response);
            
            // Log da resposta
            long duration = System.currentTimeMillis() - startTime;
            logResponse(method, uri, response.getStatus(), duration, requestId);
            
            // Log de auditoria para operações sensíveis
            if (isSensitiveOperation(method, uri)) {
                logSensitiveOperation(method, uri, clientIp, requestId);
            }
            
        } catch (Exception e) {
            logger.error("Erro no filtro de auditoria: {}", e.getMessage());
            auditLogger.error("SECURITY_ERROR requestId={} method={} uri={} ip={} error={}", 
                             requestId, method, uri, clientIp, e.getMessage());
        } finally {
            MDC.clear();
        }
    }

    private void logIncomingRequest(String method, String uri, String clientIp, 
                                  String userAgent, String requestId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth != null ? auth.getName() : "anonymous";
        
        auditLogger.info("REQUEST_IN requestId={} method={} uri={} ip={} user={} userAgent={}", 
                        requestId, method, uri, clientIp, userId, userAgent);
    }

    private void logResponse(String method, String uri, int status, long duration, String requestId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth != null ? auth.getName() : "anonymous";
        
        auditLogger.info("REQUEST_OUT requestId={} method={} uri={} status={} duration={}ms user={}", 
                        requestId, method, uri, status, duration, userId);
    }

    private void logSensitiveOperation(String method, String uri, String clientIp, String requestId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth != null ? auth.getName() : "anonymous";
        String authorities = auth != null ? auth.getAuthorities().toString() : "none";
        
        auditLogger.warn("SENSITIVE_OPERATION requestId={} method={} uri={} ip={} user={} authorities={} timestamp={}", 
                        requestId, method, uri, clientIp, userId, authorities, LocalDateTime.now());
    }

    private boolean isSensitiveOperation(String method, String uri) {
        // Operações consideradas sensíveis para auditoria
        return uri.startsWith("/api/v1/admin/") ||
               uri.startsWith("/api/v1/users/") ||
               uri.startsWith("/api/v1/financial/") ||
               uri.startsWith("/api/v1/reports/") ||
               (method.equals("DELETE") && !uri.startsWith("/api/v1/public/")) ||
               (method.equals("POST") && uri.contains("/auth/")) ||
               uri.contains("/password") ||
               uri.contains("/role") ||
               uri.contains("/permission");
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