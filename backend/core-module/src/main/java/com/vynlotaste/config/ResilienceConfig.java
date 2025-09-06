package com.vynlotaste.config;

import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.retry.RetryRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class ResilienceConfig {

    @Bean
    public RetryRegistry retryRegistry() {
        return RetryRegistry.ofDefaults();
    }

    @Bean
    public Retry databaseRetry(RetryRegistry retryRegistry) {
        RetryConfig config = RetryConfig.custom()
            .maxAttempts(3)
            .waitDuration(Duration.ofMillis(1000))
            .build();
        return retryRegistry.retry("database", config);
    }

    @Bean
    public Retry firebaseRetry(RetryRegistry retryRegistry) {
        RetryConfig config = RetryConfig.custom()
            .maxAttempts(3)
            .waitDuration(Duration.ofMillis(500))
            .build();
        return retryRegistry.retry("firebase", config);
    }

    @Bean
    public Retry redisRetry(RetryRegistry retryRegistry) {
        RetryConfig config = RetryConfig.custom()
            .maxAttempts(2)
            .waitDuration(Duration.ofMillis(200))
            .build();
        return retryRegistry.retry("redis", config);
    }

    @Bean
    public Retry externalServiceRetry(RetryRegistry retryRegistry) {
        RetryConfig config = RetryConfig.custom()
            .maxAttempts(3)
            .waitDuration(Duration.ofMillis(2000))
            .build();
        return retryRegistry.retry("externalService", config);
    }
}