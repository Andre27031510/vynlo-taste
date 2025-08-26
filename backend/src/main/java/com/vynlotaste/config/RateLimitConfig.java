package com.vynlotaste.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração leve de Rate Limiting usando interceptors nativos do Spring
 * Sem dependências externas para máxima performance
 */
@Configuration
public class RateLimitConfig implements WebMvcConfigurer {

    @Bean
    public SimpleRateLimitInterceptor simpleRateLimitInterceptor() {
        return new SimpleRateLimitInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(simpleRateLimitInterceptor())
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/v1/auth/**", "/actuator/**");
    }
}

