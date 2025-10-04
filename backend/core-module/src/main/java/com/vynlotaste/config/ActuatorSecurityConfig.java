package com.vynlotaste.config;

import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.actuate.info.InfoEndpoint;
import org.springframework.boot.actuate.metrics.MetricsEndpoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuração de segurança específica para Spring Boot Actuator
 * Implementa segurança enterprise para monitoramento em produção
 */
@Configuration
@EnableWebSecurity
@Order(1) // Prioridade alta para ser aplicado antes da configuração principal
public class ActuatorSecurityConfig {

    @Bean
    public SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher(EndpointRequest.toAnyEndpoint())
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authz -> authz
                // Endpoints públicos (health check com base-path customizado)
                .requestMatchers("/api/actuator/health", "/actuator/health").permitAll()
                .requestMatchers(EndpointRequest.to(HealthEndpoint.class)).permitAll()
                
                // Endpoints sensíveis - apenas ADMIN com autenticação
                .requestMatchers(EndpointRequest.toAnyEndpoint()).hasRole("ADMIN")
                
                // Bloquear endpoints perigosos em produção
                .requestMatchers(EndpointRequest.to("shutdown")).denyAll()
                .requestMatchers(EndpointRequest.to("env")).denyAll()
                .requestMatchers(EndpointRequest.to("configprops")).denyAll()
                .requestMatchers(EndpointRequest.to("beans")).denyAll()
                .requestMatchers(EndpointRequest.to("mappings")).denyAll()
                .requestMatchers(EndpointRequest.to("loggers")).denyAll()
                .requestMatchers(EndpointRequest.to("threaddump")).denyAll()
                .requestMatchers(EndpointRequest.to("heapdump")).denyAll()
                .requestMatchers(EndpointRequest.to("jfr")).denyAll()
                
                // Permitir apenas endpoints seguros para monitoramento
                .requestMatchers(EndpointRequest.to(InfoEndpoint.class)).hasRole("ADMIN")
                .requestMatchers(EndpointRequest.to(MetricsEndpoint.class)).hasRole("ADMIN")
                .requestMatchers(EndpointRequest.to("prometheus")).hasRole("ADMIN")
                
                .anyRequest().denyAll()
            )
            .httpBasic(basic -> basic.realmName("Vynlo Taste Actuator"))
            .headers(headers -> headers
                .contentTypeOptions(contentTypeOptions -> contentTypeOptions.and())
                .frameOptions(frameOptions -> frameOptions.deny())
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                )
            );

        return http.build();
    }
}
