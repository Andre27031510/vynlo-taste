package com.vynlotaste.monitoring;

import io.micrometer.tracing.Tracer;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class RequestTracingFilter extends OncePerRequestFilter {

    private final Tracer tracer;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String requestId = UUID.randomUUID().toString();
        String traceId = tracer.nextSpan().context().traceId();
        
        try {
            // Configurar MDC para correlação de logs
            MDC.put("requestId", requestId);
            MDC.put("traceId", traceId);
            MDC.put("method", request.getMethod());
            MDC.put("uri", request.getRequestURI());
            MDC.put("userAgent", request.getHeader("User-Agent"));
            
            // Adicionar headers de resposta
            response.setHeader("X-Request-ID", requestId);
            response.setHeader("X-Trace-ID", traceId);
            
            long startTime = System.currentTimeMillis();
            
            log.info("Request started - {} {}", request.getMethod(), request.getRequestURI());
            
            filterChain.doFilter(request, response);
            
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("Request completed - Status: {}, Duration: {}ms", 
                response.getStatus(), duration);
                
        } finally {
            MDC.clear();
        }
    }
}