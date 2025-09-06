package com.vynlotaste.config;

import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.retry.RetryRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.TransientDataAccessException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.retry.annotation.EnableRetry;

import java.time.Duration;
import java.util.concurrent.TimeoutException;

@Slf4j
@Configuration
@EnableRetry
public class RetryConfiguration {

    @Bean
    public RetryRegistry retryRegistry() {
        return RetryRegistry.ofDefaults();
    }

    @Bean
    public Retry databaseRetry() {
        RetryConfig config = RetryConfig.custom()
            .maxAttempts(3)
            .waitDuration(Duration.ofMillis(500))
            .intervalFunction(attempt -> (long) (500 * Math.pow(2, attempt - 1) + Math.random() * 100))
            .retryOnException(throwable -> 
                throwable instanceof TransientDataAccessException ||
                throwable instanceof DataAccessException ||
                throwable instanceof TimeoutException)
            .ignoreExceptions(IllegalArgumentException.class, IllegalStateException.class)
            .build();

        Retry retry = Retry.of("database", config);
        retry.getEventPublisher().onRetry(event -> 
            log.warn("Database retry attempt {} for operation: {}", 
                event.getNumberOfRetryAttempts(), event.getName()));
        
        return retry;
    }

    @Bean
    public Retry firebaseRetry() {
        RetryConfig config = RetryConfig.custom()
            .maxAttempts(4)
            .waitDuration(Duration.ofMillis(1000))
            .intervalFunction(attempt -> (long) (1000 * Math.pow(1.5, attempt - 1) + Math.random() * 200))
            .retryOnException(throwable -> 
                throwable instanceof RuntimeException &&
                !throwable.getMessage().contains("invalid") &&
                !throwable.getMessage().contains("unauthorized"))
            .build();

        Retry retry = Retry.of("firebase", config);
        retry.getEventPublisher().onRetry(event -> 
            log.warn("Firebase retry attempt {} for operation: {}", 
                event.getNumberOfRetryAttempts(), event.getName()));
        
        return retry;
    }

    @Bean
    public Retry redisRetry() {
        RetryConfig config = RetryConfig.custom()
            .maxAttempts(3)
            .waitDuration(Duration.ofMillis(200))
            .intervalFunction(attempt -> (long) (200 * Math.pow(2, attempt - 1) + Math.random() * 50))
            .retryOnException(throwable -> 
                throwable instanceof RedisConnectionFailureException ||
                throwable instanceof TimeoutException)
            .build();

        Retry retry = Retry.of("redis", config);
        retry.getEventPublisher().onRetry(event -> 
            log.warn("Redis retry attempt {} for operation: {}", 
                event.getNumberOfRetryAttempts(), event.getName()));
        
        return retry;
    }

    @Bean
    public Retry externalServiceRetry() {
        RetryConfig config = RetryConfig.custom()
            .maxAttempts(5)
            .waitDuration(Duration.ofMillis(2000))
            .intervalFunction(attempt -> (long) (2000 * Math.pow(1.8, attempt - 1) + Math.random() * 500))
            .retryOnException(throwable -> 
                throwable instanceof RuntimeException ||
                throwable instanceof TimeoutException)
            .ignoreExceptions(IllegalArgumentException.class, SecurityException.class)
            .build();

        Retry retry = Retry.of("externalService", config);
        retry.getEventPublisher().onRetry(event -> 
            log.warn("External service retry attempt {} for operation: {}", 
                event.getNumberOfRetryAttempts(), event.getName()));
        
        return retry;
    }
}