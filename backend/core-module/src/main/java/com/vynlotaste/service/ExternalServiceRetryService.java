package com.vynlotaste.service;

import io.github.resilience4j.retry.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.function.Supplier;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExternalServiceRetryService {

    private final Retry externalServiceRetry;
    private final RetryMetricsService retryMetricsService;
    private final RestTemplate restTemplate;

    public <T> T executeHttpCallWithRetry(String serviceName, String operationName, Supplier<T> httpCall) {
        return executeWithRetry(serviceName + "." + operationName, httpCall);
    }

    public void executeHttpCallWithRetryVoid(String serviceName, String operationName, Runnable httpCall) {
        executeWithRetryVoid(serviceName + "." + operationName, httpCall);
    }

    // Métodos específicos para diferentes serviços externos

    public <T> T executePaymentServiceCall(String operationName, Supplier<T> paymentCall) {
        return executeWithRetry("payment." + operationName, paymentCall);
    }

    public <T> T executeTwilioCall(String operationName, Supplier<T> twilioCall) {
        return executeWithRetry("twilio." + operationName, twilioCall);
    }

    public <T> T executeStripeCall(String operationName, Supplier<T> stripeCall) {
        return executeWithRetry("stripe." + operationName, stripeCall);
    }

    public <T> T executeEmailServiceCall(String operationName, Supplier<T> emailCall) {
        return executeWithRetry("email." + operationName, emailCall);
    }

    private <T> T executeWithRetry(String operationName, Supplier<T> operation) {
        long startTime = System.currentTimeMillis();
        final int[] attemptCount = {0};

        Supplier<T> decoratedSupplier = Retry.decorateSupplier(externalServiceRetry, () -> {
            int currentAttempt = ++attemptCount[0];
            retryMetricsService.recordRetryAttempt("external." + operationName, currentAttempt);
            
            log.debug("Executing external service operation: {} (attempt {})", operationName, currentAttempt);
            
            try {
                T result = operation.get();
                if (currentAttempt > 1) {
                    long duration = System.currentTimeMillis() - startTime;
                    retryMetricsService.recordRetrySuccess("external." + operationName, currentAttempt, duration);
                }
                return result;
            } catch (HttpClientErrorException e) {
                // Não fazer retry para erros 4xx (exceto alguns específicos)
                if (shouldRetryClientError(HttpStatus.valueOf(e.getStatusCode().value()))) {
                    log.warn("External service client error (retryable): {} (attempt {}): {}", 
                        operationName, currentAttempt, e.getMessage());
                    throw new RuntimeException("Retryable client error", e);
                } else {
                    log.error("External service client error (non-retryable): {} (attempt {}): {}", 
                        operationName, currentAttempt, e.getMessage());
                    throw new IllegalArgumentException("Non-retryable client error: " + e.getMessage(), e);
                }
            } catch (HttpServerErrorException e) {
                log.warn("External service server error: {} (attempt {}): {}", 
                    operationName, currentAttempt, e.getMessage());
                throw new RuntimeException("Server error", e);
            } catch (Exception e) {
                log.warn("External service operation failed: {} (attempt {}): {}", 
                    operationName, currentAttempt, e.getMessage());
                
                if (currentAttempt >= externalServiceRetry.getRetryConfig().getMaxAttempts()) {
                    retryMetricsService.recordRetryExhausted("external." + operationName, e.getClass().getSimpleName());
                } else {
                    retryMetricsService.recordRetryFailure("external." + operationName, e.getClass().getSimpleName(), currentAttempt);
                }
                throw e;
            }
        });

        try {
            return decoratedSupplier.get();
        } catch (Exception e) {
            log.error("External service operation failed permanently: {} after {} attempts", operationName, attemptCount[0], e);
            throw new ExternalServiceRetryException("External service operation failed after retries: " + operationName, e);
        }
    }

    private void executeWithRetryVoid(String operationName, Runnable operation) {
        executeWithRetry(operationName, () -> {
            operation.run();
            return null;
        });
    }

    private boolean shouldRetryClientError(HttpStatus status) {
        // Retry apenas para alguns erros 4xx específicos
        return status == HttpStatus.TOO_MANY_REQUESTS || // 429
               status == HttpStatus.REQUEST_TIMEOUT;      // 408
    }

    // Métodos de conveniência para operações comuns

    public <T> T getWithRetry(String serviceName, String url, Class<T> responseType) {
        return executeHttpCallWithRetry(serviceName, "get", () -> 
            restTemplate.getForObject(url, responseType));
    }

    public <T> T postWithRetry(String serviceName, String url, Object request, Class<T> responseType) {
        return executeHttpCallWithRetry(serviceName, "post", () -> 
            restTemplate.postForObject(url, request, responseType));
    }

    public void putWithRetry(String serviceName, String url, Object request) {
        executeHttpCallWithRetryVoid(serviceName, "put", () -> 
            restTemplate.put(url, request));
    }

    public void deleteWithRetry(String serviceName, String url) {
        executeHttpCallWithRetryVoid(serviceName, "delete", () -> 
            restTemplate.delete(url));
    }

    public static class ExternalServiceRetryException extends RuntimeException {
        public ExternalServiceRetryException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}