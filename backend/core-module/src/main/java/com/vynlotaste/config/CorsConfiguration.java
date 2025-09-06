package com.vynlotaste.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class CorsConfiguration {

    private final VynloProperties vynloProperties;
    private final ConcurrentHashMap<String, AtomicInteger> originRequestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> originLastReset = new ConcurrentHashMap<>();

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        VynloCorsConfiguration configuration = new VynloCorsConfiguration();
        VynloProperties.Cors corsProps = vynloProperties.getCors();
        
        // Configuração básica
        configuration.setAllowedOriginPatterns(corsProps.getAllowedOrigins());
        configuration.setAllowedMethods(corsProps.getAllowedMethods());
        configuration.setAllowedHeaders(corsProps.getAllowedHeaders());
        configuration.setAllowCredentials(corsProps.isAllowCredentials());
        configuration.setMaxAge(corsProps.getMaxAge());
        
        // Configurações avançadas
        configuration.setCorsProps(corsProps);
        configuration.setOriginValidator(this::validateOrigin);
        configuration.setRateLimiter(this::checkRateLimit);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        log.info("Advanced CORS configured - Origins: {}, Logging: {}, Rate Limit: {}/origin", 
            corsProps.getAllowedOrigins(), corsProps.isLoggingEnabled(), corsProps.getRateLimitPerOrigin());
        
        return source;
    }
    
    private boolean validateOrigin(String origin, HttpServletRequest request) {
        VynloProperties.Cors corsProps = vynloProperties.getCors();
        
        if (corsProps.isLoggingEnabled()) {
            log.debug("CORS request from origin: {} to endpoint: {}", origin, request.getRequestURI());
        }
        
        // Validação estrita em produção
        if (corsProps.isStrictOriginValidation()) {
            return corsProps.getAllowedOrigins().contains(origin);
        }
        
        // Validação com padrões para outros ambientes
        return corsProps.getAllowedOrigins().stream()
            .anyMatch(allowedOrigin -> {
                if (allowedOrigin.contains("*")) {
                    String pattern = allowedOrigin.replace("*", ".*");
                    return Pattern.matches(pattern, origin);
                }
                return allowedOrigin.equals(origin);
            });
    }
    
    private boolean checkRateLimit(String origin) {
        VynloProperties.Cors corsProps = vynloProperties.getCors();
        long currentTime = System.currentTimeMillis();
        long windowStart = currentTime - 60000; // 1 minuto
        
        // Reset contador se necessário
        Long lastReset = originLastReset.get(origin);
        if (lastReset == null || lastReset < windowStart) {
            originRequestCounts.put(origin, new AtomicInteger(0));
            originLastReset.put(origin, currentTime);
        }
        
        AtomicInteger count = originRequestCounts.computeIfAbsent(origin, k -> new AtomicInteger(0));
        int currentCount = count.incrementAndGet();
        
        boolean allowed = currentCount <= corsProps.getRateLimitPerOrigin();
        
        if (!allowed && corsProps.isLoggingEnabled()) {
            log.warn("CORS rate limit exceeded for origin: {} ({}{})", 
                origin, currentCount, corsProps.getRateLimitPerOrigin());
        }
        
        return allowed;
    }
    
    // Classe interna para CORS customizado
    private class VynloCorsConfiguration extends org.springframework.web.cors.CorsConfiguration {
        private VynloProperties.Cors corsProps;
        private OriginValidator originValidator;
        private RateLimiter rateLimiter;
        
        public void setCorsProps(VynloProperties.Cors corsProps) {
            this.corsProps = corsProps;
        }
        
        public void setOriginValidator(OriginValidator validator) {
            this.originValidator = validator;
        }
        
        public void setRateLimiter(RateLimiter limiter) {
            this.rateLimiter = limiter;
        }
        
        @Override
        public String checkOrigin(String requestOrigin) {
            if (requestOrigin == null) {
                return null;
            }
            
            // Rate limiting check
            if (rateLimiter != null && !rateLimiter.checkLimit(requestOrigin)) {
                if (corsProps.isLoggingEnabled()) {
                    log.warn("CORS request blocked due to rate limit: {}", requestOrigin);
                }
                return null;
            }
            
            // Origin validation
            if (originValidator != null) {
                HttpServletRequest request = getCurrentRequest();
                if (request != null && !originValidator.validate(requestOrigin, request)) {
                    if (corsProps.isLoggingEnabled()) {
                        log.warn("CORS request blocked - invalid origin: {}", requestOrigin);
                    }
                    return null;
                }
            }
            
            return super.checkOrigin(requestOrigin);
        }
        
        private HttpServletRequest getCurrentRequest() {
            try {
                return ((org.springframework.web.context.request.ServletRequestAttributes) 
                    org.springframework.web.context.request.RequestContextHolder.currentRequestAttributes())
                    .getRequest();
            } catch (Exception e) {
                return null;
            }
        }
    }
    
    @FunctionalInterface
    private interface OriginValidator {
        boolean validate(String origin, HttpServletRequest request);
    }
    
    @FunctionalInterface
    private interface RateLimiter {
        boolean checkLimit(String origin);
    }
}