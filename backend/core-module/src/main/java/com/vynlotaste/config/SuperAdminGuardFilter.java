package com.vynlotaste.config;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.observability.TenantSecurityMetrics;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// PADRÃO BIG TECH: Filtro NÃO é @Component - será criado manualmente no SecurityConfig apenas se necessário
// Isso evita que o Spring tente registrá-lo automaticamente durante ServletContextInitializerBeans
// Métricas são opcionais via ObjectProvider.getIfAvailable()
public class SuperAdminGuardFilter extends OncePerRequestFilter {

    private final ObjectProvider<TenantSecurityMetrics> metricsProvider;
    private final Environment env;

    public SuperAdminGuardFilter(ObjectProvider<TenantSecurityMetrics> metricsProvider, Environment env) {
        this.metricsProvider = metricsProvider;
        this.env = env;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        boolean isWriteMethod = !HttpMethod.GET.matches(request.getMethod())
                && !HttpMethod.OPTIONS.matches(request.getMethod())
                && !HttpMethod.HEAD.matches(request.getMethod());

        String uri = request.getRequestURI();

        if (TenantContext.isSuperAdmin() && isWriteMethod && uri.startsWith("/api/v1/ekklesia/")) {
            String required = env.getProperty("security.superadmin.break_glass");
            String provided = request.getHeader("X-Break-Glass");

            // Requer cabeçalho secreto configurado via env; se não configurado, apenas auditar
            if (required != null && !required.isEmpty()) {
                if (provided == null || !provided.equals(required)) {
                    // PADRÃO BIG TECH: Métricas opcionais (modo degradado)
                    TenantSecurityMetrics metrics = metricsProvider.getIfAvailable();
                    if (metrics != null) {
                        metrics.incrementMismatch("superadmin_guard_missing", uri, request.getMethod());
                    }
                    response.setStatus(403);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Forbidden\",\"message\":\"Super Admin write requires X-Break-Glass\"}");
                    return;
                }
            }

            // Auditar usos válidos também
            TenantSecurityMetrics metrics = metricsProvider.getIfAvailable();
            if (metrics != null) {
                metrics.incrementMismatch("superadmin_guard_used", uri, request.getMethod());
            }
        }

        filterChain.doFilter(request, response);
    }
}


