package com.vynlotaste.controller;

import com.vynlotaste.entity.Order;
import com.vynlotaste.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderStatsController {

    private final OrderRepository orderRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOrderStats() {
        long total = orderRepository.count();
        long pending = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long completed = orderRepository.countByStatus(Order.OrderStatus.DELIVERED);
        
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        BigDecimal todayRevenue = orderRepository.sumTotalAmountByCreatedAtAfter(today);
        
        Map<String, Object> stats = Map.of(
            "total", total,
            "pending", pending,
            "completed", completed,
            "revenue", todayRevenue != null ? todayRevenue : BigDecimal.ZERO,
            "averageOrderValue", total > 0 ? (todayRevenue != null ? todayRevenue.divide(BigDecimal.valueOf(total), 2, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO) : BigDecimal.ZERO
        );
        
        return ResponseEntity.ok(stats);
    }
}