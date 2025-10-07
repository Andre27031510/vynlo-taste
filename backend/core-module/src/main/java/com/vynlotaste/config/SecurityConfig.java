package com.vynlotaste.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuração de segurança robusta para produção
 * Implementa autenticação JWT + Firebase, autorização baseada em roles,
 * proteção contra ataques comuns e headers de segurança
 * Updated: 2025-01-04 - Fixed actuator health endpoint access
 * CRITICAL FIX: Allow public access to actuator endpoints
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    // @Autowired
    // private SecurityAuditFilter securityAuditFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Fixed: Allow public access to actuator health endpoints for ALB health checks
        http
            // Desabilitar CSRF para APIs REST (usando JWT)
            .csrf(AbstractHttpConfigurer::disable)
            
            // Configurar CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configurar sessões como stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configurar headers de segurança
            .headers(headers -> headers
                .contentTypeOptions(contentTypeOptions -> {})
                .frameOptions(frameOptions -> frameOptions.deny())
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                )
                .addHeaderWriter((request, response) -> {
                    response.setHeader("X-XSS-Protection", "1; mode=block");
                    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
                    response.setHeader("Content-Security-Policy", 
                        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https: https://api.vynlotech.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebase.googleapis.com https://firestore.googleapis.com wss: ws:; frame-ancestors 'none';");
                })
            )
            
            // Configurar autorização de endpoints
            .authorizeHttpRequests(authz -> authz
                // Health endpoints para ALB
                .requestMatchers("/health").permitAll()
                .requestMatchers("/api/health").permitAll()
                // Endpoints públicos - ACTUATOR PRIMEIRO
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/api/actuator/**").permitAll()
                .requestMatchers("/api/actuator/health").permitAll()
                .requestMatchers("/api/actuator/health/**").permitAll()
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/api/v1/test/**").permitAll()
                .requestMatchers("/v1/test/**").permitAll() // Adicionar sem /api
                .requestMatchers("/api/v1/users/sync-firebase").permitAll()
                .requestMatchers("/favicon.ico").permitAll()
                
                // Endpoints administrativos - apenas ADMIN
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                
                // Funcionalidades do sistema - qualquer usuário autenticado
                .requestMatchers("/api/v1/users/**").authenticated()
                .requestMatchers("/api/v1/financial/**").authenticated()
                .requestMatchers("/api/v1/reports/**").authenticated()
                .requestMatchers("/api/v1/orders/**").authenticated()
                .requestMatchers("/api/v1/products/**").authenticated()
                .requestMatchers("/api/v1/customers/**").authenticated()
                .requestMatchers("/api/v1/drivers/**").authenticated()
                
                // Qualquer outra requisição requer autenticação
                .anyRequest().authenticated()
            )
            
            // Filtros customizados
            // .addFilterBefore(securityAuditFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .anonymous(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Configurar origens permitidas (restritivo para produção)
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "https://vynlotech.com",
            "https://*.vynlotech.com",
            "https://vynlotaste.com",
            "https://*.vynlotaste.com",
            "http://localhost:3000", // Apenas para desenvolvimento
            "http://localhost:3001"  // Apenas para desenvolvimento
        ));
        
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // Headers permitidos
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Headers expostos
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "X-Total-Count"
        ));
        
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}