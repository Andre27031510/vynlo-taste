package com.vynlotaste.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.concurrent.TimeoutException;

@Slf4j
@Service
public class RetryableService {

    @Retryable(
        retryFor = {SQLException.class, TimeoutException.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public <T> T executeWithRetry(RetryableOperation<T> operation) throws Exception {
        log.debug("Executing operation with retry capability");
        return operation.execute();
    }

    @Recover
    public <T> T recover(Exception ex, RetryableOperation<T> operation) {
        log.error("All retry attempts failed for operation: {}", operation.getClass().getSimpleName(), ex);
        throw new RuntimeException("Operation failed after all retry attempts", ex);
    }

    @FunctionalInterface
    public interface RetryableOperation<T> {
        T execute() throws Exception;
    }
}