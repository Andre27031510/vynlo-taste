package com.vynlotaste.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class RateLimitConfiguration {

    private final VynloProperties vynloProperties;
    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Bean
    public Bucket defaultBucket() {
        VynloProperties.RateLimit rateLimit = vynloProperties.getRateLimit();
        
        Bandwidth limit = Bandwidth.simple(
            rateLimit.getBurstCapacity(),
            Duration.ofMinutes(1)
        );
        
        log.info("Rate limit configured: {} requests/minute, burst: {}", 
            rateLimit.getRequestsPerMinute(), rateLimit.getBurstCapacity());
        
        return Bucket.builder()
            .addLimit(limit)
            .build();
    }

    public Bucket getBucketForUser(String userId) {
        return buckets.computeIfAbsent(userId, k -> {
            VynloProperties.RateLimit rateLimit = vynloProperties.getRateLimit();
            
            Bandwidth limit = Bandwidth.simple(
                rateLimit.getBurstCapacity(),
                Duration.ofMinutes(1)
            );
            
            return Bucket.builder()
                .addLimit(limit)
                .build();
        });
    }
}