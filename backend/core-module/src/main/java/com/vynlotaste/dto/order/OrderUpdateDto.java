package com.vynlotaste.dto.order;

import com.vynlotaste.entity.Order;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para atualização de pedidos
 * v2.1.1 - Criado para endpoint PUT /v1/orders/{id}
 * Usado pelo modal de edição de pedidos
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateDto {
    
    @NotNull(message = "Status é obrigatório")
    private Order.OrderStatus status;
    
    private String deliveryAddress;
    
    private String paymentMethod;
    
    private String notes;
}

