package com.vynlotaste.controller;

import com.vynlotaste.config.VynloProperties;
import com.vynlotaste.service.CorsMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/cors")
@RequiredArgsConstructor
@ConditionalOnProperty(name = "vynlo.cors.logging-enabled", havingValue = "true")
public class CorsInfoController {

    private final VynloProperties vynloProperties;
    private final CorsMonitoringService corsMonitoringService;

    @GetMapping("/config")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCorsConfig() {
        Map<String, Object> config = new HashMap<>();
        VynloProperties.Cors cors = vynloProperties.getCors();
        
        config.put("allowedOrigins", cors.getAllowedOrigins());
        config.put("allowedMethods", cors.getAllowedMethods());
        config.put("allowedHeaders", cors.getAllowedHeaders());
        config.put("allowCredentials", cors.isAllowCredentials());
        config.put("maxAge", cors.getMaxAge());
        config.put("preflightMaxAge", cors.getPreflightMaxAge());
        config.put("rateLimitPerOrigin", cors.getRateLimitPerOrigin());
        config.put("strictOriginValidation", cors.isStrictOriginValidation());
        config.put("loggingEnabled", cors.isLoggingEnabled());
        
        return ResponseEntity.ok(config);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCorsStats(@RequestParam(required = false) String origin) {
        Map<String, Object> stats = new HashMap<>();
        
        if (origin != null) {
            stats.put("origin", origin);
            stats.put("requestCount", corsMonitoringService.getCorsRequestCount(origin));
            stats.put("blockedCount", corsMonitoringService.getCorsBlockedCount(origin));
        } else {
            stats.put("message", "Provide 'origin' parameter for specific statistics");
        }
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> testCors() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "CORS test endpoint");
        response.put("timestamp", java.time.Instant.now().toString());
        return ResponseEntity.ok(response);
    }
}