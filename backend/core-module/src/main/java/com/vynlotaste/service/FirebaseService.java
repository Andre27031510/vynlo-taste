package com.vynlotaste.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class FirebaseService {

    private final FirebaseAuth firebaseAuth;

    @CircuitBreaker(name = "firebase", fallbackMethod = "verifyTokenFallback")
    @Retry(name = "firebase")
    @TimeLimiter(name = "firebase")
    @Bulkhead(name = "firebase")
    public CompletableFuture<FirebaseToken> verifyToken(String idToken) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.debug("Verifying Firebase token");
                FirebaseToken token = firebaseAuth.verifyIdToken(idToken);
                log.debug("Firebase token verified successfully for user: {}", token.getUid());
                return token;
            } catch (FirebaseAuthException e) {
                log.error("Firebase token verification failed", e);
                throw new RuntimeException("Token verification failed", e);
            }
        });
    }

    @CircuitBreaker(name = "firebase", fallbackMethod = "getUserFallback")
    @Retry(name = "firebase")
    @TimeLimiter(name = "firebase")
    @Bulkhead(name = "firebase")
    public CompletableFuture<UserRecord> getUser(String uid) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.debug("Getting Firebase user: {}", uid);
                UserRecord user = firebaseAuth.getUser(uid);
                log.debug("Firebase user retrieved successfully: {}", uid);
                return user;
            } catch (FirebaseAuthException e) {
                log.error("Failed to get Firebase user: {}", uid, e);
                throw new RuntimeException("Failed to get user", e);
            }
        });
    }

    @CircuitBreaker(name = "firebase", fallbackMethod = "createUserFallback")
    @Retry(name = "firebase")
    @TimeLimiter(name = "firebase")
    @Bulkhead(name = "firebase")
    public CompletableFuture<UserRecord> createUser(String email, String password) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("Creating Firebase user: {}", email);
                UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                        .setEmail(email)
                        .setPassword(password)
                        .setEmailVerified(false);
                
                UserRecord user = firebaseAuth.createUser(request);
                log.info("Firebase user created successfully: {}", user.getUid());
                return user;
            } catch (FirebaseAuthException e) {
                log.error("Failed to create Firebase user: {}", email, e);
                throw new RuntimeException("Failed to create user", e);
            }
        });
    }

    // Fallback methods
    public CompletableFuture<FirebaseToken> verifyTokenFallback(String idToken, Exception ex) {
        log.warn("Firebase token verification fallback triggered for token verification", ex);
        return CompletableFuture.failedFuture(
            new RuntimeException("Firebase service unavailable - token verification failed")
        );
    }

    public CompletableFuture<UserRecord> getUserFallback(String uid, Exception ex) {
        log.warn("Firebase get user fallback triggered for uid: {}", uid, ex);
        return CompletableFuture.failedFuture(
            new RuntimeException("Firebase service unavailable - user retrieval failed")
        );
    }

    public CompletableFuture<UserRecord> createUserFallback(String email, String password, Exception ex) {
        log.warn("Firebase create user fallback triggered for email: {}", email, ex);
        return CompletableFuture.failedFuture(
            new RuntimeException("Firebase service unavailable - user creation failed")
        );
    }

    public boolean isFirebaseAvailable() {
        try {
            // Simple health check
            firebaseAuth.listUsers(null, 1);
            return true;
        } catch (Exception e) {
            log.warn("Firebase health check failed", e);
            return false;
        }
    }
}