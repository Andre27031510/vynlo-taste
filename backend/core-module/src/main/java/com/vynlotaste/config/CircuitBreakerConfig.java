package com.vynlotaste.config;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class CircuitBreakerConfig {

    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        return CircuitBreakerRegistry.ofDefaults();
    }

    @Bean
    public CircuitBreaker firebaseCircuitBreaker(CircuitBreakerRegistry registry) {
        io.github.resilience4j.circuitbreaker.CircuitBreakerConfig config = io.github.resilience4j.circuitbreaker.CircuitBreakerConfig.custom()
            .failureRateThreshold(50)
            .waitDurationInOpenState(Duration.ofMillis(30000))
            .slidingWindowSize(10)
            .minimumNumberOfCalls(5)
            .build();
        return registry.circuitBreaker("firebase", config);
    }

    @Bean
    public CircuitBreaker paymentCircuitBreaker(CircuitBreakerRegistry registry) {
        io.github.resilience4j.circuitbreaker.CircuitBreakerConfig config = io.github.resilience4j.circuitbreaker.CircuitBreakerConfig.custom()
            .failureRateThreshold(60)
            .waitDurationInOpenState(Duration.ofMillis(60000))
            .slidingWindowSize(20)
            .minimumNumberOfCalls(10)
            .build();
        return registry.circuitBreaker("payment", config);
    }

    @Bean
    public CircuitBreaker notificationCircuitBreaker(CircuitBreakerRegistry registry) {
        io.github.resilience4j.circuitbreaker.CircuitBreakerConfig config = io.github.resilience4j.circuitbreaker.CircuitBreakerConfig.custom()
            .failureRateThreshold(70)
            .waitDurationInOpenState(Duration.ofMillis(15000))
            .slidingWindowSize(5)
            .minimumNumberOfCalls(3)
            .build();
        return registry.circuitBreaker("notification", config);
    }
}