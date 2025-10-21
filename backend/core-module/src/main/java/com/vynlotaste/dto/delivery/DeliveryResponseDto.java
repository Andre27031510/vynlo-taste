package com.vynlotaste.dto.delivery;

import com.vynlotaste.entity.Delivery;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para resposta de Delivery
 * v2.1.2 - Criado para evitar serialização de proxies Hibernate
 * Fix: HTTP 500 ao criar delivery (lazy loading)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponseDto {
    
    private Long id;
    private Long orderId;
    private String customerName;
    private String customerPhone;
    private String deliveryAddress;
    private Delivery.DeliveryStatus status;
    private Delivery.DeliverySource source;
    private String estimatedTime;
    private String distance;
    private String driverLocation;
    private String notes;
    private Long tenantId;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdate;
    
    // Campos opcionais do driver
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private String driverVehicle;
}

