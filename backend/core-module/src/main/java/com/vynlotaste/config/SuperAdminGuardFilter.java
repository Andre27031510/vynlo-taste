package com.vynlotaste.config;

import com.vynlotaste.context.TenantContext;
import com.vynlotaste.observability.TenantSecurityMetrics;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SuperAdminGuardFilter extends OncePerRequestFilter {

    private final TenantSecurityMetrics metrics;
    private final Environment env;

    public SuperAdminGuardFilter(TenantSecurityMetrics metrics, Environment env) {
        this.metrics = metrics;
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
                    metrics.incrementMismatch("superadmin_guard_missing", uri, request.getMethod());
                    response.setStatus(403);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Forbidden\",\"message\":\"Super Admin write requires X-Break-Glass\"}");
                    return;
                }
            }

            // Auditar usos válidos também
            metrics.incrementMismatch("superadmin_guard_used", uri, request.getMethod());
        }

        filterChain.doFilter(request, response);
    }
}


