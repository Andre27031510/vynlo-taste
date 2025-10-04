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
@Order(1)
public class ActuatorSecurityConfig {

    @Bean
    public SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/actuator/**")
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Health endpoint público para ALB
                .requestMatchers("/api/actuator/health").permitAll()
                .requestMatchers("/api/actuator/health/**").permitAll()
                
                // Endpoints sensíveis protegidos
                .requestMatchers("/api/actuator/info").hasRole("ADMIN")
                .requestMatchers("/api/actuator/metrics").hasRole("ADMIN")
                .requestMatchers("/api/actuator/metrics/**").hasRole("ADMIN")
                .requestMatchers("/api/actuator/prometheus").hasRole("ADMIN")
                
                // Bloquear endpoints perigosos
                .requestMatchers("/api/actuator/shutdown").denyAll()
                .requestMatchers("/api/actuator/env").denyAll()
                .requestMatchers("/api/actuator/configprops").denyAll()
                .requestMatchers("/api/actuator/beans").denyAll()
                .requestMatchers("/api/actuator/mappings").denyAll()
                .requestMatchers("/api/actuator/loggers").denyAll()
                .requestMatchers("/api/actuator/threaddump").denyAll()
                .requestMatchers("/api/actuator/heapdump").denyAll()
                
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
