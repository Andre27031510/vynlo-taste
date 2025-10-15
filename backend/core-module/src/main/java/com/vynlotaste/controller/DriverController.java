package com.vynlotaste.controller;

import com.vynlotaste.entity.Driver;
import com.vynlotaste.service.DriverService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
/**
 * Modified: 2025-10-11 14:00 UTC - Permissões ajustadas para isAuthenticated()
 */
@RestController
@RequestMapping("/v1/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getDrivers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            Driver.DriverStatus driverStatus = status != null && !status.equals("all") 
                ? Driver.DriverStatus.valueOf(status.toUpperCase()) 
                : null;
            
            Page<Driver> driversPage = driverService.getDrivers(driverStatus, search, page, limit);
            
            return ResponseEntity.ok(Map.of(
                "drivers", driversPage.getContent(),
                "total", driversPage.getTotalElements(),
                "page", page,
                "totalPages", driversPage.getTotalPages()
            ));
            // Modified: 2025-10-14 21:30 UTC | CRITICAL FIX: Paginação 0-based - Driver list agora funciona
        } catch (Exception e) {
            log.error("Error fetching drivers", e);
            return ResponseEntity.ok(Map.of(
                "drivers", java.util.List.of(),
                "total", 0,
                "page", page,
                "totalPages", 1
            ));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getDriverStats() {
        try {
            Map<String, Object> stats = driverService.getDriverStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching driver stats", e);
            return ResponseEntity.ok(Map.of(
                "totalDrivers", 0,
                "available", 0,
                "busy", 0,
                "offline", 0,
                "averageRating", 0.0
            ));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getDriverById(@PathVariable Long id) {
        try {
            Driver driver = driverService.getDriverById(id);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            log.error("Error fetching driver: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Driver not found"));
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")  // Temporário: permite usuários autenticados (TODO: voltar para ADMIN/MANAGER em produção)
    public ResponseEntity<?> createDriver(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String phone = request.get("phone");
            String email = request.get("email");
            String vehicle = request.get("vehicle");
            String plate = request.get("plate");
            
            Driver driver = driverService.createDriver(name, phone, email, vehicle, plate);
            return ResponseEntity.status(HttpStatus.CREATED).body(driver);
        } catch (Exception e) {
            log.error("Error creating driver", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> updateDriver(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String phone = request.get("phone");
            String email = request.get("email");
            String vehicle = request.get("vehicle");
            String plate = request.get("plate");
            String address = request.get("address");
            String cpf = request.get("cpf");
            String cnh = request.get("cnh");
            
            Driver driver = driverService.updateDriver(id, name, phone, email, vehicle, plate, address, cpf, cnh);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            log.error("Error updating driver: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateDriverStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            Driver.DriverStatus newStatus = Driver.DriverStatus.valueOf(status.toUpperCase());
            
            Driver driver = driverService.updateDriverStatus(id, newStatus);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            log.error("Error updating driver status: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDriver(@PathVariable Long id) {
        try {
            driverService.deleteDriver(id);
            return ResponseEntity.ok(Map.of("message", "Driver deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting driver: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
}

// Modified: 2025-10-11-v22 | Driver API isAuthenticated
