package com.vynlotaste.controller;

import com.vynlotaste.dto.delivery.DeliveryResponseDto;
import com.vynlotaste.entity.Delivery;
import com.vynlotaste.mapper.DeliveryMapper;
import com.vynlotaste.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/v1/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final DeliveryMapper deliveryMapper;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getDeliveries(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            Delivery.DeliveryStatus deliveryStatus = status != null && !status.equals("all") 
                ? Delivery.DeliveryStatus.valueOf(status.toUpperCase()) 
                : null;
            
            Page<Delivery> deliveriesPage = deliveryService.getDeliveries(deliveryStatus, search, page, limit);
            
            // ✅ CORREÇÃO: Converter para DTOs antes de retornar (evita lazy loading)
            java.util.List<DeliveryResponseDto> deliveryDtos = deliveriesPage.getContent().stream()
                .map(deliveryMapper::toResponseDto)
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "deliveries", deliveryDtos,
                "total", deliveriesPage.getTotalElements(),
                "page", page,
                "totalPages", deliveriesPage.getTotalPages()
            ));
        } catch (Exception e) {
            log.error("❌ Erro ao buscar deliveries", e);
            return ResponseEntity.ok(Map.of(
                "deliveries", java.util.List.of(),
                "total", 0,
                "page", page,
                "totalPages", 1
            ));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getDeliveryStats() {
        try {
            Map<String, Object> stats = deliveryService.getDeliveryStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching delivery stats", e);
            return ResponseEntity.ok(Map.of(
                "totalDeliveries", 0,
                "inTransit", 0,
                "preparing", 0,
                "delivered", 0,
                "problems", 0
            ));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getDeliveryById(@PathVariable Long id) {
        try {
            Delivery delivery = deliveryService.getDeliveryById(id);
            // ✅ CORREÇÃO: Converter para DTO (evita lazy loading)
            DeliveryResponseDto responseDto = deliveryMapper.toResponseDto(delivery);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            log.error("❌ Erro ao buscar delivery: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Delivery not found"));
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createDelivery(@RequestBody Map<String, Object> request) {
        try {
            // ✅ CORREÇÃO: Logs detalhados para debug
            log.info("📦 Recebendo request para criar delivery: {}", request);
            
            Long orderId = Long.valueOf(request.get("orderId").toString());
            String customerName = request.get("customerName").toString();
            String customerPhone = request.get("customerPhone").toString();
            String deliveryAddress = request.get("deliveryAddress").toString();
            Delivery.DeliverySource source = Delivery.DeliverySource.valueOf(
                request.getOrDefault("source", "WEBSITE").toString().toUpperCase()
            );
            
            log.info("🚚 Criando delivery para order_id={}, customer={}, phone={}, address={}", 
                orderId, customerName, customerPhone, deliveryAddress);
            
            Delivery delivery = deliveryService.createDelivery(
                orderId, customerName, customerPhone, deliveryAddress, source
            );
            
            // ✅ CORREÇÃO: Converter para DTO antes de retornar (evita lazy loading)
            DeliveryResponseDto responseDto = deliveryMapper.toResponseDto(delivery);
            
            log.info("✅ Delivery criado com sucesso: id={}", delivery.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (IllegalArgumentException e) {
            log.error("❌ Erro de validação ao criar delivery: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("❌ Erro interno ao criar delivery", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erro interno ao criar delivery: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateDeliveryStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String notes = request.get("notes");
            
            Delivery.DeliveryStatus newStatus = Delivery.DeliveryStatus.valueOf(status.toUpperCase());
            Delivery delivery = deliveryService.updateDeliveryStatus(id, newStatus, notes);
            
            // ✅ CORREÇÃO: Converter para DTO (evita lazy loading)
            DeliveryResponseDto responseDto = deliveryMapper.toResponseDto(delivery);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            log.error("❌ Erro ao atualizar status do delivery: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/assign-driver")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> assignDriver(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        try {
            Long driverId = request.get("driverId");
            Delivery delivery = deliveryService.assignDriver(id, driverId);
            // ✅ CORREÇÃO: Converter para DTO (evita lazy loading)
            DeliveryResponseDto responseDto = deliveryMapper.toResponseDto(delivery);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            log.error("❌ Erro ao atribuir motoboy ao delivery: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
}

