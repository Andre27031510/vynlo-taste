package com.vynlotaste.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/v1/drivers")
@RequiredArgsConstructor
public class DriverStatsController {

    @GetMapping("/stats")
    @Cacheable(value = "driverStats", unless = "#result == null")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getDriverStats() {
        try {
            // Mock data - sistema de drivers não implementado ainda
            // TODO: Implementar consulta real quando módulo de drivers estiver pronto
            Map<String, Object> stats = Map.of(
                "active", 18,
                "total", 25,
                "available", 12,
                "busy", 6,
                "offline", 7
            );
            
            log.debug("Driver stats retrieved (mock data)");
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching driver stats", e);
            return ResponseEntity.ok(Map.of(
                "active", 0,
                "total", 0,
                "available", 0,
                "busy", 0,
                "offline", 0
            ));
        }
    }
}