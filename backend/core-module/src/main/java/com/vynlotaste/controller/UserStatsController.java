package com.vynlotaste.controller;

import com.vynlotaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserStatsController {

    private final UserRepository userRepository;

    @GetMapping("/stats")
    @Cacheable(value = "userStats", unless = "#result == null")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        try {
            long total = userRepository.count();
            long active = userRepository.countActiveUsers();
            
            LocalDateTime lastWeek = LocalDateTime.now().minusWeeks(1);
            long newUsers = userRepository.countByCreatedAtAfter(lastWeek);
            
            Map<String, Object> stats = Map.of(
                "total", total,
                "active", active,
                "newUsers", newUsers,
                "inactive", total - active
            );
            
            log.debug("User stats retrieved: total={}, active={}", total, active);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching user stats", e);
            // Retornar dados vazios em caso de erro
            return ResponseEntity.ok(Map.of(
                "total", 0,
                "active", 0,
                "newUsers", 0,
                "inactive", 0
            ));
        }
    }
}