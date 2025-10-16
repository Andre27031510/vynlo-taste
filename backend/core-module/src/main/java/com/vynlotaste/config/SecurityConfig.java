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
 * Modified: 2025-10-14 18:12 UTC - Cursor: explicit /api/actuator/** permitAll for ALB
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
                    // CSP gerenciado pelo Next.js no frontend - não definir aqui para evitar conflitos
                })
            )
            
            // Configurar autorização de endpoints
            .authorizeHttpRequests(authz -> authz
                // Permitir OPTIONS requests para CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Health endpoints para ALB (Cursor recommendation: explicit /api/actuator)
                .requestMatchers("/health").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/actuator/health/**").permitAll()
                // ✅ Garantir /api/actuator/** também (para ALB com context-path)
                .requestMatchers("/api/actuator/**").permitAll()
                .requestMatchers("/api/actuator/health").permitAll()
                .requestMatchers("/v1/auth/**").permitAll()
                .requestMatchers("/v1/public/**").permitAll()
                .requestMatchers("/v1/test/**").permitAll()
                .requestMatchers("/v1/users/sync-firebase").permitAll()
                .requestMatchers("/favicon.ico").permitAll()
                
                // Stats endpoints - acessíveis para usuários logados
                .requestMatchers("/v1/orders/stats").authenticated()
                .requestMatchers("/v1/users/stats").authenticated()
                .requestMatchers("/v1/drivers/stats").authenticated()
                .requestMatchers("/v1/products/stats").authenticated()
                
                // Endpoints administrativos - apenas ADMIN
                .requestMatchers("/v1/admin/**").hasRole("ADMIN")
                
                // Endpoints públicos de leitura (para catálogo, SEO, etc)
                .requestMatchers(HttpMethod.GET, "/v1/products").permitAll()
                .requestMatchers(HttpMethod.GET, "/v1/products/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/v1/products/search").permitAll()
                
                // Funcionalidades do sistema - qualquer usuário autenticado (sem verificação de role)
                .requestMatchers("/v1/users/**").authenticated()
                .requestMatchers("/v1/financial/**").authenticated()
                .requestMatchers("/v1/reports/**").authenticated()
                .requestMatchers("/v1/orders/**").authenticated()
                .requestMatchers("/v1/products/**").authenticated()
                .requestMatchers("/v1/customers/**").authenticated()
                .requestMatchers("/v1/drivers/**").authenticated()
                .requestMatchers("/v1/payments/**").authenticated()
                .requestMatchers("/v1/cashflow/**").authenticated()
                .requestMatchers("/v1/fiscal/**").authenticated()
                
                // Qualquer outra requisição requer autenticação
                .anyRequest().authenticated()
            )
            
            // Configurar tratamento de exceções de autenticação - RETORNAR 401 em vez de 403
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Authentication required\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(403);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Forbidden\",\"message\":\"Access denied\"}");
                })
            )
            
            // Filtros customizados
            // .addFilterBefore(securityAuditFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            // REMOVIDO: .anonymous(AbstractHttpConfigurer::disable) 
            // Esta configuração causava retorno de 403 em vez de 401 para requisições não autenticadas

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
            "X-Total-Count",
            "X-Request-ID"
        ));
        
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}