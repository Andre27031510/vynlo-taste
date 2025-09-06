package com.vynlotaste.controller;

import com.vynlotaste.service.RetryHealthService;
import com.vynlotaste.service.RetryMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/retry")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class RetryController {

    private final RetryHealthService retryHealthService;
    private final RetryMetricsService retryMetricsService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getRetryHealth() {
        return ResponseEntity.ok(Map.of(
            "status", retryHealthService.health().getStatus().getCode(),
            "details", retryHealthService.health().getDetails()
        ));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getRetryMetrics() {
        return ResponseEntity.ok(retryHealthService.getDetailedRetryMetrics());
    }

    @GetMapping("/success-rates")
    public ResponseEntity<Map<String, Double>> getSuccessRates() {
        Map<String, Double> successRates = Map.of(
            "database", retryMetricsService.getRetrySuccessRate("database"),
            "firebase", retryMetricsService.getRetrySuccessRate("firebase"),
            "redis", retryMetricsService.getRetrySuccessRate("redis"),
            "externalService", retryMetricsService.getRetrySuccessRate("externalService")
        );
        return ResponseEntity.ok(successRates);
    }
}