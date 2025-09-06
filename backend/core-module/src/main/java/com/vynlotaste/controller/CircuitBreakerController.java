package com.vynlotaste.controller;

import com.vynlotaste.service.CircuitBreakerMonitoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/circuit-breakers")
@RequiredArgsConstructor
@Tag(name = "Circuit Breaker Management", description = "Circuit breaker monitoring and management")
@ConditionalOnProperty(name = "management.endpoints.web.exposure.include", havingValue = "*")
public class CircuitBreakerController {

    private final CircuitBreakerMonitoringService monitoringService;

    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get circuit breaker status", description = "Returns current status of all circuit breakers")
    public ResponseEntity<Map<String, Object>> getCircuitBreakerStatus() {
        Map<String, Object> status = monitoringService.getCircuitBreakerStatus();
        return ResponseEntity.ok(status);
    }

    @PostMapping("/{name}/reset")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reset circuit breaker", description = "Manually reset a circuit breaker to closed state")
    public ResponseEntity<Void> resetCircuitBreaker(@PathVariable String name) {
        monitoringService.resetCircuitBreaker(name);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{name}/open")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Open circuit breaker", description = "Manually open a circuit breaker")
    public ResponseEntity<Void> openCircuitBreaker(@PathVariable String name) {
        monitoringService.transitionToOpenState(name);
        return ResponseEntity.ok().build();
    }
}