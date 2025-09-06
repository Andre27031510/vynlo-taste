package com.vynlotaste.service;

import io.github.resilience4j.retry.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisRetryService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final Retry redisRetry;
    private final RetryMetricsService retryMetricsService;

    public void setWithRetry(String key, Object value) {
        executeWithRetryVoid("set", () -> {
            ValueOperations<String, Object> ops = redisTemplate.opsForValue();
            ops.set(key, value);
        });
    }

    public void setWithRetry(String key, Object value, Duration timeout) {
        executeWithRetryVoid("setWithTimeout", () -> {
            ValueOperations<String, Object> ops = redisTemplate.opsForValue();
            ops.set(key, value, timeout.toMillis(), TimeUnit.MILLISECONDS);
        });
    }

    public <T> T getWithRetry(String key, Class<T> type) {
        return executeWithRetry("get", () -> {
            ValueOperations<String, Object> ops = redisTemplate.opsForValue();
            Object value = ops.get(key);
            return value != null ? type.cast(value) : null;
        });
    }

    public Boolean deleteWithRetry(String key) {
        return executeWithRetry("delete", () -> redisTemplate.delete(key));
    }

    public Boolean existsWithRetry(String key) {
        return executeWithRetry("exists", () -> redisTemplate.hasKey(key));
    }

    public Boolean expireWithRetry(String key, Duration timeout) {
        return executeWithRetry("expire", () -> 
            redisTemplate.expire(key, timeout.toMillis(), TimeUnit.MILLISECONDS));
    }

    public Set<String> keysWithRetry(String pattern) {
        return executeWithRetry("keys", () -> redisTemplate.keys(pattern));
    }

    public void incrementWithRetry(String key) {
        executeWithRetryVoid("increment", () -> {
            ValueOperations<String, Object> ops = redisTemplate.opsForValue();
            ops.increment(key);
        });
    }

    public Long incrementByWithRetry(String key, long delta) {
        return executeWithRetry("incrementBy", () -> {
            ValueOperations<String, Object> ops = redisTemplate.opsForValue();
            return ops.increment(key, delta);
        });
    }

    public void hashSetWithRetry(String key, String hashKey, Object value) {
        executeWithRetryVoid("hashSet", () -> 
            redisTemplate.opsForHash().put(key, hashKey, value));
    }

    public <T> T hashGetWithRetry(String key, String hashKey, Class<T> type) {
        return executeWithRetry("hashGet", () -> {
            Object value = redisTemplate.opsForHash().get(key, hashKey);
            return value != null ? type.cast(value) : null;
        });
    }

    public void listPushWithRetry(String key, Object value) {
        executeWithRetryVoid("listPush", () -> 
            redisTemplate.opsForList().rightPush(key, value));
    }

    public <T> T listPopWithRetry(String key, Class<T> type) {
        return executeWithRetry("listPop", () -> {
            Object value = redisTemplate.opsForList().leftPop(key);
            return value != null ? type.cast(value) : null;
        });
    }

    private <T> T executeWithRetry(String operationName, Supplier<T> operation) {
        long startTime = System.currentTimeMillis();
        final int[] attemptCount = {0};

        Supplier<T> decoratedSupplier = Retry.decorateSupplier(redisRetry, () -> {
            int currentAttempt = ++attemptCount[0];
            retryMetricsService.recordRetryAttempt("redis." + operationName, currentAttempt);
            
            log.debug("Executing Redis operation: {} (attempt {})", operationName, currentAttempt);
            
            try {
                T result = operation.get();
                if (currentAttempt > 1) {
                    long duration = System.currentTimeMillis() - startTime;
                    retryMetricsService.recordRetrySuccess("redis." + operationName, currentAttempt, duration);
                }
                return result;
            } catch (Exception e) {
                log.warn("Redis operation failed: {} (attempt {}): {}", 
                    operationName, currentAttempt, e.getMessage());
                
                if (currentAttempt >= redisRetry.getRetryConfig().getMaxAttempts()) {
                    retryMetricsService.recordRetryExhausted("redis." + operationName, e.getClass().getSimpleName());
                } else {
                    retryMetricsService.recordRetryFailure("redis." + operationName, e.getClass().getSimpleName(), currentAttempt);
                }
                throw e;
            }
        });

        try {
            return decoratedSupplier.get();
        } catch (Exception e) {
            log.error("Redis operation failed permanently: {} after {} attempts", operationName, attemptCount[0], e);
            // Para operações de cache, podemos retornar null em vez de falhar
            if (isReadOperation(operationName)) {
                log.warn("Returning null for failed Redis read operation: {}", operationName);
                return null;
            }
            throw new RedisRetryException("Redis operation failed after retries: " + operationName, e);
        }
    }

    private void executeWithRetryVoid(String operationName, Runnable operation) {
        executeWithRetry(operationName, () -> {
            operation.run();
            return null;
        });
    }

    private boolean isReadOperation(String operationName) {
        return operationName.equals("get") || 
               operationName.equals("exists") || 
               operationName.equals("keys") ||
               operationName.equals("hashGet") ||
               operationName.equals("listPop");
    }

    public static class RedisRetryException extends RuntimeException {
        public RedisRetryException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}