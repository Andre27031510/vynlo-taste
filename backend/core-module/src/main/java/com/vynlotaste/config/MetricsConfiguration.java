package com.vynlotaste.config;

import com.vynlotaste.interceptor.MetricsInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class MetricsConfiguration implements WebMvcConfigurer {

    private final MetricsInterceptor metricsInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(metricsInterceptor)
            .addPathPatterns("/api/**")
            .excludePathPatterns(
                "/api/actuator/**",
                "/api/health/**",
                "/api/metrics/**"
            );
    }
}