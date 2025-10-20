package com.vynlotaste.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuração de segurança específica para Spring Boot Actuator
 * Implementa segurança enterprise para monitoramento em produção
 * 
 * Updated: 2025-10-20 | Reforçado para produção 3M+ usuários
 * SEGURANÇA: Apenas /health público (ALB). Prometheus protegido (LGPD + OWASP)
 * IMPORTANTE: Para Prometheus scraping, configurar autenticação no Prometheus
 */
@Configuration
@EnableWebSecurity
@Order(1)
public class ActuatorSecurityConfig {

    @Bean
    public SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/actuator/**")
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(actuatorCorsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Permitir OPTIONS requests para CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/actuator/**").permitAll()
                
                // ✅ PÚBLICO: Apenas Health (para ALB health check)
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/actuator/health/**").permitAll()
                
                // 🔒 PROTEGIDOS: Todos os outros endpoints (SEGURANÇA)
                // LGPD Art. 46 + OWASP: Informações sensíveis apenas para admins
                .requestMatchers("/actuator/info").hasRole("ADMIN")
                .requestMatchers("/actuator/metrics").hasRole("ADMIN")
                .requestMatchers("/actuator/metrics/**").hasRole("ADMIN")
                .requestMatchers("/actuator/prometheus").hasRole("ADMIN")  // 🔒 SEGURO: Apenas admins
                
                // Bloquear endpoints perigosos
                .requestMatchers("/actuator/shutdown").denyAll()
                .requestMatchers("/actuator/env").denyAll()
                .requestMatchers("/actuator/configprops").denyAll()
                .requestMatchers("/actuator/beans").denyAll()
                .requestMatchers("/actuator/mappings").denyAll()
                .requestMatchers("/actuator/loggers").denyAll()
                .requestMatchers("/actuator/threaddump").denyAll()
                .requestMatchers("/actuator/heapdump").denyAll()
                
                .anyRequest().authenticated()
            )
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.getWriter().write("{\"error\":\"Unauthorized\"}");
                })
            )
            .headers(headers -> headers
                .contentTypeOptions(contentTypeOptions -> {})
                .frameOptions(frameOptions -> frameOptions.deny())
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                )
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource actuatorCorsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Configurar origens permitidas para Actuator
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "https://vynlotech.com",
            "https://*.vynlotech.com",
            "https://vynlotaste.com",
            "https://*.vynlotaste.com",
            "http://localhost:3000",
            "http://localhost:3001"
        ));
        
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // Headers permitidos (incluindo headers customizados do frontend)
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers",
            "X-Request-ID",
            "X-Client-Version"
        ));
        
        // Headers expostos (incluindo X-Request-ID para observabilidade)
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "X-Request-ID"
        ));
        
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/actuator/**", configuration);
        return source;
    }
}
