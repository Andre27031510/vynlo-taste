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
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF', 'USER')")
    public ResponseEntity<OrderResponseDto> createOrder(@Valid @RequestBody OrderRequestDto orderRequest) {
        Order order = orderService.createOrder(orderRequest);
        OrderResponseDto response = orderMapper.toResponseDto(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<OrderResponseDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(request.getStatus());
        Order order = orderService.updateOrderStatus(id, status);
        OrderResponseDto response = orderMapper.toResponseDto(order);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF', 'USER')")
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