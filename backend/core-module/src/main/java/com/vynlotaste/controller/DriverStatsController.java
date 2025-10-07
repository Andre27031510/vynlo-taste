package com.vynlotaste.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
public class DriverStatsController {

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getDriverStats() {
        // Mock data - sistema de drivers não implementado ainda
        Map<String, Object> stats = Map.of(
            "active", 18,
            "total", 25,
            "available", 12,
            "busy", 6,
            "offline", 7
        );
        
        return ResponseEntity.ok(stats);
    }
}