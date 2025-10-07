package com.vynlotaste.controller;

import com.vynlotaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserStatsController {

    private final UserRepository userRepository;

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getUserStats() {
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
        
        return ResponseEntity.ok(stats);
    }
}