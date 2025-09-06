package com.vynlotaste.health;

import com.vynlotaste.service.FirebaseService;
import com.vynlotaste.notification.NotificationService;
import com.vynlotaste.service.PaymentService;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component("externalServices")
@RequiredArgsConstructor
public class ExternalServicesHealthIndicator implements HealthIndicator {

    private final FirebaseService firebaseService;
    private final PaymentService paymentService;
    private final NotificationService notificationService;
    private final CircuitBreakerRegistry circuitBreakerRegistry;

    @Override
    public Health health() {
        Map<String, Object> details = new HashMap<>();
        boolean allHealthy = true;

        boolean firebaseHealthy = checkFirebaseHealth();
        details.put("firebase", createServiceStatus(firebaseHealthy, "firebase"));
        allHealthy &= firebaseHealthy;

        boolean paymentHealthy = checkPaymentHealth();
        details.put("payment", createServiceStatus(paymentHealthy, "payment"));
        allHealthy &= paymentHealthy;

        boolean notificationHealthy = checkNotificationHealth();
        details.put("notification", createServiceStatus(notificationHealthy, "notification"));
        allHealthy &= notificationHealthy;

        Map<String, Object> circuitBreakerStatus = checkCircuitBreakers();
        details.put("circuitBreakers", circuitBreakerStatus);

        if (allHealthy) {
            return Health.up().withDetails(details).build();
        } else {
            return Health.down().withDetails(details).build();
        }
    }

    private boolean checkFirebaseHealth() {
        try {
            return firebaseService.isFirebaseAvailable();
        } catch (Exception e) {
            log.warn("Firebase health check failed", e);
            return false;
        }
    }

    private boolean checkPaymentHealth() {
        try {
            return paymentService.isPaymentGatewayAvailable();
        } catch (Exception e) {
            log.warn("Payment gateway health check failed", e);
            return false;
        }
    }

    private boolean checkNotificationHealth() {
        try {
            return notificationService.isNotificationServiceAvailable();
        } catch (Exception e) {
            log.warn("Notification service health check failed", e);
            return false;
        }
    }

    private Map<String, Object> checkCircuitBreakers() {
        Map<String, Object> cbStatus = new HashMap<>();

        circuitBreakerRegistry.getAllCircuitBreakers().forEach(circuitBreaker -> {
            String name = circuitBreaker.getName();
            CircuitBreaker.State state = circuitBreaker.getState();
            CircuitBreaker.Metrics metrics = circuitBreaker.getMetrics();

            Map<String, Object> status = new HashMap<>();
            status.put("state", state.toString());
            status.put("healthy", state == CircuitBreaker.State.CLOSED);
            status.put("failureRate", metrics.getFailureRate());
            status.put("successfulCalls", metrics.getNumberOfSuccessfulCalls());
            status.put("failedCalls", metrics.getNumberOfFailedCalls());

            cbStatus.put(name, status);
        });

        return cbStatus;
    }

    private Map<String, Object> createServiceStatus(boolean healthy, String circuitBreakerName) {
        Map<String, Object> status = new HashMap<>();
        status.put("healthy", healthy);
        status.put("status", healthy ? "UP" : "DOWN");

        try {
            CircuitBreaker cb = circuitBreakerRegistry.circuitBreaker(circuitBreakerName);
            status.put("circuitBreakerState", cb.getState().toString());
            status.put("failureRate", cb.getMetrics().getFailureRate());
        } catch (Exception e) {
            log.debug("Circuit breaker {} not found", circuitBreakerName);
        }

        return status;
    }
}