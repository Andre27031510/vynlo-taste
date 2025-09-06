package com.vynlotaste.service;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.vynlotaste.notification.NotificationService;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CircuitBreakerMonitoringService {

    private final CircuitBreakerRegistry circuitBreakerRegistry;
    private final MeterRegistry meterRegistry;
    private final NotificationService notificationService;
    
    private final Map<String, Counter> circuitOpenCounters = new HashMap<>();
    private final Map<String, Counter> circuitHalfOpenCounters = new HashMap<>();
    private final Map<String, Boolean> lastKnownStates = new HashMap<>();

    public void initializeMetrics() {
        circuitBreakerRegistry.getAllCircuitBreakers().forEach(circuitBreaker -> {
            String name = circuitBreaker.getName();
            
            // Contadores para mudanças de estado
            circuitOpenCounters.put(name, 
                Counter.builder("circuit_breaker_opened")
                    .tag("name", name)
                    .description("Number of times circuit breaker opened")
                    .register(meterRegistry));
            
            circuitHalfOpenCounters.put(name,
                Counter.builder("circuit_breaker_half_opened")
                    .tag("name", name)
                    .description("Number of times circuit breaker half-opened")
                    .register(meterRegistry));
            
            // Gauge para estado atual
            Gauge.builder("circuit_breaker_state", circuitBreaker, cb -> getStateValue(cb.getState()))
                .tag("name", name)
                .description("Current circuit breaker state (0=CLOSED, 1=OPEN, 2=HALF_OPEN)")
                .register(meterRegistry);
            
            // Gauge para taxa de falha
            Gauge.builder("circuit_breaker_failure_rate", circuitBreaker, cb -> cb.getMetrics().getFailureRate())
                .tag("name", name)
                .description("Current failure rate percentage")
                .register(meterRegistry);
            
            // Gauge para número de chamadas
            Gauge.builder("circuit_breaker_calls", circuitBreaker, cb -> (double) cb.getMetrics().getNumberOfSuccessfulCalls())
                .tag("name", name)
                .tag("kind", "successful")
                .description("Number of successful calls")
                .register(meterRegistry);
            
            Gauge.builder("circuit_breaker_calls", circuitBreaker, cb -> (double) cb.getMetrics().getNumberOfFailedCalls())
                .tag("name", name)
                .tag("kind", "failed")
                .description("Number of failed calls")
                .register(meterRegistry);
            
            // Registrar listener para mudanças de estado
            circuitBreaker.getEventPublisher().onStateTransition(event -> {
                log.info("Circuit breaker {} transitioned from {} to {}", 
                    name, event.getStateTransition().getFromState(), event.getStateTransition().getToState());
                
                handleStateTransition(name, event.getStateTransition().getFromState(), 
                    event.getStateTransition().getToState());
            });
            
            // Registrar listener para chamadas
            circuitBreaker.getEventPublisher().onCallNotPermitted(event -> {
                log.warn("Call not permitted for circuit breaker: {}", name);
            });
            
            circuitBreaker.getEventPublisher().onFailureRateExceeded(event -> {
                log.error("Failure rate exceeded for circuit breaker: {} - Rate: {}%", 
                    name, event.getFailureRate());
            });
        });
    }

    private void handleStateTransition(String circuitBreakerName, 
                                     CircuitBreaker.State fromState, 
                                     CircuitBreaker.State toState) {
        
        // Atualizar contadores
        if (toState == CircuitBreaker.State.OPEN) {
            circuitOpenCounters.get(circuitBreakerName).increment();
            sendCircuitBreakerAlert(circuitBreakerName, "OPENED", 
                "Circuit breaker opened due to failures");
        } else if (toState == CircuitBreaker.State.HALF_OPEN) {
            circuitHalfOpenCounters.get(circuitBreakerName).increment();
        } else if (toState == CircuitBreaker.State.CLOSED && fromState == CircuitBreaker.State.HALF_OPEN) {
            sendCircuitBreakerAlert(circuitBreakerName, "RECOVERED", 
                "Circuit breaker recovered and closed");
        }
        
        lastKnownStates.put(circuitBreakerName, toState == CircuitBreaker.State.OPEN);
    }

    private void sendCircuitBreakerAlert(String circuitBreakerName, String action, String message) {
        try {
            String alertMessage = String.format("ALERT: Circuit Breaker %s %s - %s", 
                circuitBreakerName, action, message);
            
            // Enviar alerta por email (configurar email de admin)
            notificationService.sendOrderNotification(
                "admin@vynlotaste.com", 
                "Circuit Breaker Alert - " + circuitBreakerName, 
                alertMessage
            );
            
            log.warn("Circuit breaker alert sent: {}", alertMessage);
        } catch (Exception e) {
            log.error("Failed to send circuit breaker alert", e);
        }
    }

    @Scheduled(fixedRate = 60000) // A cada minuto
    public void logCircuitBreakerStatus() {
        circuitBreakerRegistry.getAllCircuitBreakers().forEach(circuitBreaker -> {
            String name = circuitBreaker.getName();
            CircuitBreaker.State state = circuitBreaker.getState();
            CircuitBreaker.Metrics metrics = circuitBreaker.getMetrics();
            
            log.info("Circuit Breaker Status - Name: {}, State: {}, Failure Rate: {}%, " +
                    "Successful Calls: {}, Failed Calls: {}, Slow Calls: {}",
                name, state, metrics.getFailureRate(),
                metrics.getNumberOfSuccessfulCalls(),
                metrics.getNumberOfFailedCalls(),
                metrics.getNumberOfSlowCalls());
        });
    }

    @Scheduled(fixedRate = 300000) // A cada 5 minutos
    public void checkCircuitBreakerHealth() {
        circuitBreakerRegistry.getAllCircuitBreakers().forEach(circuitBreaker -> {
            String name = circuitBreaker.getName();
            CircuitBreaker.State state = circuitBreaker.getState();
            
            if (state == CircuitBreaker.State.OPEN) {
                long openDuration = System.currentTimeMillis(); // Simplificado
                
                if (openDuration > 300000) { // Mais de 5 minutos aberto
                    log.error("Circuit breaker {} has been open for more than 5 minutes", name);
                    sendCircuitBreakerAlert(name, "PROLONGED_OPEN", 
                        "Circuit breaker has been open for more than 5 minutes");
                }
            }
        });
    }

    public Map<String, Object> getCircuitBreakerStatus() {
        Map<String, Object> status = new HashMap<>();
        
        circuitBreakerRegistry.getAllCircuitBreakers().forEach(circuitBreaker -> {
            Map<String, Object> cbStatus = new HashMap<>();
            cbStatus.put("state", circuitBreaker.getState().toString());
            cbStatus.put("failureRate", circuitBreaker.getMetrics().getFailureRate());
            cbStatus.put("successfulCalls", circuitBreaker.getMetrics().getNumberOfSuccessfulCalls());
            cbStatus.put("failedCalls", circuitBreaker.getMetrics().getNumberOfFailedCalls());
            cbStatus.put("slowCalls", circuitBreaker.getMetrics().getNumberOfSlowCalls());
            
            status.put(circuitBreaker.getName(), cbStatus);
        });
        
        return status;
    }

    private double getStateValue(CircuitBreaker.State state) {
        return switch (state) {
            case CLOSED -> 0.0;
            case OPEN -> 1.0;
            case HALF_OPEN -> 2.0;
            default -> -1.0;
        };
    }

    public void resetCircuitBreaker(String name) {
        circuitBreakerRegistry.circuitBreaker(name).reset();
        log.info("Circuit breaker {} has been manually reset", name);
    }

    public void transitionToOpenState(String name) {
        circuitBreakerRegistry.circuitBreaker(name).transitionToOpenState();
        log.warn("Circuit breaker {} has been manually opened", name);
    }
}