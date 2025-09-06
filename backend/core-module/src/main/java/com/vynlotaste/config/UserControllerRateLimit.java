package com.vynlotaste.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class UserControllerRateLimit {
    
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    
    @Bean
    public Map<String, Bucket> userEndpointBuckets() {
        // Rate limits específicos por endpoint
        buckets.put("createUser", createBucket(10, Duration.ofMinutes(1))); // 10 criações por minuto
        buckets.put("updateUser", createBucket(30, Duration.ofMinutes(1))); // 30 atualizações por minuto
        buckets.put("deleteUser", createBucket(5, Duration.ofMinutes(1)));  // 5 exclusões por minuto
        buckets.put("searchUsers", createBucket(60, Duration.ofMinutes(1))); // 60 buscas por minuto
        buckets.put("getUsers", createBucket(100, Duration.ofMinutes(1)));   // 100 listagens por minuto
        
        return buckets;
    }
    
    private Bucket createBucket(long capacity, Duration refillPeriod) {
        Bandwidth limit = Bandwidth.simple(capacity, refillPeriod);
        return Bucket.builder()
            .addLimit(limit)
            .build();
    }
}