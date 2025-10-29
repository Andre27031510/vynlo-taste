package com.vynlotaste.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final EkklesiaMetricsInterceptor ekklesiaMetricsInterceptor;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Fase 4: Registrar interceptor de métricas Ekklesia
        registry.addInterceptor(ekklesiaMetricsInterceptor)
                .addPathPatterns("/api/v1/ekklesia/**");
    }
}