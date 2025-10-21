package com.vynlotaste.dto.delivery;

import com.vynlotaste.entity.Delivery;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para resposta de Delivery
 * v2.1.3 - Adicionado campos para exibição completa na lista
 * Fix: Informações do pedido não apareciam na lista de delivery
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
    
    // ✅ CORREÇÃO: Campos para exibição na lista (compatibilidade com frontend)
    private String customer;        // Alias para customerName
    private String address;        // Alias para deliveryAddress  
    private String phone;          // Alias para customerPhone
    private String driver;         // Alias para driverName
    private BigDecimal total;       // Total do pedido
    private List<String> items;     // Lista de itens do pedido
}

