package com.vynlotaste.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import io.github.resilience4j.retry.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.function.Supplier;

@Slf4j
@Service
@RequiredArgsConstructor
public class FirebaseRetryService {

    private final Retry firebaseRetry;
    private final RetryMetricsService retryMetricsService;

    public UserRecord getUserWithRetry(String uid) {
        return executeWithRetry("getUser", () -> {
            try {
                return FirebaseAuth.getInstance().getUser(uid);
            } catch (FirebaseAuthException e) {
                throw new RuntimeException("Firebase Auth error: " + e.getMessage(), e);
            }
        });
    }

    public UserRecord createUserWithRetry(UserRecord.CreateRequest request) {
        return executeWithRetry("createUser", () -> {
            try {
                return FirebaseAuth.getInstance().createUser(request);
            } catch (FirebaseAuthException e) {
                // Não fazer retry para erros de validação
                if (e.getErrorCode().name().equals("INVALID_ARGUMENT") || 
                    e.getErrorCode().name().equals("EMAIL_ALREADY_EXISTS")) {
                    throw new IllegalArgumentException("Invalid user data: " + e.getMessage(), e);
                }
                throw new RuntimeException("Firebase Auth error: " + e.getMessage(), e);
            }
        });
    }

    public UserRecord updateUserWithRetry(UserRecord.UpdateRequest request) {
        return executeWithRetry("updateUser", () -> {
            try {
                return FirebaseAuth.getInstance().updateUser(request);
            } catch (FirebaseAuthException e) {
                if (e.getErrorCode().name().equals("USER_NOT_FOUND")) {
                    throw new IllegalArgumentException("User not found: " + e.getMessage(), e);
                }
                throw new RuntimeException("Firebase Auth error: " + e.getMessage(), e);
            }
        });
    }

    public void deleteUserWithRetry(String uid) {
        executeWithRetryVoid("deleteUser", () -> {
            try {
                FirebaseAuth.getInstance().deleteUser(uid);
            } catch (FirebaseAuthException e) {
                if (e.getErrorCode().name().equals("USER_NOT_FOUND")) {
                    log.warn("Attempted to delete non-existent user: {}", uid);
                    return; // Não é erro se usuário não existe
                }
                throw new RuntimeException("Firebase Auth error: " + e.getMessage(), e);
            }
        });
    }

    public String verifyTokenWithRetry(String idToken) {
        return executeWithRetry("verifyToken", () -> {
            try {
                return FirebaseAuth.getInstance().verifyIdToken(idToken).getUid();
            } catch (FirebaseAuthException e) {
                if (e.getErrorCode().name().equals("INVALID_ARGUMENT") || 
                    e.getErrorCode().name().equals("EXPIRED_ID_TOKEN")) {
                    throw new SecurityException("Invalid token: " + e.getMessage(), e);
                }
                throw new RuntimeException("Firebase Auth error: " + e.getMessage(), e);
            }
        });
    }

    private <T> T executeWithRetry(String operationName, Supplier<T> operation) {
        long startTime = System.currentTimeMillis();
        final int[] attemptCount = {0};

        Supplier<T> decoratedSupplier = Retry.decorateSupplier(firebaseRetry, () -> {
            int currentAttempt = ++attemptCount[0];
            retryMetricsService.recordRetryAttempt("firebase." + operationName, currentAttempt);
            
            log.debug("Executing Firebase operation: {} (attempt {})", operationName, currentAttempt);
            
            try {
                T result = operation.get();
                if (currentAttempt > 1) {
                    long duration = System.currentTimeMillis() - startTime;
                    retryMetricsService.recordRetrySuccess("firebase." + operationName, currentAttempt, duration);
                }
                return result;
            } catch (Exception e) {
                log.warn("Firebase operation failed: {} (attempt {}): {}", 
                    operationName, currentAttempt, e.getMessage());
                
                if (currentAttempt >= firebaseRetry.getRetryConfig().getMaxAttempts()) {
                    retryMetricsService.recordRetryExhausted("firebase." + operationName, e.getClass().getSimpleName());
                } else {
                    retryMetricsService.recordRetryFailure("firebase." + operationName, e.getClass().getSimpleName(), currentAttempt);
                }
                throw e;
            }
        });

        try {
            return decoratedSupplier.get();
        } catch (Exception e) {
            log.error("Firebase operation failed permanently: {} after {} attempts", operationName, attemptCount[0], e);
            throw new FirebaseRetryException("Firebase operation failed after retries: " + operationName, e);
        }
    }

    private void executeWithRetryVoid(String operationName, Runnable operation) {
        executeWithRetry(operationName, () -> {
            operation.run();
            return null;
        });
    }

    public static class FirebaseRetryException extends RuntimeException {
        public FirebaseRetryException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}