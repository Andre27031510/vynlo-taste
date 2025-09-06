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
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Autowired
    private SecurityAuditFilter securityAuditFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Desabilitar CSRF para APIs REST (usando JWT)
            .csrf(AbstractHttpConfigurer::disable)
            
            // Configurar CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configurar sessões como stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configurar headers de segurança
            .headers(headers -> headers
                .contentTypeOptions(contentTypeOptions -> contentTypeOptions.and())
                .frameOptions(frameOptions -> frameOptions.deny())
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubDomains(true)
                )
                .addHeaderWriter((request, response) -> {
                    response.setHeader("X-XSS-Protection", "1; mode=block");
                    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
                    response.setHeader("Content-Security-Policy", 
                        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none';");
                })
            )
            
            // Configurar autorização de endpoints
            .authorizeHttpRequests(authz -> authz
                // Endpoints públicos
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/favicon.ico").permitAll()
                
                // Endpoints administrativos - apenas ADMIN
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                
                // Endpoints de gestão - ADMIN ou MANAGER
                .requestMatchers(HttpMethod.POST, "/api/v1/users/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/v1/users/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/users/**").hasRole("ADMIN")
                
                // Endpoints financeiros - ADMIN ou MANAGER
                .requestMatchers("/api/v1/financial/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("/api/v1/reports/**").hasAnyRole("ADMIN", "MANAGER")
                
                // Endpoints de pedidos - ADMIN, MANAGER ou STAFF
                .requestMatchers(HttpMethod.GET, "/api/v1/orders/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.POST, "/api/v1/orders/**").hasAnyRole("ADMIN", "MANAGER", "STAFF", "CUSTOMER")
                .requestMatchers(HttpMethod.PUT, "/api/v1/orders/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                
                // Endpoints de produtos - leitura para todos autenticados, escrita para ADMIN/MANAGER
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/v1/products/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasRole("ADMIN")
                
                // Endpoints de clientes - acesso baseado em role
                .requestMatchers(HttpMethod.GET, "/api/v1/customers/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.POST, "/api/v1/customers/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                
                // Qualquer outra requisição requer autenticação
                .anyRequest().authenticated()
            )
            
            // Adicionar filtros customizados
            .addFilterBefore(securityAuditFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Configurar origens permitidas (restritivo para produção)
        configuration.setAllowedOriginPatterns(Arrays.asList(
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