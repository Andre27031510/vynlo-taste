package com.vynlotaste.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * ============================================================================
 * SWAGGER SECURITY CONFIG - DEVELOPMENT ONLY
 * ============================================================================
 * 
 * ATIVO APENAS EM DESENVOLVIMENTO (profile: dev)
 * 
 * OBJETIVO:
 * - Liberar Swagger/OpenAPI sem autenticação em DEV
 * - Facilitar testes e desenvolvimento
 * 
 * IMPORTANTE:
 * - Em PRODUÇÃO: Este config NÃO é carregado
 * - Em PRODUÇÃO: Swagger protegido (hasRole ADMIN) via SecurityConfig
 * 
 * SEGURANÇA:
 * - Profile: dev (não ativa em prod)
 * - Order: 0 (mais alta prioridade que outros configs)
 * - Apenas para /docs e /v3/api-docs
 * 
 * @version 1.0.0
 * @created 2025-10-20
 * ============================================================================
 */
@Configuration
@Profile("dev")  // ✅ CRÍTICO: Apenas em desenvolvimento
@Order(0)  // ✅ Prioridade máxima (antes de SecurityConfig)
public class SwaggerSecurityConfigDev {

    @Bean
    public SecurityFilterChain swaggerDevSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/docs/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authz -> authz
                .anyRequest().permitAll()  // ✅ DEV: Swagger público
            );

        return http.build();
    }
}



