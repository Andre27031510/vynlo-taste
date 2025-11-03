package com.vynlotaste.config;
// touch: redeploy note (commit 112b089, d96f8ca, ce2d2e6, 0cc13bc, 2fb4255) - comentário leve sem impacto funcional

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Fase 4 - Interceptor de Métricas para Rastrear 404 em Rotas Ekklesia
 * 
 * Objetivo: Detectar regressões de roteamento no Ekklesia
 * 
 * Métrica exposta: ekklesia.routing.404 (counter)
 * Tags:
 * - uri: Path da requisição (ex: /api/v1/ekklesia/members)
 * - method: Método HTTP (GET, POST, etc)
 * 
 * Prometheus query:
 * rate(ekklesia_routing_404_total{uri=~"/api/v1/ekklesia/.*"}[5m]) > 0
 * 
 * Alerta configurado: Se 404 > 0 em rotas Ekklesia = possível regressão de roteamento
 * 
 * Created: 2025-10-28
 * @author Vynlo Tech
 */
@Slf4j
@Component
public class EkklesiaMetricsInterceptor implements HandlerInterceptor {

    private final MeterRegistry meterRegistry;

    public EkklesiaMetricsInterceptor(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Interceptar apenas rotas Ekklesia
        String uri = request.getRequestURI();
        
        if (uri != null && uri.contains("/ekklesia/")) {
            log.debug("Ekklesia route intercepted: {} {}", request.getMethod(), uri);
            
            // Se handler não existe, significa que será 404
            if (handler == null || handler.toString().contains("ResourceHttpRequestHandler")) {
                log.warn("⚠️ 404 em rota Ekklesia: {} {}", request.getMethod(), uri);
                
                // Registrar métrica
                Counter.builder("ekklesia.routing.404")
                        .description("404 em rotas Ekklesia")
                        .tag("uri", uri)
                        .tag("method", request.getMethod())
                        .tag("category", "ekklesia")
                        .register(meterRegistry)
                        .increment();
            }
        }
        
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                                Object handler, Exception ex) {
        // Registrar métrica de 404 após resposta
        if (response.getStatus() == 404) {
            String uri = request.getRequestURI();
            
            if (uri != null && uri.contains("/ekklesia/")) {
                log.warn("⚠️ 404 confirmado em rota Ekklesia: {} {}", request.getMethod(), uri);
                
                Counter.builder("ekklesia.routing.404")
                        .description("404 em rotas Ekklesia")
                        .tag("uri", uri)
                        .tag("method", request.getMethod())
                        .tag("category", "ekklesia")
                        .register(meterRegistry)
                        .increment();
            }
        }
    }
}

