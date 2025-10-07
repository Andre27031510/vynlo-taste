package com.vynlotaste.controller;

import com.vynlotaste.dto.order.OrderRequestDto;
import com.vynlotaste.dto.order.OrderResponseDto;
import com.vynlotaste.entity.Order;
import com.vynlotaste.mapper.OrderMapper;
import com.vynlotaste.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponseDto> createOrder(@Valid @RequestBody OrderRequestDto orderRequest) {
        Order order = orderService.createOrder(orderRequest);
        OrderResponseDto response = orderMapper.toResponseDto(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(request.getStatus());
        Order order = orderService.updateOrderStatus(id, status);
        OrderResponseDto response = orderMapper.toResponseDto(order);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        try {
            List<Order> orders = orderService.getAllOrders(page, limit, status, search);
            List<OrderResponseDto> response = orders.stream()
                .map(orderMapper::toResponseDto)
                .toList();
            
            return ResponseEntity.ok(java.util.Map.of(
                "orders", response,
                "total", orders.size(),
                "page", page,
                "totalPages", 1
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of(
                "orders", java.util.List.of(),
                "total", 0,
                "page", page,
                "totalPages", 1
            ));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getOrdersStats() {
        try {
            return ResponseEntity.ok(java.util.Map.of(
                "totalOrders", 0,
                "pendingOrders", 0,
                "completedOrders", 0,
                "revenue", 0.0,
                "averageOrderValue", 0.0
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of(
                "totalOrders", 0,
                "pendingOrders", 0,
                "completedOrders", 0
            ));
        }
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrderResponseDto> patchOrderStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        try {
            Order.OrderStatus status = Order.OrderStatus.valueOf(request.getStatus().toUpperCase());
            Order order = orderService.updateOrderStatus(id, status);
            OrderResponseDto response = orderMapper.toResponseDto(order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(new OrderResponseDto());
        }
    }

    @GetMapping("/my-orders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrderResponseDto>> getUserOrders(@RequestParam Long userId) {
        List<Order> orders = orderService.getOrdersByUser(userId);
        List<OrderResponseDto> response = orders.stream()
            .map(orderMapper::toResponseDto)
            .toList();
        return ResponseEntity.ok(response);
    }

    public static class StatusUpdateRequest {
        private String status;
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}